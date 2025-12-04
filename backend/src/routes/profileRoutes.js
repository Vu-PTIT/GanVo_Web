import express from "express";
import ProfileController from "../controllers/profile.controller.js"; // nếu export default class
import authMiddleware from "../middlewares/auth.middleware.js"; // middleware check login

const router = express.Router();

// --- API Lấy profile của chính mình ---
router.get("/me", authMiddleware, ProfileController.getMyProfile);

// --- API Lấy profile người khác theo id ---
router.get("/:id", authMiddleware, ProfileController.getProfileById);

// --- API cập nhật profile ---
router.put("/update", authMiddleware, ProfileController.updateProfile);

// --- API upload avatar ---
router.post("/avatar", authMiddleware, ProfileController.updateAvatar);

export default router;
