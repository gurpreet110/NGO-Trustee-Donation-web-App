import { ContactMessage } from "../models/ContactMessage.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createContactMessage = asyncHandler(async (req, res) => {
  const message = await ContactMessage.create({
    name: req.body.name,
    email: req.body.email,
    message: req.body.message,
  });
  res.status(201).json(message.toJSON());
});

export const listContactMessages = asyncHandler(async (req, res) => {
  const messages = await ContactMessage.find().sort({ createdAt: -1 });
  res.json(messages.map((m) => m.toJSON()));
});
