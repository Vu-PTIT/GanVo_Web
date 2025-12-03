// src/models/Appointment.js
import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Thông tin lịch hẹn
    dateTime: {
      type: Date,
      required: true,
    },

    city: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      enum: ["Cà Phê", "Ăn trưa", "Ăn tối", "Đi dạo"],
      required: true,
    },

    reason: {
      type: String,
      default: "",
    },

    latitude: {
      type: Number,
      required: true,
    },

    longitude: {
      type: Number,
      required: true,
    },

    // trạng thái: pending / approved / canceled
    status: {
      type: String,
      enum: ["pending", "approved", "canceled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Appointment", appointmentSchema);
