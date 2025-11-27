import User from "../models/User.js";

// Lấy thông tin profile của chính mình (đã có)
export const authMe = async (req, res) => {
  try {
    // req.user đã được gán từ middleware 'protectedRoute'
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
    
    // Lấy các trường dữ liệu từ body request
    const {
      displayName,
      bio,
      gender,
      dateOfBirth,
      location,
      interests,
      lookingFor,
      avatarUrl,
      photos
    } = req.body;

    // Chuẩn bị object chứa các trường cần update
    const updateData = {};
    if (displayName) updateData.displayName = displayName;
    if (bio) updateData.bio = bio;
    if (gender) updateData.gender = gender;
    if (dateOfBirth) updateData.dateOfBirth = dateOfBirth;
    if (location) updateData.location = location;
    if (interests) updateData.interests = interests;
    if (lookingFor) updateData.lookingFor = lookingFor;
    if (avatarUrl) updateData.avatarUrl = avatarUrl;
    if (photos) updateData.photos = photos;

    // Tìm và update user
    const updatedUser = await User.findByIdAndUpdate(
      currentUserId,
      { $set: updateData },
      { new: true, runValidators: true } // new: true để trả về data sau khi update
    ).select("-hashedPassword"); // Không trả về password

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