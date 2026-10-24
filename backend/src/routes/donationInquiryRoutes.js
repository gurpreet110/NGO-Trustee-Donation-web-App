import { Router } from "express";
import {
  createDonationInquiry,
  listDonationInquiries,
  updateInquiryStatus,
} from "../controllers/donationInquiryController.js";
import { authenticate } from "../middleware/auth.js";
import { authorizeRoles } from "../middleware/roles.js";
import { donationInquiryLimiter } from "../middleware/rateLimiters.js";
import {
  donationInquirySchema,
  validateBody,
  validateObjectIdParam,
} from "../middleware/validate.js";

const router = Router();

router.post(
  "/",
  donationInquiryLimiter,
  validateBody(donationInquirySchema),
  createDonationInquiry
);

router.get(
  "/",
  authenticate,
  authorizeRoles("trustee", "admin"),
  listDonationInquiries
);

router.patch(
  "/:id/status",
  authenticate,
  authorizeRoles("trustee", "admin"),
  validateObjectIdParam("id"),
  updateInquiryStatus
);

export default router;
