import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { User } from "../models/User.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

function readBearerToken(req) {
  const header = req.headers.authorization || "";
  const [scheme, token] = header.split(" ");
  if (!token || scheme.toLowerCase() !== "bearer") return null;
  return token;
}

async function loadUserFromToken(token) {
  let payload;
  try {
    payload = jwt.verify(token, env.JWT_SECRET);
  } catch {
    throw new ApiError(401, "Invalid or expired token");
  }
  const userId = payload.id;
  if (!userId) throw new ApiError(401, "Invalid or expired token");
  const user = await User.findById(userId);
  if (!user) throw new ApiError(401, "Invalid or expired token");
  return user;
}

export const authenticate = asyncHandler(async (req, res, next) => {
  const token = readBearerToken(req);
  if (!token) throw new ApiError(401, "Authentication required");
  req.user = await loadUserFromToken(token);
  next();
});

export const optionalAuth = asyncHandler(async (req, res, next) => {
  const token = readBearerToken(req);
  if (!token) return next();
  req.user = await loadUserFromToken(token);
  next();
});
