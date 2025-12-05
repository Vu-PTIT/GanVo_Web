import express from "express";
import {
  getDashboardStats,
  getMonthlyMatches,
  getYearlyMatches,
  getRecentActivities,
  getMonthlyAppointments
} from "../controllers/dashboard.controller.js";

const router = express.Router();

// Lấy tất cả thống kê dashboard
router.get("/", getDashboardStats);

// Lấy số lượt match theo từng tháng
router.get("/matches/monthly", getMonthlyMatches);

// Lấy số lượt match theo từng năm
router.get("/matches/yearly", getYearlyMatches);

// Lấy danh sách hoạt động gần đây
router.get("/activities", getRecentActivities);

// Lấy dữ liệu lịch hẹn theo tháng
router.get("/appointments/monthly", getMonthlyAppointments);

export default router;
