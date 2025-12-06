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
import notificationRoute from "./routes/notificationRoute.js"; 

// Middlewares
import { protectedRoute } from "./middlewares/authMiddleware.js";
import { socketAuthMiddleware } from "./middlewares/socketAuthMiddleware.js";

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
});

const PORT = process.env.PORT || 5001;

// MIDDLEWARES 
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());
app.use(cors({ 
  origin: process.env.CLIENT_URL || "http://localhost:3000", 
  credentials: true 
}));

// Make io accessible in routes
app.use((req, res, next) => {
  req.io = io;
  next();
});

// PUBLIC ROUTES 
app.use("/api/auth", authRoute);

// Health check
app.get("/api/health", (req, res) => {
  res.status(200).json({ 
    status: "OK", 
    message: "Server đang hoạt động",
    timestamp: new Date().toISOString()
  });
});

//  PROTECTED ROUTES (Yêu cầu đăng nhập) 
app.use("/api/users", protectedRoute, userRoute);
app.use("/api/match", protectedRoute, matchRoute);
app.use("/api/people", protectedRoute, personRoute);
app.use("/api/messages", protectedRoute, messageRoute);
app.use("/api/conversations", protectedRoute, conversationRoute);
app.use("/api/notifications", protectedRoute, notificationRoute); 

// ERROR HANDLING 
app.use((err, req, res, next) => {
  console.error(" Global Error:", err);
  res.status(err.status || 500).json({
    message: err.message || "Lỗi hệ thống",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack })
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ message: "API endpoint không tồn tại" });
});

//  SOCKET.IO
io.use(socketAuthMiddleware);

io.on("connection", (socket) => {
  console.log(" User connected:", socket.id);
  const userId = socket.user._id.toString();

  // Join personal room (để nhận thông báo realtime)
  socket.join(userId);
  console.log(` User ${userId} joined personal room`);

  // Update online status
  User.findByIdAndUpdate(userId, { 
    isOnline: true,
    lastSeen: new Date()
  }).exec().catch(err => console.error("Error updating online status:", err));

  // Join conversation rooms
  socket.on("join_conversation", (conversationId) => {
    socket.join(conversationId);
    console.log(` User ${userId} joined conversation ${conversationId}`);
  });

  // Leave conversation rooms
  socket.on("leave_conversation", (conversationId) => {
    socket.leave(conversationId);
    console.log(` User ${userId} left conversation ${conversationId}`);
  });

  // Typing indicator
  socket.on("typing", ({ conversationId, isTyping }) => {
    socket.to(conversationId).emit("user_typing", {
      userId,
      isTyping
    });
  });

  // Disconnect
  socket.on("disconnect", () => {
    console.log("🔌 User disconnected:", socket.id);
    User.findByIdAndUpdate(userId, { 
      isOnline: false, 
      lastSeen: new Date() 
    }).exec().catch(err => console.error("Error updating offline status:", err));
  });
});

//  START SERVER
connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(` Server đang chạy trên cổng ${PORT}`);
    console.log(` API: http://localhost:${PORT}/api`);
    console.log(` Socket.IO: ws://localhost:${PORT}`);
    console.log(` Environment: ${process.env.NODE_ENV || "development"}`);
  });
}).catch(error => {
  console.error(" Không thể khởi động server:", error);
  process.exit(1);
});

// Global io for notifications
global.io = io;

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("\n Đang tắt server...");
  await User.updateMany({}, { isOnline: false });
  server.close(() => {
    console.log(" Server đã tắt");
    process.exit(0);
  });
});