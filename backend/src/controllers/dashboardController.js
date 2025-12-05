import Dashboard from "../models/Dashboard.js";

/**
 * Lấy dashboard của chính mình
 */
export const getDashboard = async (req, res) => {
  try {
    const userId = req.user._id;

    let dashboard = await Dashboard.findOne({ userId });
    if (!dashboard) {
      // Nếu chưa có dashboard, tạo mới
      dashboard = await Dashboard.create({ userId });
    }

    res.status(200).json(dashboard);
  } catch (err) {
    console.error("Lỗi getDashboard:", err);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

/**
 * Tăng số lượt match
 * @body month = "YYYY-MM", year = "YYYY"
 */
export const incrementMatches = async (req, res) => {
  try {
    const userId = req.user._id;
    const { month, year } = req.body;

    const update = {};
    if (month) update[`matchesPerMonth.${month}`] = 1;
    if (year) update[`matchesPerYear.${year}`] = 1;

    const dashboard = await Dashboard.findOneAndUpdate(
      { userId },
      { $inc: update },
      { new: true, upsert: true }
    );

    res.status(200).json(dashboard);
  } catch (err) {
    console.error("Lỗi incrementMatches:", err);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

/**
 * Tăng số lịch hẹn và cập nhật mảng appointmentsPerMonth
 * @body month = "YYYY-MM"
 */
export const incrementAppointments = async (req, res) => {
  try {
    const userId = req.user._id;
    const { month } = req.body;

    const update = { $inc: { totalAppointments: 1 } };
    if (month) {
      update.$inc[`appointmentsPerMonth.${month}`] = 1;
    }

    const dashboard = await Dashboard.findOneAndUpdate(
      { userId },
      update,
      { new: true, upsert: true }
    );

    res.status(200).json(dashboard);
  } catch (err) {
    console.error("Lỗi incrementAppointments:", err);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

/**
 * Tăng số tin nhắn đã gửi
 * @body count = số tin nhắn tăng (mặc định 1)
 */
export const incrementMessages = async (req, res) => {
  try {
    const userId = req.user._id;
    const count = req.body.count || 1;

    const dashboard = await Dashboard.findOneAndUpdate(
      { userId },
      { $inc: { totalMessagesSent: count } },
      { new: true, upsert: true }
    );

    res.status(200).json(dashboard);
  } catch (err) {
    console.error("Lỗi incrementMessages:", err);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

/**
 * Thêm hoạt động gần đây
 * @body content = nội dung hoạt động
 */
export const addRecentActivity = async (req, res) => {
  try {
    const userId = req.user._id;
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ message: "Thiếu nội dung hoạt động" });
    }

    const dashboard = await Dashboard.findOneAndUpdate(
      { userId },
      { $push: { recentActivity: { content } } },
      { new: true, upsert: true }
    );

    res.status(200).json(dashboard);
  } catch (err) {
    console.error("Lỗi addRecentActivity:", err);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};
