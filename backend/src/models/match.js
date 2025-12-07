import mongoose from "mongoose";

const matchSchema = new mongoose.Schema(
  {
    requester: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
    recipient: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
    // Mở rộng status
    status: {
      type: String,
      enum: [
        "pending",     // Người A like B, chờ B phản hồi
        "matched",     // Cả 2 đều like nhau
        "rejected",    // Người A dislike B
        "friend_requested", // NEW: Gửi lời mời kết bạn trực tiếp (không qua swipe)
        "friends"      // NEW: Đã chấp nhận lời mời, trở thành bạn
      ],
      default: "pending",
    },
    
    // N Tin nhắn kèm lời mời kết bạn
    requestMessage: {
      type: String,
      maxlength: 300,
      default: ""
    },
    
    //  Người bắt đầu cuộc trò chuyện
    conversationInitiator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    
    //  ID của conversation (nếu đã match và chat)
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation"
    },
    
    // NEW: Mức độ tương đồng AI (0-1)
    similarityScore: {
      type: Number,
      min: 0,
      max: 1
    }
  },
  { timestamps: true }
);

matchSchema.index({ requester: 1, recipient: 1 }, { unique: true });
matchSchema.index({ status: 1, requester: 1 });
matchSchema.index({ status: 1, recipient: 1 });

export default mongoose.model("Match", matchSchema);