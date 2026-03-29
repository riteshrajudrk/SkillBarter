import { Router } from "express";
import {
  createSession,
  listSessions,
  updateSessionStatus
} from "../controllers/sessionController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.use(protect);
router.get("/", listSessions);
router.post("/", createSession);
router.patch("/:id", updateSessionStatus);

export default router;
