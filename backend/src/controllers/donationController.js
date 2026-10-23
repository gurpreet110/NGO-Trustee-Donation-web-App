import mongoose from "mongoose";
import { Campaign } from "../models/Campaign.js";
import { Donation, serializeDonation } from "../models/Donation.js";
import { User } from "../models/User.js";
import { simulatePayment } from "../services/paymentService.js";
import { nextReceiptNumber } from "../services/receiptService.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { isValidObjectId } from "../utils/ids.js";
import { roundMoney } from "../utils/money.js";

const USER_POPULATE = { path: "user", select: "name" };

function isTxnUnsupported(err) {
  const msg = String(err?.message || "");
  return (
    err?.code === 20 ||
    /Transaction numbers are only allowed on a replica set/i.test(msg) ||
    /replica set/i.test(msg)
  );
}

async function persistDonation({ user, campaign, amount, payment, createdAt }) {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const receiptNumber = await nextReceiptNumber(createdAt, session);
    const [donation] = await Donation.create(
      [
        {
          user: user._id,
          campaign: campaign._id,
          campaignTitle: campaign.title,
          amount,
          status: payment.status,
          receiptNumber,
          paymentMethod: "simulated",
          transactionId: payment.transactionId,
          createdAt,
        },
      ],
      { session }
    );

    const updatedCampaign = await Campaign.findByIdAndUpdate(
      campaign._id,
      { $inc: { raised: amount } },
      { new: true, session }
    );
    if (updatedCampaign.status === "active" && updatedCampaign.raised >= updatedCampaign.goal) {
      updatedCampaign.status = "completed";
      await updatedCampaign.save({ session });
    }

    await User.findByIdAndUpdate(
      user._id,
      { $inc: { totalDonated: amount } },
      { session }
    );

    await session.commitTransaction();
    return donation;
  } catch (err) {
    try {
      await session.abortTransaction();
    } catch {
      // Session may not have an in-progress transaction.
    }
    throw err;
  } finally {
    session.endSession();
  }
}

async function persistDonationFallback({ user, campaign, amount, payment, createdAt }) {
  const receiptNumber = await nextReceiptNumber(createdAt);
  const donation = await Donation.create({
    user: user._id,
    campaign: campaign._id,
    campaignTitle: campaign.title,
    amount,
    status: payment.status,
    receiptNumber,
    paymentMethod: "simulated",
    transactionId: payment.transactionId,
    createdAt,
  });

  try {
    const updatedCampaign = await Campaign.findByIdAndUpdate(
      campaign._id,
      { $inc: { raised: amount } },
      { new: true }
    );
    if (updatedCampaign.status === "active" && updatedCampaign.raised >= updatedCampaign.goal) {
      updatedCampaign.status = "completed";
      await updatedCampaign.save();
    }
  } catch (err) {
    await Donation.findByIdAndDelete(donation._id);
    throw err;
  }

  try {
    await User.findByIdAndUpdate(user._id, { $inc: { totalDonated: amount } });
  } catch (err) {
    await Campaign.findByIdAndUpdate(campaign._id, { $inc: { raised: -amount } });
    const rolled = await Campaign.findById(campaign._id);
    if (rolled && rolled.status === "completed" && rolled.raised < rolled.goal) {
      rolled.status = "active";
      await rolled.save();
    }
    await Donation.findByIdAndDelete(donation._id);
    throw err;
  }

  return donation;
}

export const createDonation = asyncHandler(async (req, res) => {
  const { campaignId, amount: rawAmount } = req.body;
  if (!isValidObjectId(campaignId)) {
    throw new ApiError(404, "Campaign not found");
  }

  const campaign = await Campaign.findById(campaignId);
  if (!campaign) throw new ApiError(404, "Campaign not found");
  if (campaign.status !== "active") {
    throw new ApiError(400, "Donations are only accepted for active campaigns");
  }

  const amount = roundMoney(rawAmount);
  const payment = await simulatePayment(amount);
  if (payment.status !== "completed") {
    throw new ApiError(400, "Payment could not be completed");
  }

  const payload = {
    user: req.user,
    campaign,
    amount,
    payment,
    createdAt: new Date(),
  };

  let donation;
  try {
    donation = await persistDonation(payload);
  } catch (err) {
    if (!isTxnUnsupported(err)) throw err;
    donation = await persistDonationFallback(payload);
  }

  await donation.populate(USER_POPULATE);
  res.status(201).json(serializeDonation(donation));
});

export const listMyDonations = asyncHandler(async (req, res) => {
  const donations = await Donation.find({ user: req.user._id })
    .sort({ createdAt: -1 })
    .populate(USER_POPULATE);
  res.json(donations.map(serializeDonation));
});

export const listDonations = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.campaignId) {
    if (!isValidObjectId(req.query.campaignId)) {
      throw new ApiError(404, "Resource not found");
    }
    filter.campaign = req.query.campaignId;
  }

  const donations = await Donation.find(filter)
    .sort({ createdAt: -1 })
    .populate(USER_POPULATE);
  res.json(donations.map(serializeDonation));
});

export const getDonation = asyncHandler(async (req, res) => {
  const donation = await Donation.findById(req.params.id).populate(USER_POPULATE);
  if (!donation) throw new ApiError(404, "Donation not found");

  const isOwner = String(donation.user._id || donation.user) === String(req.user._id);
  const privileged = req.user.role === "admin" || req.user.role === "trustee";
  if (!isOwner && !privileged) {
    throw new ApiError(403, "You do not have permission to view this donation");
  }

  res.json(serializeDonation(donation));
});
