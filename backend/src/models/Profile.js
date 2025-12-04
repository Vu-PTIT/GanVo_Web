import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",        // liên kết với bảng User
      required: true,
      unique: true,       // mỗi user có 1 profile
      index: true
    },

    // Thông tin cơ bản
    fullName: { type: String, trim: true },      // tên hiển thị
    dateOfBirth: { type: Date },                 // ngày sinh
    gender: { type: String, enum: ["male", "female", "other"] },
    location: { type: String, default: "" },     // nơi ở

    // About me
    bio: { type: String, maxlength: 500, default: "" },

    // Sở thích (nhiều phần tử)
    interests: [{ type: String }],               

    // ưu tiên tìm kiếm (string đơn)
    lookingFor: { type: String, default: "" },    
  },
  { timestamps: true }
);

// Tạo field ảo tính tuổi
profileSchema.virtual('age').get(function () {
  if (!this.dateOfBirth) return null;
  const diffMs = Date.now() - this.dateOfBirth.getTime();
  return Math.floor(diffMs / (365.25 * 24 * 60 * 60 * 1000));
});

// Hiển thị virtual khi trả JSON
profileSchema.set("toJSON", { virtuals: true });
profileSchema.set("toObject", { virtuals: true });

export default mongoose.model("Profile", profileSchema);
