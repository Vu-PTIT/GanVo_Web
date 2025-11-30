import express from "express";
import {
  createAppointment,
  getMyAppointments,
  updateAppointment,
  deleteAppointment,
} from "../controllers/appointmentController.js";

const router = express.Router();

router.post("/", createAppointment);
router.get("/", getMyAppointments);
router.put("/:id", updateAppointment);
router.delete("/:id", deleteAppointment);

export default router;
