import express from "express";
import { getPersonProfile, getPersonPhotos } from "../controllers/personController.js";
import { getExplorations, getMatches } from "../controllers/matchController.js";

const router = express.Router();

// Lấy danh sách khám phá (chưa match)
// GET /api/people/explore
router.get("/explore", getExplorations);

// Lấy danh sách đã match (bạn bè)
// GET /api/people/matches
router.get("/matches", getMatches);

// ---------------------------------------------------------

// Lấy thông tin chi tiết hồ sơ người khác
// GET /api/people/:id
router.get("/:id", getPersonProfile);

// Lấy thư viện ảnh của người khác
// GET /api/people/:id/photos
router.get("/:id/photos", getPersonPhotos);

export default router;