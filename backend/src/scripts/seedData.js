// backend/src/scripts/seedData.js
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

// Import models
import User from "../models/User.js";
import Match from "../models/Match.js";
import Appointment from "../models/appointmentModel.js";
import Message from "../models/Message.js";
import Conversation from "../models/Conversation.js";

// Kết nối MongoDB
const connectDB = async () => {
  try {
    const connStr = process.env.MONGO_URI || process.env.MONGODB_CONNECTIONSTRING;
    await mongoose.connect(connStr);
    console.log("✅ Đã kết nối MongoDB!");
  } catch (error) {
    console.error("❌ Lỗi kết nối:", error);
    process.exit(1);
  }
};

// Danh sách tên Việt Nam
const firstNames = [
  "Minh", "Hương", "Anh", "Linh", "Tuấn", "Hà", "Quân", "Mai",
  "Huy", "Lan", "Đức", "Nga", "Phong", "Trang", "Khoa", "Thảo",
  "Nam", "Thu", "Long", "Hằng", "Bình", "Vy", "Tùng", "My",
  "Hoàng", "Diệu", "Dũng", "Loan", "Cường", "Nhung"
];

const lastNames = [
  "Nguyễn", "Trần", "Lê", "Phạm", "Hoàng", "Huỳnh", "Phan", "Vũ",
  "Võ", "Đặng", "Bùi", "Đỗ", "Hồ", "Ngô", "Dương", "Lý"
];

// Sở thích
const interests = [
  "Du lịch", "Ẩm thực", "Thể thao", "Âm nhạc", "Đọc sách", 
  "Phim ảnh", "Nhiếp ảnh", "Yoga", "Gym", "Nấu ăn",
  "Cà phê", "Game", "Vẽ", "Khiêu vũ", "Leo núi"
];

// Thành phố Việt Nam
const cities = [
  "Hà Nội", "Hồ Chí Minh", "Đà Nẵng", "Hải Phòng", "Cần Thơ",
  "Nha Trang", "Huế", "Vũng Tàu", "Đà Lạt", "Quy Nhơn"
];

// Bio mẫu
const bioTemplates = [
  "Yêu thích khám phá những điều mới mẻ ✨",
  "Coffee lover ☕ | Traveler 🌏",
  "Sống chậm, yêu nhiều 💫",
  "Tìm kiếm người cùng chung đam mê 🎯",
  "Cuộc sống là những chuyến đi 🚀",
  "Foodie | Book lover | Movie addict 🎬",
  "Positive vibes only ✌️",
  "Adventure seeker 🏔️",
  "Music is life 🎵",
  "Gym enthusiast 💪 | Healthy lifestyle"
];

// Random helper functions
const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randomItems = (arr, count) => {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};
const randomDate = (start, end) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// 1. TẠO USERS
const createUsers = async (count = 50) => {
  console.log(`\n📝 Đang tạo ${count} users...`);
  
  const users = [];
  const hashedPassword = await bcrypt.hash("123456", 10);

  for (let i = 0; i < count; i++) {
    const firstName = randomItem(firstNames);
    const lastName = randomItem(lastNames);
    const username = `${firstName.toLowerCase()}${randomInt(100, 999)}`;
    
    // Tạo ngày sinh (18-40 tuổi)
    const age = randomInt(18, 40);
    const birthYear = new Date().getFullYear() - age;
    const dateOfBirth = new Date(birthYear, randomInt(0, 11), randomInt(1, 28));

    const user = {
      username,
      hashedPassword,
      email: `${username}@example.com`,
      displayName: `${lastName} ${firstName}`,
      bio: randomItem(bioTemplates),
      gender: Math.random() > 0.5 ? "male" : "female",
      dateOfBirth,
      location: randomItem(cities),
      interests: randomItems(interests, randomInt(3, 6)),
      lookingFor: "Tìm kiếm mối quan hệ nghiêm túc",
      avatarUrl: `https://i.pravatar.cc/300?img=${i + 1}`,
      isOnline: Math.random() > 0.7,
      role: "user"
    };

    users.push(user);
  }

  // Thêm 1 admin user
  users.push({
    username: "admin",
    hashedPassword,
    email: "admin@dating.com",
    displayName: "Admin",
    bio: "System Administrator",
    gender: "other",
    dateOfBirth: new Date(1990, 0, 1),
    location: "Hà Nội",
    interests: ["Quản trị hệ thống"],
    lookingFor: "",
    avatarUrl: "https://i.pravatar.cc/300?img=99",
    isOnline: true,
    role: "admin"
  });

  const createdUsers = await User.insertMany(users);
  console.log(`✅ Đã tạo ${createdUsers.length} users`);
  
  return createdUsers;
};

