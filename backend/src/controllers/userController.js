// --- START OF FILE controllers/userController.js ---

import User from "../models/User.js";
import { getEmbedding } from "../utils/gemini.js"; // Import hàm vừa tạo

// Lấy thông tin profile của chính mình
export const authMe = async (req, res) => {
  try {
    const user = req.user; 
    return res.status(200).json({ user });
  } catch (error) {
    console.error("Lỗi authMe", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

// Cập nhật thông tin hồ sơ
export const updateProfile = async (req, res) => {
  try {
    const currentUserId = req.user._id;
    
    // Lấy dữ liệu từ body
    const {
      displayName,
      bio,
      gender,
      dateOfBirth,
      location,
      interests, // Mảng string ["Đọc sách", "Code"]
      lookingFor,
      avatarUrl,
      photos
    } = req.body;

    const updateData = {};

    // Gán dữ liệu cơ bản
    if (displayName) updateData.displayName = displayName;
    if (gender) updateData.gender = gender;
    if (dateOfBirth) updateData.dateOfBirth = dateOfBirth;
    if (avatarUrl) updateData.avatarUrl = avatarUrl;
    if (photos) updateData.photos = photos;

    // Các trường ảnh hưởng đến AI (Semantic Fields)
    if (bio) updateData.bio = bio;
    if (location) updateData.location = location;
    if (interests) updateData.interests = interests;
    if (lookingFor) updateData.lookingFor = lookingFor;

    // --- LOGIC TÍCH HỢP GEMINI AI ---
    // Kiểm tra xem có trường dữ liệu nào quan trọng thay đổi không
    // Nếu người dùng chỉ đổi avatar thì không cần gọi AI tốn tài nguyên
    const shouldUpdateEmbedding = bio || interests || lookingFor || location;

    if (shouldUpdateEmbedding) {
      // 1. Chuẩn bị dữ liệu text để gửi cho Gemini
      // Chúng ta cần kết hợp dữ liệu mới (từ req.body) và dữ liệu cũ (nếu req.body thiếu)
      // Tuy nhiên để đơn giản và chính xác, ta ưu tiên dữ liệu từ req.body.
      // *Lưu ý: Frontend nên gửi đầy đủ bộ field này khi update profile để AI hiểu ngữ cảnh tốt nhất*
      
      const interestText = Array.isArray(interests) ? interests.join(", ") : (interests || "");
      
      // Tạo một câu mô tả hoàn chỉnh về người dùng
      const textProfile = `
        Tôi sống tại: ${location || "Việt Nam"}.
        Sở thích của tôi là: ${interestText}.
        Mục tiêu tìm kiếm: ${lookingFor || "Kết bạn"}.
        Giới thiệu bản thân: ${bio || ""}
      `.trim();

      console.log("Đang tạo embedding cho:", textProfile);

      // 2. Gọi Gemini lấy vector
      const vector = await getEmbedding(textProfile);

      // 3. Nếu thành công, lưu vào updateData
      if (vector && vector.length > 0) {
        updateData.embedding = vector; // Đảm bảo Model User đã có field 'embedding'
      }
    }
    // --- KẾT THÚC LOGIC AI ---

    // Tìm và update user
    const updatedUser = await User.findByIdAndUpdate(
      currentUserId,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select("-hashedPassword");

    if (!updatedUser) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }

    return res.status(200).json({ 
      message: "Cập nhật hồ sơ thành công", 
      user: updatedUser 
    });

  } catch (error) {
    console.error("Lỗi cập nhật profile:", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};