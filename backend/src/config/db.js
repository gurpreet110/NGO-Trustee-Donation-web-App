import mongoose from "mongoose";
import dns from "node:dns";
import { env } from "./env.js";

export async function connectDb() {
  try {
    dns.setServers(["8.8.8.8", "8.8.4.4"]);
  } catch {
    // Ignore if not supported in environment
  }
  mongoose.set("strictQuery", true);
  await mongoose.connect(env.MONGODB_URI);
  console.log("MongoDB connected");
}

export async function disconnectDb() {
  await mongoose.disconnect();
}
