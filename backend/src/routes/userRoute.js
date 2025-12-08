import express from "express";
import { adminMiddleware } from "../middlewares/adminMiddleware.js";
import {
  authMe,
  updateProfile,
  getUsers,
  getPreferences,
  updatePreferences,
} from "../controllers/userController.js";
import {
  getAdminStats,
  getAllUsers,
  createUser,
  updateUser,
  deleteUser
} from "../controllers/adminController.js";

const router = express.Router();

//  Lấy thông tin bản thân (dùng để hiển thị lên trang hồ sơ)
router.get("/me", authMe);

//  Tìm kiếm users
router.get("/search", getUsers);

//  Cập nhật thông tin hồ sơ
router.put("/profile", updateProfile);

//  Lấy cài đặt tìm kiếm
router.get("/preferences", getPreferences);

//  Cập nhật cài đặt tìm kiếm
router.put("/preferences", updatePreferences);

// --- ADMIN ROUTES ---
router.get("/admin/stats", adminMiddleware, getAdminStats);
router.get("/admin/users", adminMiddleware, getAllUsers);
router.post("/admin/users", adminMiddleware, createUser);
router.put("/admin/users/:id", adminMiddleware, updateUser);
router.delete("/admin/users/:id", adminMiddleware, deleteUser);

export default router;