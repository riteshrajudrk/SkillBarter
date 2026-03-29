import { Router } from "express";
import {
  createCategory,
  getAdminAnalytics,
  listUsersForAdmin,
  moderateReview,
  toggleBanUser
} from "../controllers/adminController.js";
import { protect } from "../middleware/authMiddleware.js";
import { requireAdmin } from "../middleware/adminMiddleware.js";

const router = Router();

router.use(protect, requireAdmin);
router.get("/analytics", getAdminAnalytics);
router.get("/users", listUsersForAdmin);
router.patch("/users/:id/ban", toggleBanUser);
router.delete("/reviews/:id", moderateReview);
router.post("/categories", createCategory);

export default router;
