import mongoose from "mongoose";
import { formatDateOnly } from "../utils/dates.js";

const ROLES = ["donor", "trustee", "admin"];

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, enum: ROLES, default: "donor" },
    totalDonated: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true }
);

userSchema.set("toJSON", {
  virtuals: false,
  transform(_doc, ret) {
    return {
      id: String(ret._id),
      name: ret.name,
      email: ret.email,
      role: ret.role,
      joinedDate: formatDateOnly(ret.createdAt),
      totalDonated: ret.totalDonated ?? 0,
    };
  },
});

export const USER_ROLES = ROLES;
export const User = mongoose.model("User", userSchema);
