import mongoose from "mongoose";
import dotenv from "dotenv";

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const connectDB = async () => {
  try {
    const connStr = process.env.MONGO_URI || process.env.MONGODB_CONNECTIONSTRING;
    console.log(" MONGO_URI:", connStr); // debug
    await mongoose.connect(connStr);
    console.log(" Đã kết nối MongoDB!");
  } catch (error) {
    console.error(" Lỗi khi kết nối CSDL:", error);
    process.exit(1); // Exit process with failure
  }
};

export default connectDB;
