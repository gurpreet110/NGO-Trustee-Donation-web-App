import mongoose from "mongoose";

const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 },
});

counterSchema.set("toJSON", {
  virtuals: false,
  transform(_doc, ret) {
    return {
      id: String(ret._id),
      seq: ret.seq,
    };
  },
});

export const Counter = mongoose.model("Counter", counterSchema);
