import mongoose from "mongoose";

const friendSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    friendId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Lưu thông tin snapshot của bạn
    friendName: { type: String, required: true },
    friendAvatar: { type: String },
    friendPhone: { type: String },
    friendEmail: { type: String },

    // accepted = bạn bè thật
    // blocked = chặn nhau
    status: {
      type: String,
      default: "accepted",
      enum: ["accepted", "blocked"],
    },
  },
  { timestamps: true }
);

const Friend = mongoose.model("Friend", friendSchema);
export default Friend;
