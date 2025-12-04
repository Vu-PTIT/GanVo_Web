import express from "express";
import dotenv from "dotenv";
import connectDB  from "./libs/db.js";
import authRoute from "./routes/authRoute.js";
import userRoute from "./routes/userRoute.js";

import friendRoute from "./routes/friendRoute.js";
import messageRoute from "./routes/messageRoute.js";
import conversationRoute from "./routes/conversationRoute.js";

import personRoute from "./routes/personRoute.js";
import matchRoute from "./routes/matchRoute.js"; // <--- THÊM DÒNG NÀY

import personRoute from "./routes/personRoute.js"; // [THÊM MỚI] Import route person
import cookieParser from "cookie-parser";
import { protectedRoute } from "./middlewares/authMiddleware.js";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));

// swagger
// const swaggerDocument = JSON.parse(fs.readFileSync("./src/swagger.json", "utf8"));
// app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Make io accessible in routes
app.use((req, res, next) => {
  req.io = io;
  next();
});

// public routes
app.use("/api/auth", authRoute);

// private routes (Yêu cầu đăng nhập)
app.use(protectedRoute); 

app.use("/api/users", userRoute);
app.use("/api/friends", friendRoute);
app.use("/api/messages", messageRoute);
app.use("/api/conversations", conversationRoute);

// Match & Person Routes
app.use("/api/people", personRoute); 
app.use("/api/match", matchRoute); // Bây giờ dòng này mới chạy được vì đã import ở trên

// Socket.io middleware
io.use(socketAuthMiddleware);

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);
  const userId = socket.user._id.toString();

  socket.join(userId);
  console.log(`User ${userId} joined their personal room`);

  socket.on("join_conversation", (conversationId) => {
    socket.join(conversationId);
    console.log(`User ${userId} joined conversation ${conversationId}`);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

app.use(protectedRoute); // Middleware bảo vệ các route bên dưới
app.use("/api/users", userRoute);
app.use("/api/people", personRoute); // Đăng ký route /api/people
app.use("/api/match", matchRoute);
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`server bắt đầu trên cổng ${PORT}`);
  });
});