import { Router } from "express";
import { createContactMessage, listContactMessages } from "../controllers/contactController.js";
import { authenticate } from "../middleware/auth.js";
import { authorizeRoles } from "../middleware/roles.js";
import { contactLimiter } from "../middleware/rateLimiters.js";
import { contactSchema, validateBody } from "../middleware/validate.js";

const router = Router();

router.post("/", contactLimiter, validateBody(contactSchema), createContactMessage);
router.get("/", authenticate, authorizeRoles("trustee", "admin"), listContactMessages);

export default router;
