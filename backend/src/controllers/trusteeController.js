import { Campaign } from "../models/Campaign.js";
import { Trustee } from "../models/Trustee.js";
import { User } from "../models/User.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { isValidObjectId } from "../utils/ids.js";

async function resolveUserId(userId) {
  if (userId === undefined) return undefined;
  if (userId === null || userId === "") return null;
  if (!isValidObjectId(userId)) throw new ApiError(404, "User not found");
  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, "User not found");
  return user._id;
}

export const listTrustees = asyncHandler(async (req, res) => {
  const trustees = await Trustee.find().sort({ createdAt: -1 });
  res.json(trustees.map((t) => t.toJSON()));
});

export const getTrustee = asyncHandler(async (req, res) => {
  const trustee = await Trustee.findById(req.params.id);
  if (!trustee) throw new ApiError(404, "Trustee not found");
  res.json(trustee.toJSON());
});

export const createTrustee = asyncHandler(async (req, res) => {
  const payload = {
    name: req.body.name,
    role: req.body.role,
    bio: req.body.bio || "",
    image: req.body.image || "",
  };
  const userId = await resolveUserId(req.body.userId);
  if (userId) payload.userId = userId;
  const trustee = await Trustee.create(payload);
  res.status(201).json(trustee.toJSON());
});

export const updateTrustee = asyncHandler(async (req, res) => {
  const trustee = await Trustee.findById(req.params.id);
  if (!trustee) throw new ApiError(404, "Trustee not found");

  if (req.body.name !== undefined) trustee.name = req.body.name;
  if (req.body.role !== undefined) trustee.role = req.body.role;
  if (req.body.bio !== undefined) trustee.bio = req.body.bio;
  if (req.body.image !== undefined) trustee.image = req.body.image;
  if (req.body.userId !== undefined) {
    const userId = await resolveUserId(req.body.userId);
    if (userId) trustee.userId = userId;
    else trustee.userId = undefined;
  }

  await trustee.save();
  res.json(trustee.toJSON());
});

export const deleteTrustee = asyncHandler(async (req, res) => {
  const trustee = await Trustee.findById(req.params.id);
  if (!trustee) throw new ApiError(404, "Trustee not found");

  const campaignCount = await Campaign.countDocuments({ trustee: trustee._id });
  if (campaignCount > 0) {
    throw new ApiError(409, "This trustee has campaigns and cannot be deleted");
  }

  await trustee.deleteOne();
  res.json({ success: true });
});
