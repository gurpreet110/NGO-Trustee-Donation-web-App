import mongoose from "mongoose";
import { formatDateOnly } from "../utils/dates.js";
import { toIdString } from "../utils/ids.js";

function isPopulatedTrustee(value) {
  return Boolean(
    value &&
      typeof value === "object" &&
      !(value instanceof mongoose.Types.ObjectId) &&
      value.name !== undefined
  );
}

export const CAMPAIGN_CATEGORIES = [
  "Water",
  "Education",
  "Emergency",
  "Health",
  "Environment",
  "Food",
];

export const CAMPAIGN_STATUSES = ["active", "completed", "closed"];

const campaignSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    shortDescription: { type: String, default: "", trim: true },
    description: { type: String, default: "", trim: true },
    category: { type: String, enum: CAMPAIGN_CATEGORIES, required: true },
    image: { type: String, default: "", trim: true },
    goal: { type: Number, required: true, min: 0.01 },
    raised: { type: Number, default: 0, min: 0 },
    status: { type: String, enum: CAMPAIGN_STATUSES, default: "active" },
    deadline: { type: Date, required: true },
    trustee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trustee",
      required: true,
    },
    impactMetric: { type: String, default: "", trim: true },
    impactValue: { type: String, default: "", trim: true },
  },
  { timestamps: true }
);

campaignSchema.index({ status: 1, category: 1 });
campaignSchema.index({ trustee: 1 });
campaignSchema.index({ createdAt: -1 });

export function serializeCampaign(doc) {
  if (!doc) return null;
  const obj = typeof doc.toObject === "function" ? doc.toObject() : doc;
  const trusteeValue = obj.trustee;
  const trusteePopulated = isPopulatedTrustee(trusteeValue);

  const trusteeId = trusteePopulated
    ? toIdString(trusteeValue)
    : trusteeValue
      ? String(trusteeValue)
      : null;

  const payload = {
    id: String(obj._id),
    title: obj.title,
    shortDescription: obj.shortDescription || "",
    description: obj.description || "",
    category: obj.category,
    image: obj.image || "",
    goal: obj.goal,
    raised: obj.raised ?? 0,
    status: obj.status,
    deadline: formatDateOnly(obj.deadline),
    trusteeId,
    impactMetric: obj.impactMetric || "",
    impactValue: obj.impactValue || "",
  };

  if (trusteePopulated) {
    payload.trustee = {
      id: toIdString(trusteeValue),
      name: trusteeValue.name,
      role: trusteeValue.role,
      image: trusteeValue.image || "",
    };
  }

  return payload;
}

campaignSchema.set("toJSON", {
  virtuals: false,
  transform(_doc, ret) {
    return serializeCampaign(ret);
  },
});

export function applyGoalCompletion(campaign) {
  if (
    campaign &&
    campaign.status === "active" &&
    Number(campaign.raised) >= Number(campaign.goal)
  ) {
    campaign.status = "completed";
  }
  return campaign;
}

export const Campaign = mongoose.model("Campaign", campaignSchema);
