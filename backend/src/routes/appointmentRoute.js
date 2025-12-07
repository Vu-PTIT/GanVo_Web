import express from "express";
import {
  createAppointment,
  getMyAppointments,
  getAllAppointments,
  updateAppointment,
  deleteAppointment,
} from "../controllers/appointmentController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import { adminMiddleware } from "../middlewares/adminMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, createAppointment);
router.get("/me", authMiddleware, getMyAppointments);

router.get("/", authMiddleware, adminMiddleware, getAllAppointments);
router.put("/:id", authMiddleware, adminMiddleware, updateAppointment);
router.delete("/:id", authMiddleware, adminMiddleware, deleteAppointment);
router.get("/admin", authMiddleware, adminMiddleware, getAllAppointments);

export default router;
