import mongoose from "mongoose";

const dashboardSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // mỗi user chỉ có 1 dashboard
    },

    // --- Match statistics ---
    matchesPerMonth: {
      type: Map, // key = "YYYY-MM", value = Number
      of: Number,
      default: {},
    },
    matchesPerYear: {
      type: Map, // key = "YYYY", value = Number
      of: Number,
      default: {},
    },

    // --- Appointment statistics ---
    totalAppointments: {
      type: Number,
      default: 0,
    },
    appointmentsPerMonth: {
      type: Map, // key = "YYYY-MM", value = Number
      of: Number,
      default: {},
    },

    // --- Message statistics ---
    totalMessagesSent: {
      type: Number,
      default: 0,
    },

    // --- Recent activity ---
    recentActivity: [
      {
        content: { type: String, required: true }, // nội dung hoạt động
        createdAt: { type: Date, default: Date.now }, // thời gian hoạt động
      },
    ],
  },
  { timestamps: true } // createdAt & updatedAt
);

export default mongoose.model("Dashboard", dashboardSchema);
