import mongoose from "mongoose";
import { env } from "../config/env.js";
import { ApiError } from "../utils/ApiError.js";

export function notFoundHandler(req, res, next) {
  next(new ApiError(404, `Route ${req.method} ${req.originalUrl} not found`));
}

export function errorHandler(err, req, res, _next) {
  if (err instanceof ApiError) {
    const body = { message: err.message };
    if (err.errors?.length) body.errors = err.errors;
    return res.status(err.statusCode).json(body);
  }

  if (err instanceof mongoose.Error.CastError) {
    return res.status(404).json({ message: "Resource not found" });
  }

  if (err instanceof mongoose.Error.ValidationError) {
    const errors = Object.values(err.errors).map((item) => ({
      field: item.path,
      message: item.message,
    }));
    return res.status(400).json({ message: "Validation failed", errors });
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern || err.keyValue || {})[0];
    const message =
      field === "email"
        ? "An account with this email already exists"
        : field
          ? `A record with this ${field} already exists`
          : "Duplicate value";
    return res.status(409).json({ message });
  }

  if (err.message === "Not allowed by CORS") {
    return res.status(403).json({ message: "Origin not allowed by CORS" });
  }

  const status = err.statusCode || err.status || 500;
  const isProd = env.NODE_ENV === "production";
  const message =
    status === 500 && isProd ? "Internal server error" : err.message || "Internal server error";

  if (!isProd) {
    console.error(err);
  }

  return res.status(status).json({ message });
}
