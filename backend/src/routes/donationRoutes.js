import { Router } from "express";
import {
  createDonation,
  getDonation,
  listDonations,
  listMyDonations,
} from "../controllers/donationController.js";
import { authenticate } from "../middleware/auth.js";
import { authorizeRoles } from "../middleware/roles.js";
import {
  donationCreateSchema,
  donationListQuerySchema,
  validateBody,
  validateObjectIdParam,
  validateQuery,
} from "../middleware/validate.js";

const router = Router();

router.post("/", authenticate, validateBody(donationCreateSchema), createDonation);
router.get("/my", authenticate, listMyDonations);
router.get(
  "/",
  authenticate,
  authorizeRoles("trustee", "admin"),
  validateQuery(donationListQuerySchema),
  listDonations
);
router.get("/:id", authenticate, validateObjectIdParam("id"), getDonation);

export default router;
