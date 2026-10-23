import { Counter } from "../models/Counter.js";

export async function nextReceiptNumber(date = new Date(), session = null) {
  const year = date.getUTCFullYear();
  const options = { upsert: true, new: true };
  if (session) options.session = session;

  const counter = await Counter.findOneAndUpdate(
    { _id: `receipt-${year}` },
    { $inc: { seq: 1 } },
    options
  );

  return `RCP-${year}-${String(counter.seq).padStart(6, "0")}`;
}
