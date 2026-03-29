import { Router } from "express";
import {
  completeOnboarding,
  getCurrentUser,
  googleLogin,
  login,
  register
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/google", googleLogin);
router.get("/me", protect, getCurrentUser);
router.patch("/onboarding", protect, completeOnboarding);

export default router;
