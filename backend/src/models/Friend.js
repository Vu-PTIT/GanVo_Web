import mongoose from "mongoose";

const friendSchema = new mongoose.Schema(
  {
    // Người dùng hiện tại (Me)
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    
    // Bạn bè của họ (Friend)
    friendId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // --- SNAPSHOT INFO ---
    // Lưu lại thông tin cơ bản tại thời điểm kết bạn 
    // Giúp hiển thị nhanh danh sách mà không cần populate liên tục
    friendName: { type: String, required: true },
    friendAvatar: { type: String, default: "" },
    friendPhone: { type: String, default: "" },
    friendEmail: { type: String, default: "" },

    // --- TRẠNG THÁI ---
    // accepted: Bạn bè bình thường
    // blocked: Đã chặn người này
    status: {
      type: String,
      enum: ["accepted", "blocked"],
      default: "accepted",
    },
  },
  {
    timestamps: true,
  }
);

// Tạo index để tìm kiếm nhanh danh sách bạn bè của một user
friendSchema.index({ userId: 1 });

// Đảm bảo tính duy nhất: Một user không thể kết bạn 2 lần với cùng 1 người
friendSchema.index({ userId: 1, friendId: 1 }, { unique: true });

const Friend = mongoose.model("Friend", friendSchema);
export default Friend;