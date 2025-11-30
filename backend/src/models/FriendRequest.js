import mongoose from "mongoose";

const friendRequestSchema = new mongoose.Schema(
  {
    // Người gửi yêu cầu
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Người nhận yêu cầu
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Tin nhắn kèm lời mời (tùy chọn)
    message: {
      type: String,
      maxlength: 300,
      default: "",
    },
    // Trạng thái: pending (chờ), accepted (đồng ý), rejected (từ chối)
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

// Đảm bảo tính duy nhất: A chỉ gửi cho B được 1 yêu cầu tại một thời điểm
// Tránh spam request
friendRequestSchema.index({ senderId: 1, receiverId: 1 }, { unique: true });

const FriendRequest = mongoose.model("FriendRequest", friendRequestSchema);
export default FriendRequest;