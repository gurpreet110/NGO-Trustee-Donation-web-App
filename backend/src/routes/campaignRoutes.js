import { Router } from "express";
import {
  createCampaign,
  deleteCampaign,
  getCampaign,
  listCampaigns,
  listMyCampaigns,
  updateCampaign,
} from "../controllers/campaignController.js";
import { authenticate } from "../middleware/auth.js";
import { authorizeRoles } from "../middleware/roles.js";
import {
  campaignCreateSchema,
  campaignListQuerySchema,
  campaignUpdateSchema,
  validateBody,
  validateObjectIdParam,
  validateQuery,
} from "../middleware/validate.js";

const router = Router();

router.get("/", validateQuery(campaignListQuerySchema), listCampaigns);
router.get("/mine", authenticate, authorizeRoles("trustee", "admin"), listMyCampaigns);
router.get("/:id", validateObjectIdParam("id"), getCampaign);
router.post(
  "/",
  authenticate,
  authorizeRoles("trustee", "admin"),
  validateBody(campaignCreateSchema),
  createCampaign
);
router.put(
  "/:id",
  authenticate,
  authorizeRoles("trustee", "admin"),
  validateObjectIdParam("id"),
  validateBody(campaignUpdateSchema),
  updateCampaign
);
router.delete(
  "/:id",
  authenticate,
  authorizeRoles("trustee", "admin"),
  validateObjectIdParam("id"),
  deleteCampaign
);

export default router;
