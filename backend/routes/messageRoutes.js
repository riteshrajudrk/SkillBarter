import { Router } from "express";
import {
  getContacts,
  getConversation,
  markConversationRead,
  sendMessage
} from "../controllers/messageController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.use(protect);
router.get("/contacts", getContacts);
router.get("/:partnerId", getConversation);
router.post("/", sendMessage);
router.patch("/:partnerId/read", markConversationRead);

export default router;
