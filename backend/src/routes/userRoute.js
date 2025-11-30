import express from "express";
// Sửa lỗi: Gộp import lại thành 1 dòng duy nhất
import { authMe, updateProfile } from "../controllers/userController.js";

const router = express.Router();

// Lấy thông tin bản thân (dùng để hiển thị lên trang hồ sơ)
router.get("/me", authMe);

// ---------------------------------------------------------
// LƯU Ý: Nếu bạn chưa viết hàm getUsers trong userController
// thì ĐỪNG bỏ comment dòng dưới, sẽ gây lỗi crash server.
// router.get("/", getUsers);
// ---------------------------------------------------------

// Cập nhật thông tin hồ sơ
router.put("/update", updateProfile);

export default router;