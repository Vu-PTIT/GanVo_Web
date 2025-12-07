// backend/src/routes/dashboardRoute.js
import express from "express";
import {
  getDashboardStats,
  getChartData,
  getRecentActivities,
  getDashboardOverview
} from "../controllers/dashboardController.js";
import { protectedRoute } from "../middlewares/authMiddleware.js";
const router = express.Router();

// Tất cả routes đều cần đăng nhập
router.use(protectedRoute);

// GET /api/dashboard/overview - Lấy tất cả dữ liệu dashboard (1 API)
router.get("/overview", getDashboardOverview);

// GET /api/dashboard/stats - Lấy thống kê tổng quan
router.get("/stats", getDashboardStats);

// GET /api/dashboard/chart?months=10 - Lấy dữ liệu biểu đồ
router.get("/chart", getChartData);

// GET /api/dashboard/activities?limit=20 - Lấy hoạt động gần đây
router.get("/activities", getRecentActivities);

export default router;
