import { Router } from "express";
import { getStats } from "../controllers/statsController.js";
import { authenticate } from "../middleware/auth.js";
import { authorizeRoles } from "../middleware/roles.js";

const router = Router();

router.get("/", authenticate, authorizeRoles("trustee", "admin"), getStats);

export default router;
