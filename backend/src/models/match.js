import mongoose from "mongoose";

const matchSchema = new mongoose.Schema(
  {
    // Người thực hiện hành động (Like/Dislike)
    requester: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
    // Người nhận hành động
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
    // ĐẾM SỐ LƯỢT MATCH (lần tạo match)
    matchCount: {
      type: Number,
      default: 1
    }

  },
  { timestamps: true }
);

// Index 1 chiều duy nhất: Một người A chỉ được tạo 1 record với người B
matchSchema.index({ requester: 1, recipient: 1 }, { unique: true });

export default mongoose.model("Match", matchSchema);