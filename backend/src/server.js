// server.js - CẤU HÌNH HOÀN CHỈNH
import express from "express";
import dotenv from "dotenv";
import connectDB from "./libs/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

// Routes
import authRoute from "./routes/authRoute.js";
import userRoute from "./routes/userRoute.js";
import matchRoute from "./routes/matchRoute.js";
import personRoute from "./routes/personRoute.js";
import messageRoute from "./routes/messageRoute.js";
import conversationRoute from "./routes/conversationRoute.js";

// Middlewares
import { protectedRoute } from "./middlewares/authMiddleware.js";
import { socketAuthMiddleware } from "./middlewares/socketAuthMiddleware.js";

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const PORT = process.env.PORT || 5001;

// ===== MIDDLEWARES =====
app.use(express.json());
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

// ===== PUBLIC ROUTES =====
app.use("/api/auth", authRoute);

// ===== PROTECTED ROUTES (Yêu cầu đăng nhập) =====
app.use(protectedRoute);

app.use("/api/users", userRoute);
app.use("/api/match", matchRoute);        // ⭐ MAIN ROUTE - Swipe & Match
app.use("/api/people", personRoute);      // Xem thông tin người khác
app.use("/api/messages", messageRoute);
app.use("/api/conversations", conversationRoute);

// ===== SOCKET.IO =====
io.use(socketAuthMiddleware);

io.on("connection", (socket) => {
  console.log(" User connected:", socket.id);
  const userId = socket.user._id.toString();

  // Join personal room
  socket.join(userId);
  console.log(`User ${userId} joined personal room`);

  // Update online status
  User.findByIdAndUpdate(userId, { isOnline: true }).exec();

  // Join conversation rooms
  socket.on("join_conversation", (conversationId) => {
    socket.join(conversationId);
    console.log(`User ${userId} joined conversation ${conversationId}`);
  });

  // Disconnect
  socket.on("disconnect", () => {
    console.log(" User disconnected:", socket.id);
    User.findByIdAndUpdate(userId, { 
      isOnline: false, 
      lastSeen: new Date() 
    }).exec();
  });
});

//  START SERVER
connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(` Server đang chạy trên cổng ${PORT}`);
    console.log(` API: http://localhost:${PORT}/api`);
    console.log(` Socket.IO: ws://localhost:${PORT}`);
  });
});

// Global io for notifications
global.io = io;