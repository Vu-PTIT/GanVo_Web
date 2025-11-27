import express from "express";
import { authMe, updateProfile } from "../controllers/userController.js";

const router = express.Router();

// Lấy thông tin bản thân (dùng để hiển thị lên trang hồ sơ)
router.get("/me", authMe);

// Cập nhật thông tin hồ sơ
router.put("/update", updateProfile);

export default router;