import mongoose from "mongoose";

export function isValidObjectId(value) {
  return (
    typeof value === "string" &&
    mongoose.Types.ObjectId.isValid(value) &&
    String(new mongoose.Types.ObjectId(value)) === value
  );
}

export function toIdString(value) {
  if (value == null) return null;
  if (typeof value === "object" && value._id) return String(value._id);
  if (typeof value === "object" && value.id) return String(value.id);
  return String(value);
}
