import express from "express";
import { 
  authMe, 
  updateProfile, 
  getUsers,
  getPreferences, 
  updatePreferences 
} from "../controllers/userController.js";

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

export default router;