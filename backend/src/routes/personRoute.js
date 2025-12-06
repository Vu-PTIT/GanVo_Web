import express from "express";
import { getPersonProfile, getPersonPhotos } from "../controllers/personController.js";

const router = express.Router();

router.get("/:id", getPersonProfile);          // Xem hồ sơ người khác
router.get("/:id/photos", getPersonPhotos);    // Xem ảnh của người khác

export default router;