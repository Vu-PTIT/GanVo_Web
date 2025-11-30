import Appointment from "../models/appointmentModel.js";
import { appointmentSchema } from "../validations/appointmentValidation.js";

export const createAppointment = async (req, res) => {
  try {
    const userId = req.user._id;

    const { error } = appointmentSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const newApp = await Appointment.create({
      ...req.body,
      userId,
    });

    res.status(201).json({
      message: "Tạo lịch hẹn thành công",
      data: newApp,
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

export const getMyAppointments = async (req, res) => {
  try {
    const list = await Appointment.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(list);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server" });
  }
};

export const updateAppointment = async (req, res) => {
  try {
    const userId = req.user._id;

    const appointment = await Appointment.findOne({
      _id: req.params.id,
      userId: userId,
    });

    if (!appointment)
      return res.status(404).json({ message: "Không tìm thấy lịch hẹn" });

    const { error } = appointmentSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const updated = await Appointment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json({
      message: "Cập nhật thành công",
      data: updated,
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server" });
  }
};

export const deleteAppointment = async (req, res) => {
  try {
    const userId = req.user._id;

    const appointment = await Appointment.findOne({
      _id: req.params.id,
      userId: userId,
    });

    if (!appointment)
      return res.status(404).json({ message: "Không tìm thấy lịch hẹn" });

    await Appointment.findByIdAndDelete(req.params.id);

    res.json({ message: "Xoá lịch hẹn thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server" });
  }
};
