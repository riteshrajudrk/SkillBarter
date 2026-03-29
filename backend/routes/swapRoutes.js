import { Router } from "express";
import {
  createSwapRequest,
  getSwapRequests,
  updateSwapStatus
} from "../controllers/swapController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.use(protect);
router.get("/", getSwapRequests);
router.post("/", createSwapRequest);
router.patch("/:id", updateSwapStatus);

export default router;
