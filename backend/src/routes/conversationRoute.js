import express from "express";
import { getOrCreateDirectConversation, getConversations, getConversationById, deleteConversation } from "../controllers/conversationController.js";

const router = express.Router();

router.get("/", getConversations);
router.post("/direct", getOrCreateDirectConversation);
router.get("/:id", getConversationById);
router.delete("/:id", deleteConversation);

export default router;
