import User from "../models/User.js";

// Lấy thông tin công khai của một người dùng bất kỳ theo ID
export const getPersonProfile = async (req, res) => {
  try {
    const { id } = req.params;

    // Tìm user theo ID
    // CHÚ Ý: Chỉ lấy các trường thông tin CÔNG KHAI (Public)
    // Tuyệt đối không lấy: hashedPassword, email (trừ khi app cho phép), phone (nếu riêng tư)
    const person = await User.findById(id)
      .select(
        "displayName username avatarUrl bio gender dateOfBirth location interests photos isOnline lastSeen lookingFor"
      );

    if (!person) {
      return res.status(404).json({ message: "Không tìm thấy người dùng này" });
    }

    // Trả về dữ liệu
    // Virtual field 'age' sẽ tự động được tính toán nhờ config trong Model User
    return res.status(200).json({ person });
  } catch (error) {
    console.error("Lỗi getPersonProfile:", error);
    // Nếu ID không đúng định dạng MongoDB
    if (error.kind === "ObjectId") {
        return res.status(404).json({ message: "Người dùng không tồn tại" });
    }
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

// Lấy danh sách ảnh của một người (nếu muốn tách API riêng)
export const getPersonPhotos = async (req, res) => {
    try {
        const { id } = req.params;
        const person = await User.findById(id).select("photos");

        if (!person) {
            return res.status(404).json({ message: "Không tìm thấy người dùng" });
        }

        return res.status(200).json({ photos: person.photos || [] });
    } catch (error) {
        console.error("Lỗi getPersonPhotos:", error);
        return res.status(500).json({ message: "Lỗi hệ thống" });
    }
}