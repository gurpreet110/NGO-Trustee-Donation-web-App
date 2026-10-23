import mongoose from "mongoose";
import { formatDateOnly } from "../utils/dates.js";

const contactMessageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    message: { type: String, required: true, trim: true, maxlength: 2000 },
  },
  { timestamps: true }
);

contactMessageSchema.index({ createdAt: -1 });

contactMessageSchema.set("toJSON", {
  virtuals: false,
  transform(_doc, ret) {
    return {
      id: String(ret._id),
      name: ret.name,
      email: ret.email,
      message: ret.message,
      date: formatDateOnly(ret.createdAt),
    };
  },
});

export const ContactMessage = mongoose.model("ContactMessage", contactMessageSchema);
