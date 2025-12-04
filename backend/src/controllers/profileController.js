import User from "../models/User.js";

class ProfileController {
  // [GET] /profile/me
  async getMyProfile(req, res) {
    try {
      const user = await User.findById(req.user._id).select("-password -refreshToken");

      if (!user) return res.status(404).json({ message: "User not found" });

      return res.json(user);
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  }

  // [GET] /profile/:id
  async getProfileById(req, res) {
    try {
      const user = await User.findById(req.params.id).select("-password -refreshToken");
      if (!user) return res.status(404).json({ message: "User not found" });

      return res.json(user);
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  }

  // [PUT] /profile/update
  async updateProfile(req, res) {
    try {
      const data = req.body; // username, bio, displayName, giới tính, ...
      
      const user = await User.findByIdAndUpdate(
        req.user._id,
        data,
        { new: true }
      ).select("-password -refreshToken");

      return res.json({
        message: "Profile updated successfully",
        user,
      });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  }

  // [POST] /profile/avatar
  async updateAvatar(req, res) {
    try {
      // ở đây giả sử bạn dùng multer => req.file.path
      const avatarUrl = req.file?.path;

      if (!avatarUrl) return res.status(400).json({ message: "No image uploaded" });

      const user = await User.findByIdAndUpdate(
        req.user._id,
        { avatar: avatarUrl },
        { new: true }
      ).select("-password -refreshToken");

      return res.json({
        message: "Avatar updated successfully",
        user,
      });

    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  }
}

export default new ProfileController();