// 2. TẠO MATCHES
const createMatches = async (users, count = 200) => {
  console.log(`\n💖 Đang tạo ${count} matches...`);
  
  const matches = [];
  const userIds = users.filter(u => u.role !== "admin").map(u => u._id);

  // Tạo matches cho 10 tháng gần đây
  const now = new Date();
  
  for (let i = 0; i < count; i++) {
    const requester = randomItem(userIds);
    let recipient = randomItem(userIds);
    
    // Đảm bảo không tự match với mình
    while (recipient.equals(requester)) {
      recipient = randomItem(userIds);
    }

    // Random tháng trong 10 tháng gần đây
    const monthsAgo = randomInt(0, 9);
    const createdAt = new Date(now.getFullYear(), now.getMonth() - monthsAgo, randomInt(1, 28));

    matches.push({
      requester,
      recipient,
      status: "matched",
      similarityScore: Math.random() * 0.3 + 0.7, // 0.7 - 1.0
      createdAt,
      updatedAt: createdAt
    });
  }

  const createdMatches = await Match.insertMany(matches);
  console.log(`✅ Đã tạo ${createdMatches.length} matches`);
  
  return createdMatches;
};

// 3. TẠO APPOINTMENTS
const createAppointments = async (users, count = 400) => {
  console.log(`\n📅 Đang tạo ${count} appointments...`);
  
  const appointments = [];
  const userIds = users.filter(u => u.role !== "admin").map(u => u._id);
  const appointmentTypes = ["Cà Phê", "Ăn trưa", "Ăn tối", "Đi dạo"];
  
  const now = new Date();

  for (let i = 0; i < count; i++) {
    const userId = randomItem(userIds);
    const city = randomItem(cities);
    
    // Random tháng trong 10 tháng gần đây
    const monthsAgo = randomInt(0, 9);
    const createdAt = new Date(now.getFullYear(), now.getMonth() - monthsAgo, randomInt(1, 28));
    
    // DateTime hẹn sau ngày tạo 1-7 ngày
    const dateTime = new Date(createdAt);
    dateTime.setDate(dateTime.getDate() + randomInt(1, 7));
    dateTime.setHours(randomInt(9, 21), randomInt(0, 59));

    appointments.push({
      userId,
      dateTime,
      city,
      type: randomItem(appointmentTypes),
      reason: `Hẹn ${randomItem(appointmentTypes).toLowerCase()} cùng nhau`,
      latitude: 21.0285 + (Math.random() - 0.5) * 0.1,
      longitude: 105.8542 + (Math.random() - 0.5) * 0.1,
      status: Math.random() > 0.8 ? "pending" : "approved",
      createdAt,
      updatedAt: createdAt
    });
  }

  const createdAppointments = await Appointment.insertMany(appointments);
  console.log(`✅ Đã tạo ${createdAppointments.length} appointments`);
  
  return createdAppointments;
};

