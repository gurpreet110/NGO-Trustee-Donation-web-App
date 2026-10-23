import { User } from "../models/User.js";
import { getOrCreateTrusteeProfile } from "../services/trusteeProfileService.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const listUsers = asyncHandler(async (req, res) => {
  const users = await User.find().sort({ createdAt: -1 });
  res.json(users.map((u) => u.toJSON()));
});

export const getUser = asyncHandler(async (req, res) => {
  const isSelf = String(req.user._id) === req.params.id;
  if (!isSelf && req.user.role !== "admin") {
    throw new ApiError(403, "You do not have permission to view this user");
  }

  const user = await User.findById(req.params.id);
  if (!user) throw new ApiError(404, "User not found");
  res.json(user.toJSON());
});

export const updateUserRole = asyncHandler(async (req, res) => {
  const { role } = req.body;
  if (String(req.user._id) === req.params.id) {
    throw new ApiError(400, "You cannot change your own role");
  }

  const user = await User.findById(req.params.id);
  if (!user) throw new ApiError(404, "User not found");

  if (user.role === "admin" && role !== "admin") {
    const adminCount = await User.countDocuments({ role: "admin" });
    if (adminCount <= 1) {
      throw new ApiError(400, "Cannot demote the last remaining admin");
    }
  }

  user.role = role;
  await user.save();

  if (role === "trustee") {
    await getOrCreateTrusteeProfile(user);
  }

  res.json(user.toJSON());
});
