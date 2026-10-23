import { Router } from "express";
import authRoutes from "./authRoutes.js";
import campaignRoutes from "./campaignRoutes.js";
import contactRoutes from "./contactRoutes.js";
import donationRoutes from "./donationRoutes.js";
import statsRoutes from "./statsRoutes.js";
import trusteeRoutes from "./trusteeRoutes.js";
import userRoutes from "./userRoutes.js";

const router = Router();

router.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

router.use("/auth", authRoutes);
router.use("/campaigns", campaignRoutes);
router.use("/donations", donationRoutes);
router.use("/trustees", trusteeRoutes);
router.use("/users", userRoutes);
router.use("/contact", contactRoutes);
router.use("/stats", statsRoutes);

export default router;
