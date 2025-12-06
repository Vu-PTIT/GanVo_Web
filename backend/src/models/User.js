// models/User.js - CẬP NHẬT
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    // --- AUTH & ACCOUNT ---
    username: { 
      type: String, 
      required: true, 
      unique: true, 
      trim: true, 
      lowercase: true 
    },
    hashedPassword: { 
      type: String, 
      required: true 
    },
    email: { 
      type: String, 
      required: true, 
      unique: true, 
      lowercase: true, 
      trim: true 
    },
    displayName: { 
      type: String, 
      required: true, 
      trim: true 
    },
    
    // Avatar & Photos
    avatarUrl: { 
      type: String, 
      default: "" 
    },
    avatarId: { 
      type: String 
    },
    photos: [
      {
        url: { type: String, required: true },
        id: { type: String },
      }
    ],

    // --- THÔNG TIN CÁ NHÂN ---
    bio: { 
      type: String, 
      maxlength: 500, 
      default: "" 
    },
    gender: { 
      type: String, 
      enum: ["male", "female", "other"] 
    },
    dateOfBirth: { 
      type: Date 
    },
    location: { 
      type: String, 
      default: "Việt Nam" 
    },
    
    // --- SỞ THÍCH & TÌM KIẾM ---
    interests: [{ type: String }],
    lookingFor: { 
      type: String, 
      default: "" 
    },

    // --- TRẠNG THÁI ---
    isOnline: { 
      type: Boolean, 
      default: false 
    },
    lastSeen: { 
      type: Date, 
      default: Date.now 
    },
    
    // --- AI FEATURE ---
    embedding: { 
      type: [Number], 
      default: [],
      select: false  // Không select mặc định
    },
    
    // --- CÀI ĐẶT TÌM KIẾM (MỚI) ---
    searchPreferences: {
      minAge: { 
        type: Number, 
        default: 18 
      },
      maxAge: { 
        type: Number, 
        default: 40 
      },
      gender: { 
        type: String, 
        enum: ["all", "male", "female", "other"], 
        default: "all" 
      },
      maxDistance: { 
        type: Number, 
        default: 50  // km
      }
    }
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual field tính tuổi
userSchema.virtual('age').get(function() {
  if (!this.dateOfBirth) return null;
  const diff_ms = Date.now() - this.dateOfBirth.getTime();
  const age_dt = new Date(diff_ms); 
  return Math.abs(age_dt.getUTCFullYear() - 1970);
});

// Index để optimize query
userSchema.index({ location: 1 });
userSchema.index({ gender: 1 });
userSchema.index({ dateOfBirth: 1 });

export default mongoose.model("User", userSchema);