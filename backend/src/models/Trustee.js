import mongoose from "mongoose";
import { toIdString } from "../utils/ids.js";

const trusteeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true },
    bio: { type: String, default: "", trim: true },
    image: { type: String, default: "", trim: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

trusteeSchema.index(
  { userId: 1 },
  { unique: true, partialFilterExpression: { userId: { $type: "objectId" } } }
);

trusteeSchema.set("toJSON", {
  virtuals: false,
  transform(_doc, ret) {
    return {
      id: String(ret._id),
      name: ret.name,
      role: ret.role,
      bio: ret.bio || "",
      image: ret.image || "",
      userId: ret.userId ? toIdString(ret.userId) : null,
    };
  },
});

export const Trustee = mongoose.model("Trustee", trusteeSchema);
