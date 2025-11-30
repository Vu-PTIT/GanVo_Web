import User from "../models/User.js";

export const authMe = async (req, res) => {
  try {
    const user = req.user; // lấy từ authMiddleware

    return res.status(200).json({
      user,
    });
  } catch (error) {
    console.error("Lỗi khi gọi authMe", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const getUsers = async (req, res) => {
  try {
    const { search } = req.query;
    const currentUserId = req.user._id;
    const sanitizedSearch = search ? search.trim() : "";

    let query = {};

    if (sanitizedSearch) {
      query.$or = [
        { username: { $regex: sanitizedSearch, $options: "i" } },
        { email: { $regex: sanitizedSearch, $options: "i" } },
        { displayName: { $regex: sanitizedSearch, $options: "i" } },
      ];
    }

    const users = await User.find(query).select("-password");

    res.status(200).json(users);
  } catch (error) {
    console.error("Error in getUsers: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
