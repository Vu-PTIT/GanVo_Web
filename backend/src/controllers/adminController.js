import User from "../models/User.js";
import Appointment from "../models/appointmentModel.js";
import bcrypt from "bcrypt";

// --- ADMIN FUNCTIONS ---

// LẤY THỐNG KÊ ADMIN
export const getAdminStats = async (req, res) => {
    try {
        // 1. Tổng số lượng
        const totalUsers = await User.countDocuments({ role: { $ne: "admin" } });
        const totalAppointments = await Appointment.countDocuments();

        // 2. Thống kê theo tháng (12 tháng gần nhất)
        const today = new Date();
        const last12Months = new Date(today.getFullYear(), today.getMonth() - 11, 1);

        // Helper function để group by month
        const getMonthlyStats = async (Model, matchQuery = {}) => {
            const stats = await Model.aggregate([
                {
                    $match: {
                        createdAt: { $gte: last12Months },
                        ...matchQuery
                    }
                },
                {
                    $group: {
                        _id: {
                            month: { $month: "$createdAt" },
                            year: { $year: "$createdAt" }
                        },
                        count: { $sum: 1 }
                    }
                },
                { $sort: { "_id.year": 1, "_id.month": 1 } }
            ]);

            // Fill missing months with 0
            const filledStats = [];
            for (let i = 0; i < 12; i++) {
                const d = new Date(today.getFullYear(), today.getMonth() - 11 + i, 1);
                const month = d.getMonth() + 1;
                const year = d.getFullYear();

                const found = stats.find(s => s._id.month === month && s._id.year === year);
                filledStats.push({
                    name: `T${month}/${year}`,
                    month,
                    year,
                    count: found ? found.count : 0
                });
            }
            return filledStats;
        };

        const usersByMonth = await getMonthlyStats(User, { role: { $ne: "admin" } });
        const appointmentsByMonth = await getMonthlyStats(Appointment);

        return res.status(200).json({
            totalUsers,
            totalAppointments,
            usersByMonth,
            appointmentsByMonth
        });

    } catch (error) {
        console.error("Lỗi getAdminStats:", error);
        return res.status(500).json({ message: "Lỗi hệ thống" });
    }
};

// LẤY TẤT CẢ USER (ROLE USER)
export const getAllUsers = async (req, res) => {
    try {
        console.log("getAllUsers called by:", req.user.username);
        // Find all users who are NOT admins (so we see users, or those with missing roles)
        const users = await User.find({ role: { $ne: "admin" } })
            .select("-hashedPassword -embedding")
            .sort({ createdAt: -1 });

        console.log(`Found ${users.length} users`);
        return res.status(200).json(users);
    } catch (error) {
        console.error("Lỗi getAllUsers:", error);
        return res.status(500).json({ message: "Lỗi hệ thống" });
    }
};

// TẠO USER MỚI (ADMIN)
export const createUser = async (req, res) => {
    try {
        const { username, password, email, displayName } = req.body;

        if (!username || !password || !email || !displayName) {
            return res.status(400).json({ message: "Vui lòng điền đầy đủ thông tin" });
        }

        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(400).json({ message: "Username hoặc Email đã tồn tại" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            username,
            hashedPassword,
            email,
            displayName,
            role: "user"
        });

        return res.status(201).json({ message: "Tạo user thành công", user: newUser });
    } catch (error) {
        console.error("Lỗi createUser:", error);
        return res.status(500).json({ message: "Lỗi hệ thống" });
    }
};

// CẬP NHẬT USER (ADMIN)
export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { displayName, email, password } = req.body;

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: "Không tìm thấy user" });
        }

        if (displayName) user.displayName = displayName;
        if (email) user.email = email;
        if (password) {
            user.hashedPassword = await bcrypt.hash(password, 10);
        }

        await user.save();

        return res.status(200).json({ message: "Cập nhật thành công", user });
    } catch (error) {
        console.error("Lỗi updateUser:", error);
        return res.status(500).json({ message: "Lỗi hệ thống" });
    }
};

// XÓA USER (ADMIN)
export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByIdAndDelete(id);

        if (!user) {
            return res.status(404).json({ message: "Không tìm thấy user" });
        }

        return res.status(200).json({ message: "Xóa user thành công" });
    } catch (error) {
        console.error("Lỗi deleteUser:", error);
        return res.status(500).json({ message: "Lỗi hệ thống" });
    }
};
