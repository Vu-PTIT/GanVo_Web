import express from "express";
import { getExplorations, getMatches, swipe } from "../controllers/matchController.js";
import { protectedRoute } from "../middlewares/authMiddleware.js"; // Nhớ thêm middleware bảo vệ

const router = express.Router();

// Tất cả các route này đều cần đăng nhập
router.use(protectedRoute);

// GET /api/matches/explore
router.get("/explore", getExplorations);

// GET /api/matches/list
router.get("/list", getMatches);

// POST /api/matches/swipe
router.post("/swipe", swipe);

export default router;