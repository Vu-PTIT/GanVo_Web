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
