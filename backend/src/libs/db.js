import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  try {
    console.log(" MONGO_URI:", process.env.MONGO_URI); // debug
    await mongoose.connect(process.env.MONGO_URI);
    console.log(" Đã kết nối MongoDB!");
  } catch (error) {
    console.error(" Lỗi khi kết nối CSDL:", error);
  }
};

export default connectDB;
