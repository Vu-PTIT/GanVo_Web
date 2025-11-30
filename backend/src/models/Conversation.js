import mongoose from "mongoose";

// --- Schema cho từng người tham gia ---
const participantSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    _id: false,
  }
);

// --- Schema thông tin nhóm ---
const groupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
    },
    avatar: {
      type: String,
      default: "",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    _id: false,
  }
);

// --- Schema lưu tin nhắn cuối cùng (để hiển thị preview) ---
const lastMessageSchema = new mongoose.Schema(
  {
    _id: { type: String },
    content: {
      type: String,
      default: null,
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    createdAt: {
      type: Date,
      default: null,
    },
  },
  {
    _id: false,
  }
);

// --- Schema chính: Conversation ---
const conversationSchema = new mongoose.Schema(
  {
    // Loại: 'direct' (chat riêng) hoặc 'group' (chat nhóm)
    type: {
      type: String,
      enum: ["direct", "group"],
      required: true,
    },
    
    // Danh sách người tham gia
    participants: {
      type: [participantSchema],
      required: true,
    },

    // Thông tin nhóm (nếu type là group)
    group: {
      type: groupSchema,
    },

    // Nếu chat theo sự kiện (Event) -> Link tới Event
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      default: null,
    },

    // Quản lý trạng thái xem/tin nhắn mới
    lastMessageAt: {
      type: Date,
    },
    seenBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    lastMessage: {
      type: lastMessageSchema,
      default: null,
    },
    unreadCounts: {
      type: Map,
      of: Number,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

// Tạo index để tối ưu tìm kiếm hội thoại của user
conversationSchema.index({
  "participants.userId": 1,
  lastMessageAt: -1,
});

const Conversation = mongoose.model("Conversation", conversationSchema);
export default Conversation;