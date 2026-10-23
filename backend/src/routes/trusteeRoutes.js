import { Router } from "express";
import {
  createTrustee,
  deleteTrustee,
  getTrustee,
  listTrustees,
  updateTrustee,
} from "../controllers/trusteeController.js";
import { authenticate } from "../middleware/auth.js";
import { authorizeRoles } from "../middleware/roles.js";
import {
  trusteeSchema,
  trusteeUpdateSchema,
  validateBody,
  validateObjectIdParam,
} from "../middleware/validate.js";

const router = Router();

router.get("/", listTrustees);
router.get("/:id", validateObjectIdParam("id"), getTrustee);
router.post("/", authenticate, authorizeRoles("admin"), validateBody(trusteeSchema), createTrustee);
router.put(
  "/:id",
  authenticate,
  authorizeRoles("admin"),
  validateObjectIdParam("id"),
  validateBody(trusteeUpdateSchema),
  updateTrustee
);
router.delete(
  "/:id",
  authenticate,
  authorizeRoles("admin"),
  validateObjectIdParam("id"),
  deleteTrustee
);

export default router;
