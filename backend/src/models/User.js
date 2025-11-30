import mongoose from "mongoose";

// --- Schema bạn bè (chỉ tên + avatar) ---
const friendSchema = new mongoose.Schema({
  name: { type: String, required: true },
  avatar: { type: String, default: "" },
});

// --- Schema người add mình / mình add (tên + avatar + tuổi + về tôi) ---
const connectionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  avatar: { type: String, default: "" },
  age: { type: Number },
  aboutMe: { type: String, default: "" },
});

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
    // ---------------------
    // 🔐 AUTH + TÀI KHOẢN
    // ---------------------
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    hashedPassword: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    
    displayName: {
      type: String,
      required: true,
      trim: true,
    },

    avatarUrl: { type: String },
    avatarId: { type: String },

    phone: {
      type: String,
      sparse: true, // cho phép null nhưng không được trùng
    },

    bio: {
      type: String,
      maxlength: 500,
    },

    // ---------------------
    // 👤 THÔNG TIN CÁ NHÂN
    // ---------------------
    birthday: { type: Date },
    gender: {
      type: String,
      enum: ["Nam", "Nữ", "Khác"],
      default: "Khác",
    },
    aboutMe: { type: String, default: "" },
    hobbies: { type: [String], default: [] },

    // thư viện ảnh
    photoLibrary: {
      type: [String],
      default: [],
    },

    // ---------------------
    // 👥 QUAN HỆ BẠN BÈ
    // ---------------------

    friends: {
      type: [friendSchema], // chỉ tên + avatar
      default: [],
    },

    addedMe: {
      type: [connectionSchema], // người khác add mình
      default: [],
    },

    iAdded: {
      type: [connectionSchema], // người mình add
      default: [],
    },
  },

  {
    timestamps: true,
  }
);


const User = mongoose.model("User", userSchema);
export default User;
