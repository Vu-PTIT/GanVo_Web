import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    // Người nhận thông báo
    recipientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    
    // Người thực hiện hành động (người gây ra thông báo)
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    
    // Loại thông báo
    type: {
      type: String,
      enum: [
        "like",           // Ai đó thích bạn
        "match",          // Match với ai đó
        "message",        // Tin nhắn mới
        "friend_request", // Lời mời kết bạn
        "friend_accept",  // Chấp nhận kết bạn
      ],
      required: true,
    },
    
    // Nội dung thông báo
    title: {
      type: String,
      required: true,
    },
    
    message: {
      type: String,
    },
    
    // Link đến đối tượng liên quan
    relatedId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "relatedType",
    },
    
    relatedType: {
      type: String,
      enum: ["Match", "Message", "Conversation", "User"],
    },
    
    // Trạng thái đọc
    isRead: {
      type: Boolean,
      default: false,
    },
    
    // Thời gian đọc
    readAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Index để tối ưu query
notificationSchema.index({ recipientId: 1, isRead: 1, createdAt: -1 });
notificationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 2592000 }); // Tự xóa sau 30 ngày

export default mongoose.model("Notification", notificationSchema);