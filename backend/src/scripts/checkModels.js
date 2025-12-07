// backend/src/scripts/checkModels.js
// Script kiểm tra xem models nào bị lỗi

import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

console.log("🔍 KIỂM TRA MODELS\n");
console.log("=".repeat(60));

// Test import từng model
const models = [
  { name: "User", path: "../models/User.js" },
  { name: "Match", path: "../models/match.js" },
  { name: "Match (uppercase)", path: "../models/Match.js" },
  { name: "Appointment", path: "../models/appointmentModel.js" },
  { name: "Message", path: "../models/Message.js" },
  { name: "Conversation", path: "../models/Conversation.js" },
  { name: "Notification", path: "../models/Notification.js" },
  { name: "Session", path: "../models/Session.js" }
];

async function checkModels() {
  for (const model of models) {
    try {
      const imported = await import(model.path);
      if (imported.default) {
        console.log(`✅ ${model.name.padEnd(20)} - OK (${model.path})`);
      } else {
        console.log(`⚠️  ${model.name.padEnd(20)} - Imported nhưng không có default export`);
      }
    } catch (error) {
      console.log(`❌ ${model.name.padEnd(20)} - LỖI: ${error.message}`);
    }
  }

  console.log("\n" + "=".repeat(60));
  
  // Kết nối DB và kiểm tra collections
  try {
    const connStr = process.env.MONGO_URI || process.env.MONGODB_CONNECTIONSTRING;
    await mongoose.connect(connStr);
    console.log("✅ Kết nối MongoDB thành công\n");
    
    console.log("📊 COLLECTIONS HIỆN CÓ:");
    console.log("-".repeat(60));
    
    const collections = await mongoose.connection.db.listCollections().toArray();
    
    if (collections.length === 0) {
      console.log("❌ Không có collection nào!");
    } else {
      for (const coll of collections) {
        const count = await mongoose.connection.db.collection(coll.name).countDocuments();
        console.log(`   ${coll.name.padEnd(20)} - ${count} documents`);
      }
    }
    
    console.log("\n" + "=".repeat(60));
    
    process.exit(0);
  } catch (error) {
    console.error("\n❌ Lỗi kết nối DB:", error.message);
    process.exit(1);
  }
}

checkModels();