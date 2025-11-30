import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["private", "group"],
      required: true,
    },

    members: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
    ],

    // Chỉ dùng khi là group chat
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      default: null,
    },

    groupName: { type: String },
    groupAvatar: { type: String },
  },
  { timestamps: true }
);

const Conversation = mongoose.model("Conversation", conversationSchema);
export default Conversation;
