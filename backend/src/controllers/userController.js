import User from "../models/User.js";
import { buildProfileText, getEmbedding } from "../utils/gemini.js";

//  LẤY THÔNG TIN PROFILE CHÍNH MÌNH 
export const authMe = async (req, res) => {
  try {
    const user = req.user; 
    
    if (!user) {
      return res.status(404).json({ message: "Người dùng không tồn tại" });
    }
    
    return res.status(200).json({ user });
  } catch (error) {
    console.error("Lỗi authMe:", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

//  TÌM KIẾM USERS 
export const getUsers = async (req, res) => {
  try {
    const { search, limit = 20 } = req.query;
    const sanitizedSearch = search ? search.trim() : "";

    let query = {};

    if (sanitizedSearch) {
      query.$or = [
        { username: { $regex: sanitizedSearch, $options: "i" } },
        { displayName: { $regex: sanitizedSearch, $options: "i" } },
      ];
    }

    const users = await User.find(query)
      .select("displayName username avatarUrl location bio isOnline")
      .limit(parseInt(limit));

    return res.status(200).json({ 
      users,
      total: users.length 
    });
  } catch (error) {
    console.error("Lỗi getUsers:", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

//  CẬP NHẬT PROFILE (TỰ ĐỘNG TẠO EMBEDDING) - FIXED
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

    //  VALIDATION
    if (displayName !== undefined && (!displayName || displayName.trim().length < 2)) {
      return res.status(400).json({ message: "Tên hiển thị phải có ít nhất 2 ký tự" });
    }

    if (bio !== undefined && bio.length > 500) {
      return res.status(400).json({ message: "Bio không được quá 500 ký tự" });
    }

    if (gender !== undefined && !["male", "female", "other"].includes(gender)) {
      return res.status(400).json({ message: "Giới tính không hợp lệ" });
    }

    if (dateOfBirth !== undefined) {
      const birthDate = new Date(dateOfBirth);
      const age = (Date.now() - birthDate.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
      if (age < 18) {
        return res.status(400).json({ message: "Bạn phải trên 18 tuổi" });
      }
    }

    if (interests !== undefined && (!Array.isArray(interests) || interests.length > 10)) {
      return res.status(400).json({ message: "Sở thích phải là mảng và không quá 10 mục" });
    }

    const updateData = {};

    // Gán dữ liệu cơ bản
    if (displayName !== undefined) updateData.displayName = displayName.trim();
    if (gender !== undefined) updateData.gender = gender;
    if (dateOfBirth !== undefined) updateData.dateOfBirth = new Date(dateOfBirth);
    if (avatarUrl !== undefined) updateData.avatarUrl = avatarUrl;
    if (photos !== undefined) updateData.photos = photos;

    // Các trường ảnh hưởng đến AI
    if (bio !== undefined) updateData.bio = bio.trim();
    if (location !== undefined) updateData.location = location.trim();
    if (interests !== undefined) updateData.interests = interests.map(i => i.trim());
    if (lookingFor !== undefined) updateData.lookingFor = lookingFor.trim();

    //  TỰ ĐỘNG TẠO EMBEDDING 
    const shouldUpdateEmbedding = bio !== undefined || 
                                   interests !== undefined || 
                                   lookingFor !== undefined || 
                                   location !== undefined;

    if (shouldUpdateEmbedding) {
      try {
        // Lấy data mới nhất để tạo embedding
        const currentData = await User.findById(currentUserId)
          .select("bio location interests lookingFor gender");
        
        if (!currentData) {
          return res.status(404).json({ message: "Không tìm thấy người dùng" });
        }

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
          } else {
            console.warn(" Không thể tạo embedding, tiếp tục cập nhật profile");
          }
        }
      } catch (embeddingError) {
        console.error(" Lỗi khi tạo embedding:", embeddingError.message);
        // Vẫn tiếp tục cập nhật profile dù embedding thất bại
      }
    }

    //  Tìm và update user
    const updatedUser = await User.findByIdAndUpdate(
      currentUserId,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select("-hashedPassword -embedding");

    if (!updatedUser) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }

    return res.status(200).json({ 
      message: "Cập nhật hồ sơ thành công", 
      user: updatedUser 
    });

  } catch (error) {
    console.error("Lỗi cập nhật profile:", error);
    
    //  Xử lý các lỗi cụ thể
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({ message: errors.join(", ") });
    }
    
    if (error.code === 11000) {
      return res.status(400).json({ message: "Dữ liệu trùng lặp" });
    }
    
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

//  LẤY CÀI ĐẶT TÌM KIẾM CỦA USER 
export const getPreferences = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select("searchPreferences");
    
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }

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

//  CẬP NHẬT CÀI ĐẶT TÌM KIẾM - FIXED
export const updatePreferences = async (req, res) => {
  try {
    const { minAge, maxAge, gender, maxDistance } = req.body;
    
    //  VALIDATION
    if (minAge !== undefined && (minAge < 18 || minAge > 100)) {
      return res.status(400).json({ message: "Tuổi tối thiểu phải từ 18 đến 100" });
    }

    if (maxAge !== undefined && (maxAge < 18 || maxAge > 100)) {
      return res.status(400).json({ message: "Tuổi tối đa phải từ 18 đến 100" });
    }

    if (minAge !== undefined && maxAge !== undefined && minAge > maxAge) {
      return res.status(400).json({ message: "Tuổi tối thiểu không được lớn hơn tuổi tối đa" });
    }

    if (gender !== undefined && !["all", "male", "female", "other"].includes(gender)) {
      return res.status(400).json({ message: "Giới tính không hợp lệ" });
    }

    if (maxDistance !== undefined && (maxDistance < 1 || maxDistance > 500)) {
      return res.status(400).json({ message: "Khoảng cách phải từ 1 đến 500 km" });
    }

    const updateData = {};
    
    if (minAge !== undefined) updateData["searchPreferences.minAge"] = minAge;
    if (maxAge !== undefined) updateData["searchPreferences.maxAge"] = maxAge;
    if (gender !== undefined) updateData["searchPreferences.gender"] = gender;
    if (maxDistance !== undefined) updateData["searchPreferences.maxDistance"] = maxDistance;

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select("searchPreferences");

    if (!updatedUser) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }

    return res.status(200).json({ 
      message: "Cập nhật cài đặt tìm kiếm thành công",
      preferences: updatedUser.searchPreferences 
    });
  } catch (error) {
    console.error("Lỗi updatePreferences:", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};