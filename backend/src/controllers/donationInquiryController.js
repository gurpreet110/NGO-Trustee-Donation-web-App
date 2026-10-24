import { Campaign } from "../models/Campaign.js";
import { DonationInquiry, serializeDonationInquiry } from "../models/DonationInquiry.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { isValidObjectId } from "../utils/ids.js";

export const createDonationInquiry = asyncHandler(async (req, res) => {
  const {
    campaignId,
    name,
    email,
    phone,
    location,
    donorType,
    occupation,
    incomeRange,
    donationInterest,
    intendedAmount,
    message,
  } = req.body;

  if (!isValidObjectId(campaignId)) {
    throw new ApiError(404, "Selected campaign was not found");
  }

  const campaign = await Campaign.findById(campaignId);
  if (!campaign) {
    throw new ApiError(404, "Selected campaign was not found");
  }

  const inquiry = await DonationInquiry.create({
    campaign: campaign._id,
    campaignTitle: campaign.title,
    name,
    email,
    phone: phone || "",
    location: location || "",
    donorType,
    occupation: occupation || "",
    incomeRange: incomeRange || "Prefer not to say",
    donationInterest,
    intendedAmount: intendedAmount || "",
    message: message || "",
    status: "new",
  });

  res.status(201).json({
    success: true,
    message:
      "Thank you for your interest in supporting our cause! Your response has been received. Our team may contact you with the next steps.",
    inquiry: serializeDonationInquiry(inquiry),
  });
});

export const listDonationInquiries = asyncHandler(async (req, res) => {
  const { campaignId, status } = req.query;
  const filter = {};

  if (campaignId) {
    if (!isValidObjectId(campaignId)) {
      throw new ApiError(404, "Resource not found");
    }
    filter.campaign = campaignId;
  }

  if (status) {
    filter.status = status;
  }

  const inquiries = await DonationInquiry.find(filter)
    .sort({ createdAt: -1 })
    .populate({ path: "campaign", select: "title category image" });

  res.json(inquiries.map(serializeDonationInquiry));
});

export const updateInquiryStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!isValidObjectId(id)) {
    throw new ApiError(404, "Inquiry not found");
  }

  if (!["new", "contacted", "closed"].includes(status)) {
    throw new ApiError(400, "Invalid status. Must be 'new', 'contacted', or 'closed'.");
  }

  const inquiry = await DonationInquiry.findByIdAndUpdate(
    id,
    { status },
    { new: true }
  );

  if (!inquiry) {
    throw new ApiError(404, "Inquiry not found");
  }

  res.json(serializeDonationInquiry(inquiry));
});