// 4. TẠO CONVERSATIONS & MESSAGES
const createConversationsAndMessages = async (matches, count = 300) => {
  console.log(`\n💬 Đang tạo conversations và messages...`);
  
  const conversations = [];
  const allMessages = [];

  // Lấy random matches để tạo conversation
  const selectedMatches = randomItems(matches, Math.min(count, matches.length));

  for (const match of selectedMatches) {
    // Tạo conversation
    const conversation = {
      type: "direct",
      participants: [
        { userId: match.requester, joinedAt: match.createdAt },
        { userId: match.recipient, joinedAt: match.createdAt }
      ],
      lastMessageAt: match.createdAt,
      seenBy: [],
      createdAt: match.createdAt,
      updatedAt: match.createdAt
    };

    const createdConv = await Conversation.create(conversation);

    // Tạo 3-15 messages cho mỗi conversation
    const messageCount = randomInt(3, 15);
    const messages = [];

    for (let i = 0; i < messageCount; i++) {
      const sender = i % 2 === 0 ? match.requester : match.recipient;
      const messageDate = new Date(match.createdAt);
      messageDate.setHours(messageDate.getHours() + i);

      const messageTexts = [
        "Chào bạn! 👋",
        "Rất vui được match với bạn",
        "Bạn có rảnh cuối tuần không?",
        "Mình cũng thích đi du lịch lắm",
        "Hay là mình đi cà phê nhé?",
        "Haha đồng ý 😄",
        "Bạn ở khu vực nào?",
        "Mình nghĩ chúng ta có nhiều điểm chung đấy",
        "Cuối tuần này ok không?",
        "Great! Hẹn gặp bạn nhé 🎉"
      ];

      messages.push({
        conversationId: createdConv._id,
        senderId: sender,
        content: randomItem(messageTexts),
        seenBy: [],
        createdAt: messageDate
      });
    }

    const createdMessages = await Message.insertMany(messages);
    allMessages.push(...createdMessages);

    // Update conversation với lastMessage
    const lastMsg = createdMessages[createdMessages.length - 1];
    await Conversation.findByIdAndUpdate(createdConv._id, {
      lastMessageAt: lastMsg.createdAt,
      lastMessage: {
        _id: lastMsg._id.toString(),
        content: lastMsg.content,
        senderId: lastMsg.senderId,
        createdAt: lastMsg.createdAt
      }
    });
  }

  console.log(`✅ Đã tạo ${selectedMatches.length} conversations`);
  console.log(`✅ Đã tạo ${allMessages.length} messages`);
  
  return { conversations: selectedMatches.length, messages: allMessages.length };
};

// MAIN SEED FUNCTION
const seedDatabase = async () => {
  try {
    console.log("🌱 BẮT ĐẦU SEED DATABASE...\n");
    console.log("⚠️  Cảnh báo: Script này sẽ XÓA toàn bộ dữ liệu cũ!\n");

    await connectDB();

    // Xóa dữ liệu cũ
    console.log("🗑️  Đang xóa dữ liệu cũ...");
    await User.deleteMany({ role: { $ne: "admin" } }); // Giữ lại admin cũ nếu có
    await Match.deleteMany({});
    await Appointment.deleteMany({});
    await Message.deleteMany({});
    await Conversation.deleteMany({});
    console.log("✅ Đã xóa dữ liệu cũ\n");

    // Tạo dữ liệu mới
    const users = await createUsers(50);
    const matches = await createMatches(users, 200);
    const appointments = await createAppointments(users, 400);
    const { conversations, messages } = await createConversationsAndMessages(matches, 150);

    // Tổng kết
    console.log("\n" + "=".repeat(50));
    console.log("🎉 HOÀN THÀNH SEED DATABASE!");
    console.log("=".repeat(50));
    console.log(`👥 Users: ${users.length}`);
    console.log(`💖 Matches: ${matches.length}`);
    console.log(`📅 Appointments: ${appointments.length}`);
    console.log(`💬 Conversations: ${conversations}`);
    console.log(`📨 Messages: ${messages}`);
    console.log("=".repeat(50));
    console.log("\n📝 Thông tin đăng nhập:");
    console.log("   Username: admin");
    console.log("   Password: 123456");
    console.log("   Role: admin\n");
    console.log("   Hoặc dùng bất kỳ user nào:");
    console.log("   Username: minh123, huong456, ...");
    console.log("   Password: 123456\n");

    process.exit(0);
  } catch (error) {
    console.error("❌ Lỗi:", error);
    process.exit(1);
  }
};

// Chạy script
seedDatabase();