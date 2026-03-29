import { Router } from "express";
import {
  browseUsers,
  getRecommendedMatches,
  getUserProfile,
  updateProfile
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", browseUsers);
router.get("/recommended", protect, getRecommendedMatches);
router.patch("/profile/me", protect, updateProfile);
router.get("/:id", getUserProfile);

export default router;
