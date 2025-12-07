import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    creatorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
    },

    eventType: {
      type: String,
      required: true,
    },

    location: {
      type: String,
      required: true,
    },

    startTime: {
      type: Date,
      required: true,
    },

    endTime: {
      type: Date,
    },

    maxParticipants: {
      type: Number,
      default: 10,
      min: 1,
    },

    // người đã join
    participants: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User" }
    ],

    // người đang chờ duyệt
    pendingRequests: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User" }
    ],
  },
  { timestamps: true }
);

const Event = mongoose.model("Event", eventSchema);
export default Event;
