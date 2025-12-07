import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    // AUTH & ACCOUNT
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

    // ẢNH & AVATAR
    avatarUrl: {
      type: String,
      default: "",
    },

    avatarId: { type: String },

    photos: [
      {
        url: { type: String, required: true },
        id: { type: String },
      },
    ],

    // THÔNG TIN CÁ NHÂN
    bio: {
      type: String,
      maxlength: 500,
      default: "",
    },

    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },

    dateOfBirth: { type: Date },

    location: {
      type: String,
      default: "Việt Nam",
    },

    // SỞ THÍCH
    interests: [{ type: String }],

    lookingFor: {
      type: String,
      default: "",
    },

    // TRẠNG THÁI
    isOnline: {
      type: Boolean,
      default: false,
    },

    lastSeen: {
      type: Date,
      default: Date.now,
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    // AI EMBEDDING
    embedding: {
      type: [Number],
      default: [],
      select: false,
    },

    // SEARCH PREFERENCES 
    searchPreferences: {
      minAge: { type: Number, default: 18 },
      maxAge: { type: Number, default: 40 },
      gender: {
        type: String,
        enum: ["all", "male", "female", "other"],
        default: "all",
      },
      maxDistance: { type: Number, default: 50 }, // km
    },
  },

  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// VIRTUAL FIELD TÍNH TUỔI
userSchema.virtual("age").get(function () {
  if (!this.dateOfBirth) return null;
  const diff = Date.now() - this.dateOfBirth.getTime();
  const age = new Date(diff).getUTCFullYear() - 1970;
  return age;
});

// INDEXES 
userSchema.index({ location: 1 });
userSchema.index({ gender: 1 });
userSchema.index({ dateOfBirth: 1 });

export default mongoose.model("User", userSchema);
