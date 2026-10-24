import test from "node:test";
import assert from "node:assert/strict";

import {
  registerSchema,
  loginSchema,
  donationCreateSchema,
  campaignCreateSchema,
  contactSchema,
  roleUpdateSchema,
  donationInquirySchema,
} from "../src/middleware/validate.js";

test("registerSchema accepts valid donor input and lowercases email", () => {
  const parsed = registerSchema.safeParse({
    name: "Jane Donor",
    email: "JANE@EXAMPLE.COM",
    password: "StrongPass123",
  });

  assert.equal(parsed.success, true);
  assert.equal(parsed.data.email, "jane@example.com");
  assert.equal(parsed.data.name, "Jane Donor");
});

test("registerSchema rejects weak password", () => {
  const parsed = registerSchema.safeParse({
    name: "Jane Donor",
    email: "jane@example.com",
    password: "short",
  });

  assert.equal(parsed.success, false);
  assert.equal(parsed.error.issues[0].message, "Password must be at least 8 characters");
});

test("loginSchema requires a non-empty password", () => {
  const parsed = loginSchema.safeParse({
    email: "jane@example.com",
    password: "",
  });

  assert.equal(parsed.success, false);
});

test("donationCreateSchema rejects invalid amounts", () => {
  const parsed = donationCreateSchema.safeParse({
    campaignId: "507f1f77bcf86cd799439011",
    amount: 0,
  });

  assert.equal(parsed.success, false);
  assert.match(parsed.error.issues[0].message, /at least 1/i);
});

test("campaignCreateSchema rejects a past deadline and invalid category", () => {
  const badDeadline = campaignCreateSchema.safeParse({
    title: "Test Campaign",
    category: "Wrong",
    goal: 1000,
    deadline: "2000-01-01",
  });

  assert.equal(badDeadline.success, false);
  assert.ok(badDeadline.error.issues.some((issue) => issue.path.includes("category")));
  assert.ok(badDeadline.error.issues.some((issue) => issue.path.includes("deadline")));
});

test("contactSchema rejects empty messages and malformed email", () => {
  const parsed = contactSchema.safeParse({
    name: "Jane",
    email: "not-an-email",
    message: "",
  });

  assert.equal(parsed.success, false);
  assert.ok(parsed.error.issues.some((issue) => issue.path.includes("email")));
  assert.ok(parsed.error.issues.some((issue) => issue.path.includes("message")));
});

test("roleUpdateSchema only accepts donor, trustee, admin roles", () => {
  const valid = roleUpdateSchema.safeParse({ role: "trustee" });
  const invalid = roleUpdateSchema.safeParse({ role: "superuser" });

  assert.equal(valid.success, true);
  assert.equal(invalid.success, false);
});

test("donationInquirySchema accepts valid inquiry and normalizes email", () => {
  const parsed = donationInquirySchema.safeParse({
    campaignId: "507f1f77bcf86cd799439011",
    name: "Aarav Sharma",
    email: "AARAV@EXAMPLE.COM",
    phone: "+91 9876543210",
    location: "Mumbai",
    donorType: "Working Professional",
    occupation: "Software Engineer",
    incomeRange: "₹10,00,000 - ₹25,00,000",
    donationInterest: "Monthly support",
    intendedAmount: "₹5,000 / month",
    message: "Interested in supporting education initiatives.",
  });

  assert.equal(parsed.success, true);
  assert.equal(parsed.data.email, "aarav@example.com");
  assert.equal(parsed.data.name, "Aarav Sharma");
  assert.equal(parsed.data.donorType, "Working Professional");
});

test("donationInquirySchema rejects invalid email, invalid donor type, and missing campaign", () => {
  const invalidEmail = donationInquirySchema.safeParse({
    campaignId: "507f1f77bcf86cd799439011",
    name: "Aarav",
    email: "bad-email",
    donorType: "Working Professional",
    donationInterest: "One-time donation",
  });
  assert.equal(invalidEmail.success, false);
  assert.ok(invalidEmail.error.issues.some((i) => i.path.includes("email")));

  const invalidDonorType = donationInquirySchema.safeParse({
    campaignId: "507f1f77bcf86cd799439011",
    name: "Aarav",
    email: "aarav@example.com",
    donorType: "Astronaut",
    donationInterest: "One-time donation",
  });
  assert.equal(invalidDonorType.success, false);
  assert.ok(invalidDonorType.error.issues.some((i) => i.path.includes("donorType")));

  const missingCampaign = donationInquirySchema.safeParse({
    campaignId: "",
    name: "Aarav",
    email: "aarav@example.com",
    donorType: "Individual",
    donationInterest: "One-time donation",
  });
  assert.equal(missingCampaign.success, false);
  assert.ok(missingCampaign.error.issues.some((i) => i.path.includes("campaignId")));
});
