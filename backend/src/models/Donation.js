import mongoose from "mongoose";
import { formatDateOnly } from "../utils/dates.js";
import { toIdString } from "../utils/ids.js";

function isPopulatedUser(value) {
  return Boolean(
    value &&
      typeof value === "object" &&
      !(value instanceof mongoose.Types.ObjectId) &&
      value.name !== undefined
  );
}

export const DONATION_STATUSES = ["pending", "completed", "failed", "refunded"];

const donationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    campaign: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Campaign",
      required: true,
    },
    campaignTitle: { type: String, required: true, trim: true },
    amount: { type: Number, required: true, min: 1 },
    status: { type: String, enum: DONATION_STATUSES, default: "completed" },
    receiptNumber: { type: String, required: true, unique: true },
    paymentMethod: { type: String, default: "simulated" },
    transactionId: { type: String, required: true },
  },
  { timestamps: true }
);

donationSchema.index({ user: 1 });
donationSchema.index({ campaign: 1 });
donationSchema.index({ createdAt: -1 });

export function serializeDonation(doc) {
  if (!doc) return null;
  const obj = typeof doc.toObject === "function" ? doc.toObject() : doc;
  const userValue = obj.user;
  const userPopulated = isPopulatedUser(userValue);

  return {
    id: String(obj._id),
    userId: toIdString(userValue),
    campaignId: toIdString(obj.campaign),
    campaignTitle: obj.campaignTitle,
    amount: obj.amount,
    date: formatDateOnly(obj.createdAt),
    status: obj.status,
    receiptNumber: obj.receiptNumber,
    donorName: userPopulated ? userValue.name : undefined,
    createdAt: obj.createdAt,
  };
}

donationSchema.set("toJSON", {
  virtuals: false,
  transform(_doc, ret) {
    return serializeDonation(ret);
  },
});

export const Donation = mongoose.model("Donation", donationSchema);
