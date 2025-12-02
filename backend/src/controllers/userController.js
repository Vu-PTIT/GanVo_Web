import User from "../models/User.js";
import { buildProfileText, getEmbedding } from "../utils/gemini.js";

//  LẤY THÔNG TIN PROFILE CHÍNH MÌNH 
export const authMe = async (req, res) => {
  try {
    const user = req.user; 
    return res.status(200).json({ user });
  } catch (error) {
    console.error("Lỗi authMe", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

// TÌM KIẾM USERS 
export const getUsers = async (req, res) => {
  try {
    const { search } = req.query;
    const sanitizedSearch = search ? search.trim() : "";

    let query = {};

    if (sanitizedSearch) {
      query.$or = [
        { username: { $regex: sanitizedSearch, $options: "i" } },
        { displayName: { $regex: sanitizedSearch, $options: "i" } },
      ];
    }

    const users = await User.find(query)
      .select("displayName username avatarUrl location bio")
      .limit(20);

    res.status(200).json({ users });
  } catch (error) {
    console.error("Error in getUsers: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

//  CẬP NHẬT PROFILE (TỰ ĐỘNG TẠO EMBEDDING) 
export const updateProfile = async (req, res) => {
  try {
    const currentUserId = req.user._id;
    
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

    const updateData = {};

    // Gán dữ liệu cơ bản
    if (displayName !== undefined) updateData.displayName = displayName;
    if (gender !== undefined) updateData.gender = gender;
    if (dateOfBirth !== undefined) updateData.dateOfBirth = dateOfBirth;
    if (avatarUrl !== undefined) updateData.avatarUrl = avatarUrl;
    if (photos !== undefined) updateData.photos = photos;

    // Các trường ảnh hưởng đến AI
    if (bio !== undefined) updateData.bio = bio;
    if (location !== undefined) updateData.location = location;
    if (interests !== undefined) updateData.interests = interests;
    if (lookingFor !== undefined) updateData.lookingFor = lookingFor;

    //  TỰ ĐỘNG TẠO EMBEDDING 
    const shouldUpdateEmbedding = bio || interests || lookingFor || location;

    if (shouldUpdateEmbedding) {
      // Lấy data mới nhất để tạo embedding
      const currentData = await User.findById(currentUserId).select("bio location interests lookingFor gender");
      
      const profileForEmbedding = {
        bio: bio !== undefined ? bio : currentData.bio,
        location: location !== undefined ? location : currentData.location,
        interests: interests !== undefined ? interests : currentData.interests,
        lookingFor: lookingFor !== undefined ? lookingFor : currentData.lookingFor,
        gender: gender !== undefined ? gender : currentData.gender
      };

      const profileText = buildProfileText(profileForEmbedding);

      if (profileText.length >= 10) {
        console.log(" Đang tạo embedding cho profile...");
        const vector = await getEmbedding(profileText);

        if (vector && vector.length > 0) {
          updateData.embedding = vector;
          console.log(" Embedding đã được tạo thành công!");
        }
      }
    }

    // Tìm và update user
    const updatedUser = await User.findByIdAndUpdate(
      currentUserId,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select("-hashedPassword -embedding"); // Không trả embedding về client

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

//  LẤY CÀI ĐẶT TÌM KIẾM CỦA USER 
export const getPreferences = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select("searchPreferences");
    
    return res.status(200).json({ 
      preferences: user.searchPreferences || {
        minAge: 18,
        maxAge: 40,
        gender: "all",
        maxDistance: 50
      }
    });
  } catch (error) {
    console.error("Lỗi getPreferences:", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

//  CẬP NHẬT CÀI ĐẶT TÌM KIẾM 
export const updatePreferences = async (req, res) => {
  try {
    const { minAge, maxAge, gender, maxDistance } = req.body;
    
    const updateData = {};
    
    if (minAge !== undefined) updateData["searchPreferences.minAge"] = minAge;
    if (maxAge !== undefined) updateData["searchPreferences.maxAge"] = maxAge;
    if (gender !== undefined) updateData["searchPreferences.gender"] = gender;
    if (maxDistance !== undefined) updateData["searchPreferences.maxDistance"] = maxDistance;

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updateData },
      { new: true }
    ).select("searchPreferences");

    return res.status(200).json({ 
      message: "Cập nhật thành công",
      preferences: updatedUser.searchPreferences 
    });
  } catch (error) {
    console.error("Lỗi updatePreferences:", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};