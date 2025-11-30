import express from "express";
import { getExplorations, getMatches, swipe } from "../controllers/matchController.js";

const router = express.Router();

// Endpoint lấy danh sách khám phá (những người chưa match/chưa tương tác)
// GET /api/matches/explore
router.get("/explore", getExplorations);

// Endpoint lấy danh sách đã match (bạn bè)
// GET /api/matches/list
router.get("/list", getMatches);

// Endpoint thực hiện hành động Like hoặc Dislike
// POST /api/matches/swipe
// Body: { targetUserId: "...", action: "like" | "dislike" }
router.post("/swipe", swipe);

export default router;