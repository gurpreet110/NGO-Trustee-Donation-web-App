import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

function parseClientOrigins(raw) {
  return String(raw || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
}

export const env = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: Number(process.env.PORT) || 5000,
  MONGODB_URI: process.env.MONGODB_URI || "",
  JWT_SECRET: process.env.JWT_SECRET || "",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",
  CLIENT_URL: process.env.CLIENT_URL || "http://localhost:5173",
  SEED_PASSWORD: process.env.SEED_PASSWORD || "ChangeMe@123",
};

export const clientOrigins = parseClientOrigins(env.CLIENT_URL);

export function assertRequiredEnv() {
  const missing = [];
  if (!env.MONGODB_URI) missing.push("MONGODB_URI");
  if (!env.JWT_SECRET) missing.push("JWT_SECRET");
  if (missing.length) {
    console.error(
      `Missing required environment variable${missing.length > 1 ? "s" : ""}: ${missing.join(", ")}. Copy .env.example to .env and fill them in.`
    );
    process.exit(1);
  }
}
