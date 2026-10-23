import { Campaign, applyGoalCompletion, serializeCampaign } from "../models/Campaign.js";
import { Donation } from "../models/Donation.js";
import { Trustee } from "../models/Trustee.js";
import { getOrCreateTrusteeProfile, getTrusteeProfileForUser } from "../services/trusteeProfileService.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { parseDateOnly } from "../utils/dates.js";
import { isValidObjectId } from "../utils/ids.js";
import { escapeRegex } from "../utils/money.js";

const TRUSTEE_POPULATE = { path: "trustee", select: "name role image" };

async function loadCampaignOr404(id) {
  const campaign = await Campaign.findById(id).populate(TRUSTEE_POPULATE);
  if (!campaign) throw new ApiError(404, "Campaign not found");
  return campaign;
}

async function assertCanManage(req, campaign) {
  if (req.user.role === "admin") return;
  const profile = await getTrusteeProfileForUser(req.user._id);
  if (!profile || String(campaign.trustee._id || campaign.trustee) !== String(profile._id)) {
    throw new ApiError(403, "You do not have permission to modify this campaign");
  }
}

export const listCampaigns = asyncHandler(async (req, res) => {
  const { status, category, search, trusteeId } = req.query;
  const filter = {};

  if (status) filter.status = status;
  if (category) filter.category = category;
  if (trusteeId) {
    if (!isValidObjectId(trusteeId)) throw new ApiError(404, "Resource not found");
    filter.trustee = trusteeId;
  }
  if (search) {
    const rx = new RegExp(escapeRegex(search), "i");
    filter.$or = [{ title: rx }, { shortDescription: rx }];
  }

  const campaigns = await Campaign.find(filter)
    .sort({ createdAt: -1 })
    .populate(TRUSTEE_POPULATE);

  res.json(campaigns.map(serializeCampaign));
});

export const listMyCampaigns = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.user.role !== "admin") {
    const profile = await getTrusteeProfileForUser(req.user._id);
    if (!profile) return res.json([]);
    filter.trustee = profile._id;
  }

  const campaigns = await Campaign.find(filter)
    .sort({ createdAt: -1 })
    .populate(TRUSTEE_POPULATE);

  res.json(campaigns.map(serializeCampaign));
});

export const getCampaign = asyncHandler(async (req, res) => {
  const campaign = await loadCampaignOr404(req.params.id);
  res.json(serializeCampaign(campaign));
});

export const createCampaign = asyncHandler(async (req, res) => {
  const body = req.body;
  let trustee;

  if (req.user.role === "admin") {
    if (!body.trusteeId) {
      throw new ApiError(400, "trusteeId is required when creating a campaign as admin", [
        { field: "trusteeId", message: "trusteeId is required" },
      ]);
    }
    if (!isValidObjectId(body.trusteeId)) {
      throw new ApiError(404, "Trustee not found");
    }
    trustee = await Trustee.findById(body.trusteeId);
    if (!trustee) throw new ApiError(404, "Trustee not found");
  } else {
    trustee = await getOrCreateTrusteeProfile(req.user);
  }

  const campaign = await Campaign.create({
    title: body.title,
    shortDescription: body.shortDescription || "",
    description: body.description || "",
    category: body.category,
    image: body.image || "",
    goal: body.goal,
    raised: 0,
    status: body.status || "active",
    deadline: parseDateOnly(body.deadline),
    trustee: trustee._id,
  });

  applyGoalCompletion(campaign);
  if (campaign.isModified("status")) await campaign.save();

  await campaign.populate(TRUSTEE_POPULATE);
  res.status(201).json(serializeCampaign(campaign));
});

export const updateCampaign = asyncHandler(async (req, res) => {
  const campaign = await Campaign.findById(req.params.id);
  if (!campaign) throw new ApiError(404, "Campaign not found");
  await assertCanManage(req, campaign);

  const body = req.body;
  if (body.title !== undefined) campaign.title = body.title;
  if (body.shortDescription !== undefined) campaign.shortDescription = body.shortDescription;
  if (body.description !== undefined) campaign.description = body.description;
  if (body.category !== undefined) campaign.category = body.category;
  if (body.image !== undefined) campaign.image = body.image;
  if (body.goal !== undefined) campaign.goal = body.goal;
  if (body.deadline !== undefined) campaign.deadline = parseDateOnly(body.deadline);
  if (body.status !== undefined) campaign.status = body.status;

  applyGoalCompletion(campaign);
  await campaign.save();
  await campaign.populate(TRUSTEE_POPULATE);
  res.json(serializeCampaign(campaign));
});

export const deleteCampaign = asyncHandler(async (req, res) => {
  const campaign = await Campaign.findById(req.params.id);
  if (!campaign) throw new ApiError(404, "Campaign not found");
  await assertCanManage(req, campaign);

  const donationCount = await Donation.countDocuments({ campaign: campaign._id });
  if (donationCount > 0) {
    throw new ApiError(
      409,
      "This campaign has donations and cannot be deleted. Set its status to closed instead."
    );
  }

  await campaign.deleteOne();
  res.json({ success: true });
});
