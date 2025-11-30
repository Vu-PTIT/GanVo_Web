import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    // --- AUTH & ACCOUNT ---
    username: { type: String, required: true, unique: true, trim: true, lowercase: true },
    hashedPassword: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    displayName: { type: String, required: true, trim: true },
    
    // Avatar & Photos
    avatarUrl: { type: String, default: "" },
    avatarId: { type: String }, // ID từ Cloudinary
    photos: [
      {
        url: { type: String, required: true },
        id: { type: String },
      }
    ],

    // --- THÔNG TIN CÁ NHÂN ---
    bio: { type: String, maxlength: 500, default: "" }, // Giới thiệu bản thân
    gender: { type: String, enum: ["male", "female", "other"] },
    dateOfBirth: { type: Date },
    location: { type: String, default: "Việt Nam" },
    
    // --- SỞ THÍCH & TÌM KIẾM ---
    interests: [{ type: String }], // Ví dụ: ["Du lịch", "Đọc sách"]
    lookingFor: { type: String, default: "" }, // Ví dụ: "Hẹn hò nghiêm túc"

    // --- TRẠNG THÁI ---
    isOnline: { type: Boolean, default: false },
    lastSeen: { type: Date, default: Date.now },
    
    // --- AI FEATURE ---
    // Vector embedding để gợi ý kết bạn thông minh
    embedding: { 
      type: [Number], 
      default: [],
      select: false // Không select mặc định để nhẹ query
    }, 
  },
  { timestamps: true }
);

// Virtual field tính tuổi từ ngày sinh
userSchema.virtual('age').get(function() {
  if (!this.dateOfBirth) return null;
  const diff_ms = Date.now() - this.dateOfBirth.getTime();
  const age_dt = new Date(diff_ms); 
  return Math.abs(age_dt.getUTCFullYear() - 1970);
});

// Config để khi res.json() sẽ hiện field 'age'
userSchema.set('toJSON', { virtuals: true });
userSchema.set('toObject', { virtuals: true });

export default mongoose.model("User", userSchema);