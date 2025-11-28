import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, trim: true, lowercase: true },
    hashedPassword: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    displayName: { type: String, required: true, trim: true },
    avatarUrl: { type: String, default: "" },
    avatarId: { type: String },
    
    // --- THÔNG TIN CƠ BẢN ---
    bio: { type: String, maxlength: 500, default: "" }, // Mục "Về tôi"
    gender: { type: String, enum: ["male", "female", "other"] }, // Mục "Giới tính"
    dateOfBirth: { type: Date }, // Mục "Ngày sinh"
    location: { type: String, default: "Việt Nam" }, // Địa chỉ
    
    // --- SỞ THÍCH & TÌM KIẾM ---
    interests: [{ type: String }], // Mục "Sở thích" (ví dụ: ["Du lịch", "Đọc sách"])
    lookingFor: { type: String, default: "" }, // Mục "Ưu tiên tìm kiếm"

    // --- THƯ VIỆN ẢNH ---
    // Lưu mảng các URL ảnh
    photos: [
      {
        url: { type: String, required: true },
        id: { type: String }, // ID từ Cloudinary (nếu dùng)
      }
    ],
    
    // --- TRẠNG THÁI ---
    isOnline: { type: Boolean, default: false },
    lastSeen: { type: Date, default: Date.now },
      // Thêm trường này: Mảng chứa các số thực
    embedding: { 
      type: [Number], 
      default: [],
      select: false // Mặc định không lấy ra để đỡ nặng query, chỉ lấy khi cần
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

// Đảm bảo khi convert sang JSON sẽ có trường 'age'
userSchema.set('toJSON', { virtuals: true });
userSchema.set('toObject', { virtuals: true });

export default mongoose.model("User", userSchema);