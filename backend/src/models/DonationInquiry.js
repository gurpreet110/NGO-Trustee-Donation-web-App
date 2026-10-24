import mongoose from "mongoose";
import { formatDateOnly } from "../utils/dates.js";
import { toIdString } from "../utils/ids.js";

export const DONOR_TYPES = [
  "Individual",
  "Student",
  "Working Professional",
  "Business/Organization",
  "Other",
];

export const DONATION_INTERESTS = [
  "One-time donation",
  "Monthly support",
  "Corporate support",
  "Volunteering",
  "Just exploring",
];

export const INQUIRY_STATUSES = ["new", "contacted", "closed"];

const donationInquirySchema = new mongoose.Schema(
  {
    campaign: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Campaign",
      required: true,
    },
    campaignTitle: {
      type: String,
      required: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      maxlength: 255,
    },
    phone: {
      type: String,
      trim: true,
      default: "",
      maxlength: 30,
    },
    location: {
      type: String,
      trim: true,
      default: "",
      maxlength: 100,
    },
    donorType: {
      type: String,
      enum: DONOR_TYPES,
      required: true,
    },
    occupation: {
      type: String,
      trim: true,
      default: "",
      maxlength: 100,
    },
    incomeRange: {
      type: String,
      trim: true,
      default: "Prefer not to say",
      maxlength: 100,
    },
    donationInterest: {
      type: String,
      enum: DONATION_INTERESTS,
      required: true,
    },
    intendedAmount: {
      type: String,
      trim: true,
      default: "",
      maxlength: 100,
    },
    message: {
      type: String,
      trim: true,
      default: "",
      maxlength: 2000,
    },
    status: {
      type: String,
      enum: INQUIRY_STATUSES,
      default: "new",
    },
  },
  { timestamps: true }
);

donationInquirySchema.index({ createdAt: -1 });
donationInquirySchema.index({ campaign: 1 });
donationInquirySchema.index({ email: 1 });

export function serializeDonationInquiry(doc) {
  if (!doc) return null;
  const obj = typeof doc.toObject === "function" ? doc.toObject() : doc;

  return {
    id: String(obj._id),
    campaignId: toIdString(obj.campaign),
    campaignTitle: obj.campaignTitle,
    name: obj.name,
    email: obj.email,
    phone: obj.phone || "",
    location: obj.location || "",
    donorType: obj.donorType,
    occupation: obj.occupation || "",
    incomeRange: obj.incomeRange || "Prefer not to say",
    donationInterest: obj.donationInterest,
    intendedAmount: obj.intendedAmount || "",
    message: obj.message || "",
    status: obj.status,
    createdAt: obj.createdAt,
    date: formatDateOnly(obj.createdAt),
  };
}

donationInquirySchema.set("toJSON", {
  virtuals: false,
  transform(_doc, ret) {
    return serializeDonationInquiry(ret);
  },
});

export const DonationInquiry = mongoose.model("DonationInquiry", donationInquirySchema);
