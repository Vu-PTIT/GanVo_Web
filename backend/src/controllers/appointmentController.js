import Appointment from "../models/appointmentModel.js";
import { createAppointmentSchema } from "../validations/appointmentValidation.js";

export const createAppointment = async (req, res) => {
  try {
    const { error } = createAppointmentSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });

    const appointment = await Appointment.create({
      ...req.body,
      userId: req.user.userId,
    });

    return res.status(201).json({
      message: "Tạo lịch hẹn thành công!",
      appointment,
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const getMyAppointments = async (req, res) => {
  const data = await Appointment.find({ userId: req.user.userId }).sort({
    dateTime: 1,
  });
  res.json(data);
};

export const getAllAppointments = async (req, res) => {
  const data = await Appointment.find()
    .populate("userId", "username displayName email")
    .sort({ dateTime: 1 });

  res.json(data);
};

export const updateAppointment = async (req, res) => {
  const updated = await Appointment.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(updated);
};

export const deleteAppointment = async (req, res) => {
  await Appointment.findByIdAndDelete(req.params.id);
  res.json({ message: "Đã xóa lịch hẹn" });
};
