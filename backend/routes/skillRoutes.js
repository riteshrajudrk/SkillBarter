import { Router } from "express";
import {
  createSkill,
  getMarketplace,
  listSkillCatalog
} from "../controllers/skillController.js";
import { protect } from "../middleware/authMiddleware.js";
import { requireAdmin } from "../middleware/adminMiddleware.js";

const router = Router();

router.get("/marketplace", getMarketplace);
router.get("/catalog", listSkillCatalog);
router.post("/", protect, requireAdmin, createSkill);

export default router;
