import { getDashboardStats } from "../services/statsService.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getStats = asyncHandler(async (req, res) => {
  const stats = await getDashboardStats();
  res.json(stats);
});
