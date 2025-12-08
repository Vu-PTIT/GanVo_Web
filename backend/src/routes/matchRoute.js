// routes/matchRoute.js
import express from "express";
import {
  getExplorations,
  swipe,
  getMatches,
  getWhoLikesMe,
  getMyLikes,
  unmatch,
} from "../controllers/matchController.js";
import { protectedRoute } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Tất cả routes đều cần đăng nhập
router.use(protectedRoute);

// KHÁM PHÁ & SWIPE
// GET /api/match/explore?minAge=20&maxAge=30&gender=female&location=Hà Nội
router.get("/explore", getExplorations);

// POST /api/match/swipe
// Body: { targetUserId: "123", action: "like" | "dislike" }
router.post("/swipe", swipe);

// DANH SÁCH MATCH
// GET /api/match/list - Những người đã match
router.get("/list", getMatches);

// GET /api/match/likes - Ai đã like mình (chưa match)
router.get("/likes", getWhoLikesMe);

// GET /api/match/my-likes - Mình đã like ai (chưa match)
router.get("/my-likes", getMyLikes);

// DELETE /api/match/:matchId - Xóa match hoặc Hủy like (Cancel Request)
router.delete("/:matchId", unmatch);

export default router;