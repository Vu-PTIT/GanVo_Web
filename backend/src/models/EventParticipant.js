import mongoose from "mongoose";

const eventParticipantSchema = new mongoose.Schema(
  {
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    role: {
      type: String,
      enum: ["host", "co-host", "member"],
      default: "member",
    },

    status: {
      type: String,
      enum: ["invited", "accepted", "declined", "removed"],
      default: "invited",
    },

    joinedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

// Không cho 1 user vào event 2 lần
eventParticipantSchema.index({ eventId: 1, userId: 1 }, { unique: true });

export default mongoose.model("EventParticipant", eventParticipantSchema);
