import { Trustee } from "../models/Trustee.js";

export async function getTrusteeProfileForUser(userId) {
  return Trustee.findOne({ userId });
}

export async function getOrCreateTrusteeProfile(user) {
  const existing = await Trustee.findOne({ userId: user._id });
  if (existing) return existing;

  try {
    return await Trustee.create({
      name: user.name,
      role: "Trustee",
      bio: "",
      image: "",
      userId: user._id,
    });
  } catch (err) {
    if (err.code === 11000) {
      return Trustee.findOne({ userId: user._id });
    }
    throw err;
  }
}
