import express from "express";
import dotenv from "dotenv";
import connectDB  from "./libs/db.js";
import authRoute from "./routes/authRoute.js";
import userRoute from "./routes/userRoute.js";
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

// public routes
app.use("/api/auth", authRoute);

// private routes (Yêu cầu đăng nhập)
app.use(protectedRoute); // Middleware bảo vệ các route bên dưới
app.use("/api/users", userRoute);
app.use("/api/people", personRoute); // Đăng ký route /api/people
app.use("/api/match", matchRoute);
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`server bắt đầu trên cổng ${PORT}`);
  });
});