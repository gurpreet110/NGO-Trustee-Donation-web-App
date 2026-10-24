import test, { before, after } from "node:test";
import assert from "node:assert/strict";
import app from "../src/app.js";
import { Campaign } from "../src/models/Campaign.js";
import { DonationInquiry } from "../src/models/DonationInquiry.js";
import { connectDb, disconnectDb } from "../src/config/db.js";

let server;
let baseUrl;
let dbConnected = false;

before(async () => {
  server = app.listen(0);
  const port = server.address().port;
  baseUrl = `http://127.0.0.1:${port}/api`;

  try {
    await connectDb();
    dbConnected = true;
  } catch (err) {
    console.warn("DB not connected for integration test:", err.message);
  }
});

after(async () => {
  if (server) server.close();
  if (dbConnected) {
    await disconnectDb();
  }
});

test("POST /api/donation-inquiries rejects request with missing required fields", async () => {
  const res = await fetch(`${baseUrl}/donation-inquiries`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: "Test User",
      email: "not-an-email",
    }),
  });

  assert.equal(res.status, 400);
  const data = await res.json();
  assert.equal(data.message, "Validation failed");
  assert.ok(data.errors.some((e) => e.field === "campaignId"));
  assert.ok(data.errors.some((e) => e.field === "email"));
});

test("POST /api/donation-inquiries handles non-existent campaign safely", async () => {
  if (!dbConnected) return;

  const res = await fetch(`${baseUrl}/donation-inquiries`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      campaignId: "507f1f77bcf86cd799439011",
      name: "Test User",
      email: "test@example.com",
      donorType: "Individual",
      donationInterest: "One-time donation",
    }),
  });

  assert.equal(res.status, 404);
  const data = await res.json();
  assert.match(data.message, /campaign/i);
});

test("POST /api/donation-inquiries stores inquiry in database and DOES NOT increase campaign raised total", async () => {
  if (!dbConnected) return;

  // Find a campaign to submit inquiry for
  const campaign = await Campaign.findOne();
  if (!campaign) return;

  const originalRaised = campaign.raised;

  const payload = {
    campaignId: String(campaign._id),
    name: "Dr. Alok Verma",
    email: "alok.verma@example.com",
    phone: "+91 9811223344",
    location: "Bengaluru",
    donorType: "Working Professional",
    occupation: "Surgeon",
    incomeRange: "₹25,00,000+",
    donationInterest: "Corporate support",
    intendedAmount: "₹1,00,000",
    message: "Seeking CSR partnership for healthcare initiatives.",
  };

  const res = await fetch(`${baseUrl}/donation-inquiries`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  assert.equal(res.status, 201);
  const body = await res.json();
  assert.equal(body.success, true);
  assert.match(body.message, /Thank you for your interest/i);
  assert.equal(body.inquiry.name, "Dr. Alok Verma");
  assert.equal(body.inquiry.email, "alok.verma@example.com");

  // Verify that campaign.raised was NOT increased
  const reloadedCampaign = await Campaign.findById(campaign._id);
  assert.equal(reloadedCampaign.raised, originalRaised);

  // Verify that DonationInquiry exists in database
  const inquiryInDb = await DonationInquiry.findById(body.inquiry.id);
  assert.ok(inquiryInDb);
  assert.equal(inquiryInDb.email, "alok.verma@example.com");
  assert.equal(inquiryInDb.status, "new");

  // Cleanup test inquiry
  await DonationInquiry.findByIdAndDelete(body.inquiry.id);
});
