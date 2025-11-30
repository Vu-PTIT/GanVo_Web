import mongoose from "mongoose";
const matchSchema = new mongoose.Schema(
  {
    // Người thực hiện hành động (Like/Dislike)
    requester: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
    // Người nhận (người được hiển thị trên thẻ)
    recipient: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
    // Trạng thái mối quan hệ
    status: {
      type: String,
      enum: ["pending", "matched", "rejected"], 
      default: "pending",
    },
  },
  { timestamps: true }
);

// Đảm bảo 1 cặp chỉ có 1 bản ghi tương tác theo chiều xuôi (requester -> recipient)
// Giúp tránh việc một người like cùng một người nhiều lần
matchSchema.index({ requester: 1, recipient: 1 }, { unique: true });

export default mongoose.model("Match", matchSchema);