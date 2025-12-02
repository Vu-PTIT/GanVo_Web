import express from "express";
import {
  getExplorations,
  swipe,
  getMatches,
  sendFriendRequest,
  acceptFriendRequest,
  declineFriendRequest,
  getAllFriends,
  getFriendRequests
} from "../controllers/matchController.js";
import { protectedRoute } from "../middlewares/authMiddleware.js";

const router = express.Router();
router.use(protectedRoute);

// SWIPE MODE (Giống Tinder)
router.get("/explore", getExplorations);       // Khám phá người lạ (có AI sort)
router.post("/swipe", swipe);                   // Like/Dislike
router.get("/matches", getMatches);             // Danh sách đã match

// TRADITIONAL FRIEND REQUEST MODE 
router.post("/friends/request", sendFriendRequest);           // Gửi lời mời kết bạn
router.post("/friends/request/:requestId/accept", acceptFriendRequest);
router.post("/friends/request/:requestId/decline", declineFriendRequest);
router.get("/friends/requests", getFriendRequests);           // Lời mời đã gửi/nhận
router.get("/friends", getAllFriends);                        // Tất cả bạn bè (matched + friends)

export default router;