import { z } from "zod";
import { ApiError } from "../utils/ApiError.js";
import { isValidObjectId } from "../utils/ids.js";
import { hasMaxTwoDecimals } from "../utils/money.js";
import { isDateOnlyString, parseDateOnly, utcToday } from "../utils/dates.js";
import { USER_ROLES } from "../models/User.js";
import { CAMPAIGN_CATEGORIES, CAMPAIGN_STATUSES } from "../models/Campaign.js";

function formatZodErrors(error) {
  return error.issues.map((issue) => ({
    field: issue.path.join(".") || "body",
    message: issue.message,
  }));
}

export function validateBody(schema) {
  return (req, res, next) => {
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      return next(new ApiError(400, "Validation failed", formatZodErrors(parsed.error)));
    }
    req.body = parsed.data;
    next();
  };
}

export function validateQuery(schema) {
  return (req, res, next) => {
    const parsed = schema.safeParse(req.query);
    if (!parsed.success) {
      return next(new ApiError(400, "Validation failed", formatZodErrors(parsed.error)));
    }
    for (const key of Object.keys(req.query)) {
      delete req.query[key];
    }
    Object.assign(req.query, parsed.data);
    next();
  };
}

export function validateObjectIdParam(param = "id") {
  return (req, res, next) => {
    if (!isValidObjectId(req.params[param])) {
      return next(new ApiError(404, "Resource not found"));
    }
    next();
  };
}

const optionalUrl = z
  .string()
  .trim()
  .optional()
  .refine((value) => !value || z.string().url().safeParse(value).success, {
    message: "Must be a valid URL",
  });

export const registerSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  email: z.string().trim().email("Valid email is required").transform((v) => v.toLowerCase()),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const loginSchema = z.object({
  email: z.string().trim().email("Valid email is required").transform((v) => v.toLowerCase()),
  password: z.string().min(1, "Password is required"),
});

const categoryEnum = /** @type {[string, ...string[]]} */ (CAMPAIGN_CATEGORIES);
const statusEnum = /** @type {[string, ...string[]]} */ (CAMPAIGN_STATUSES);
const roleEnum = /** @type {[string, ...string[]]} */ (USER_ROLES);

export const campaignCreateSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  shortDescription: z.string().trim().optional().default(""),
  description: z.string().trim().optional().default(""),
  category: z.enum(categoryEnum, { errorMap: () => ({ message: "Invalid category" }) }),
  image: optionalUrl,
  goal: z
    .number({ invalid_type_error: "Goal must be a number" })
    .positive("Goal must be a positive number")
    .refine(hasMaxTwoDecimals, "Goal cannot have more than 2 decimal places"),
  deadline: z
    .string()
    .refine(isDateOnlyString, "Deadline must be YYYY-MM-DD")
    .refine((value) => {
      const date = parseDateOnly(value);
      return date && date >= utcToday();
    }, "Deadline cannot be in the past"),
  status: z.enum(statusEnum).optional(),
  trusteeId: z.string().optional(),
});

export const campaignUpdateSchema = z.object({
  title: z.string().trim().min(1, "Title is required").optional(),
  shortDescription: z.string().trim().optional(),
  description: z.string().trim().optional(),
  category: z.enum(categoryEnum, { errorMap: () => ({ message: "Invalid category" }) }).optional(),
  image: optionalUrl,
  goal: z
    .number({ invalid_type_error: "Goal must be a number" })
    .positive("Goal must be a positive number")
    .refine(hasMaxTwoDecimals, "Goal cannot have more than 2 decimal places")
    .optional(),
  deadline: z.string().refine(isDateOnlyString, "Deadline must be YYYY-MM-DD").optional(),
  status: z.enum(statusEnum).optional(),
});

export const campaignListQuerySchema = z.object({
  status: z.enum(statusEnum).optional(),
  category: z.enum(categoryEnum).optional(),
  search: z.string().optional(),
  trusteeId: z.string().optional(),
});

export const donationCreateSchema = z.object({
  campaignId: z.string().min(1, "campaignId is required"),
  amount: z
    .number({ invalid_type_error: "Amount must be a number" })
    .min(1, "Amount must be at least 1")
    .max(500000, "Amount cannot exceed 500000")
    .refine(hasMaxTwoDecimals, "Amount cannot have more than 2 decimal places"),
});

export const donationListQuerySchema = z.object({
  campaignId: z.string().optional(),
});

export const trusteeSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  role: z.string().trim().min(1, "Role is required"),
  bio: z.string().trim().optional().default(""),
  image: optionalUrl,
  userId: z.string().nullable().optional(),
});

export const trusteeUpdateSchema = z.object({
  name: z.string().trim().min(1).optional(),
  role: z.string().trim().min(1).optional(),
  bio: z.string().trim().optional(),
  image: optionalUrl,
  userId: z.string().nullable().optional(),
});

export const roleUpdateSchema = z.object({
  role: z.enum(roleEnum, { errorMap: () => ({ message: "Role must be donor, trustee, or admin" }) }),
});

export const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  email: z.string().trim().email("Valid email is required").transform((v) => v.toLowerCase()),
  message: z
    .string()
    .trim()
    .min(1, "Message is required")
    .max(2000, "Message cannot exceed 2000 characters"),
});
