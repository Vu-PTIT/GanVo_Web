import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    dateTime: { type: String, required: true },
    city: { type: String, required: true },
    type: { type: String, required: true },
    reason: { type: String, default: "" },

    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Appointment", appointmentSchema);
