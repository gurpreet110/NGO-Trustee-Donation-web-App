import { Router } from "express";
import { getUser, listUsers, updateUserRole } from "../controllers/userController.js";
import { authenticate } from "../middleware/auth.js";
import { authorizeRoles } from "../middleware/roles.js";
import { roleUpdateSchema, validateBody, validateObjectIdParam } from "../middleware/validate.js";

const router = Router();

router.get("/", authenticate, authorizeRoles("admin"), listUsers);
router.patch(
  "/:id/role",
  authenticate,
  authorizeRoles("admin"),
  validateObjectIdParam("id"),
  validateBody(roleUpdateSchema),
  updateUserRole
);
router.get("/:id", authenticate, validateObjectIdParam("id"), getUser);

export default router;
