import express from "express";
import {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  deleteAllNotifications,
} from "../controllers/notificationController.js";
import { protectedRoute } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Tất cả routes đều cần đăng nhập
router.use(protectedRoute);

// GET /api/notifications - Lấy danh sách thông báo
// Query params: ?limit=20&unreadOnly=true
router.get("/", getNotifications);

// GET /api/notifications/unread-count - Đếm số thông báo chưa đọc
router.get("/unread-count", getUnreadCount);

// PUT /api/notifications/:id/read - Đánh dấu 1 thông báo đã đọc
router.put("/:id/read", markAsRead);

// PUT /api/notifications/read-all - Đánh dấu tất cả đã đọc
router.put("/read-all", markAllAsRead);

// DELETE /api/notifications/:id - Xóa 1 thông báo
router.delete("/:id", deleteNotification);

// DELETE /api/notifications - Xóa tất cả thông báo
router.delete("/", deleteAllNotifications);

export default router;