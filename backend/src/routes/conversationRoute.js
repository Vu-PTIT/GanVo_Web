import express from "express";
import { getOrCreateDirectConversation, getConversations, getConversationById } from "../controllers/conversationController.js";

const router = express.Router();

router.get("/", getConversations);
router.post("/direct", getOrCreateDirectConversation);
router.get("/:id", getConversationById);

export default router;
