// src/middlewares/adminMiddleware.js

export const adminMiddleware = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Bạn chưa đăng nhập." });
    }

    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Bạn không có quyền admin." });
    }

    next();
  } catch (err) {
    console.error("Lỗi adminMiddleware:", err);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};
