import express from "express";
import dotenv from "dotenv";
import connectDB from "./libs/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

// Models
import User from "./models/User.js";

// Routes
import authRoute from "./routes/authRoute.js";
import userRoute from "./routes/userRoute.js";
import matchRoute from "./routes/matchRoute.js";
import personRoute from "./routes/personRoute.js";
import messageRoute from "./routes/messageRoute.js";
import conversationRoute from "./routes/conversationRoute.js";
import appointmentRoute from "./routes/appointmentRoute.js";

// Middlewares
import { protectedRoute } from "./middlewares/authMiddleware.js";
import { socketAuthMiddleware } from "./middlewares/socketAuthMiddleware.js";

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  },
});

const PORT = process.env.PORT || 5001;

// ================== MIDDLEWARE ==================
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Make io accessible in all routes
app.use((req, res, next) => {
  req.io = io;
  next();
});

// ================== PUBLIC ROUTES ==================
app.use("/api/auth", authRoute);

// Health check
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Server đang hoạt động",
    timestamp: new Date().toISOString(),
  });
});

// ================== PROTECTED ROUTES ==================
app.use(protectedRoute);

app.use("/api/users", userRoute);
app.use("/api/messages", messageRoute);
app.use("/api/conversations", conversationRoute);
app.use("/api/appointments", appointmentRoute);
app.use("/api/people", personRoute);
app.use("/api/match", matchRoute);

// ================== SOCKET.IO ==================
io.use(socketAuthMiddleware);

io.on("connection", (socket) => {
  console.log("🔌 User connected:", socket.id);

  const userId = socket.user._id.toString();
  socket.join(userId);

  // Online status
  User.findByIdAndUpdate(userId, {
    isOnline: true,
    lastSeen: new Date(),
  }).catch(console.error);

  // Join conversation room
  socket.on("join_conversation", (conversationId) => {
    socket.join(conversationId);
  });

  // Leave conversation
  socket.on("leave_conversation", (conversationId) => {
    socket.leave(conversationId);
  });

  // Typing indicator
  socket.on("typing", ({ conversationId, isTyping }) => {
    socket.to(conversationId).emit("user_typing", {
      userId,
      isTyping,
    });
  });

  // Disconnect
  socket.on("disconnect", () => {
    console.log("🔌 User disconnected:", socket.id);
    User.findByIdAndUpdate(userId, {
      isOnline: false,
      lastSeen: new Date(),
    }).catch(console.error);
  });
});

// ================== ERROR HANDLING ==================
app.use((err, req, res, next) => {
  console.error("❌ Global Error:", err);
  res.status(err.status || 500).json({
    message: err.message || "Lỗi hệ thống",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

// 404
app.use((req, res) => {
  res.status(404).json({ message: "API endpoint không tồn tại" });
});

// ================== START SERVER ==================
connectDB()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`🚀 Server đang chạy tại PORT: ${PORT}`);
      console.log(`📡 API: http://localhost:${PORT}/api`);
    });
  })
  .catch((err) => {
    console.error("❌ Không thể khởi động server:", err);
    process.exit(1);
  });

// ================== GRACEFUL SHUTDOWN ==================
process.on("SIGINT", async () => {
  console.log("\n⏳ Đang tắt server...");
  await User.updateMany({}, { isOnline: false });
  server.close(() => {
    console.log("✅ Server đã tắt hoàn toàn");
    process.exit(0);
  });
});

global.io = io;
