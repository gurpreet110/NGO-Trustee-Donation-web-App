import { Router } from "express";
import { login, me, register } from "../controllers/authController.js";
import { authenticate } from "../middleware/auth.js";
import { authLimiter } from "../middleware/rateLimiters.js";
import { loginSchema, registerSchema, validateBody } from "../middleware/validate.js";

const router = Router();

router.use(authLimiter);
router.post("/register", validateBody(registerSchema), register);
router.post("/login", validateBody(loginSchema), login);
router.get("/me", authenticate, me);

export default router;
