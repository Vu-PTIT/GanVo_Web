import Notification from "../models/Notification.js";

// LẤY DANH SÁCH THÔNG BÁO
export const getNotifications = async (req, res) => {
  try {
    const userId = req.user._id;
    const { limit = 20, unreadOnly = false } = req.query;

    const query = { recipientId: userId };
    if (unreadOnly === "true") {
      query.isRead = false;
    }

    const notifications = await Notification.find(query)
      .populate("senderId", "displayName avatarUrl username")
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    const unreadCount = await Notification.countDocuments({
      recipientId: userId,
      isRead: false,
    });

    return res.status(200).json({
      notifications,
      unreadCount,
      total: notifications.length,
    });
  } catch (error) {
    console.error("Lỗi getNotifications:", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

// ĐẾM SỐ THÔNG BÁO CHƯA ĐỌC
export const getUnreadCount = async (req, res) => {
  try {
    const userId = req.user._id;

    const count = await Notification.countDocuments({
      recipientId: userId,
      isRead: false,
    });

    return res.status(200).json({ unreadCount: count });
  } catch (error) {
    console.error("Lỗi getUnreadCount:", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

// ĐÁNH DẤU ĐÃ ĐỌC 1 THÔNG BÁO
export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const notification = await Notification.findOneAndUpdate(
      {
        _id: id,
        recipientId: userId,
      },
      {
        isRead: true,
        readAt: new Date(),
      },
      { new: true }
    ).populate("senderId", "displayName avatarUrl username");

    if (!notification) {
      return res.status(404).json({ message: "Không tìm thấy thông báo" });
    }

    return res.status(200).json({
      message: "Đã đánh dấu đã đọc",
      notification,
    });
  } catch (error) {
    console.error("Lỗi markAsRead:", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

// ĐÁNH DẤU ĐÃ ĐỌC TẤT CẢ
export const markAllAsRead = async (req, res) => {
  try {
    const userId = req.user._id;

    await Notification.updateMany(
      {
        recipientId: userId,
        isRead: false,
      },
      {
        isRead: true,
        readAt: new Date(),
      }
    );

    return res.status(200).json({ message: "Đã đánh dấu tất cả đã đọc" });
  } catch (error) {
    console.error("Lỗi markAllAsRead:", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

// XÓA 1 THÔNG BÁO
export const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const notification = await Notification.findOneAndDelete({
      _id: id,
      recipientId: userId,
    });

    if (!notification) {
      return res.status(404).json({ message: "Không tìm thấy thông báo" });
    }

    return res.status(200).json({ message: "Đã xóa thông báo" });
  } catch (error) {
    console.error("Lỗi deleteNotification:", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

// XÓA TẤT CẢ THÔNG BÁO
export const deleteAllNotifications = async (req, res) => {
  try {
    const userId = req.user._id;

    await Notification.deleteMany({ recipientId: userId });

    return res.status(200).json({ message: "Đã xóa tất cả thông báo" });
  } catch (error) {
    console.error("Lỗi deleteAllNotifications:", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};


// TẠO THÔNG BÁO MỚI
export const createNotification = async (data) => {
  try {
    const notification = await Notification.create(data);
    
    // Populate sender info
    const populatedNotification = await Notification.findById(notification._id)
      .populate("senderId", "displayName avatarUrl username");

    // Gửi realtime notification qua Socket.IO
    if (global.io) {
      global.io.to(data.recipientId.toString()).emit("new_notification", populatedNotification);
    }

    return populatedNotification;
  } catch (error) {
    console.error("Lỗi createNotification:", error);
    return null;
  }
};

// TẠO THÔNG BÁO KHI CÓ NGƯỜI THÍCH MÌNH
export const createLikeNotification = async (likerId, likedUserId) => {
  return createNotification({
    recipientId: likedUserId,
    senderId: likerId,
    type: "like",
    title: "Ai đó đã thích bạn! ",
    message: "đã thích hồ sơ của bạn",
    relatedId: likerId,
    relatedType: "User",
  });
};

// TẠO THÔNG BÁO KHI MATCH
export const createMatchNotification = async (userId1, userId2, matchId) => {
  // Thông báo cho cả 2 người
  const notifications = [];
  
  notifications.push(
    createNotification({
      recipientId: userId1,
      senderId: userId2,
      type: "match",
      title: "Bạn có một match mới! ",
      message: "và bạn đã match với nhau!",
      relatedId: matchId,
      relatedType: "Match",
    })
  );

  notifications.push(
    createNotification({
      recipientId: userId2,
      senderId: userId1,
      type: "match",
      title: "Bạn có một match mới! ",
      message: "và bạn đã match với nhau!",
      relatedId: matchId,
      relatedType: "Match",
    })
  );

  return Promise.all(notifications);
};

// TẠO THÔNG BÁO KHI CÓ TIN NHẮN MỚI
export const createMessageNotification = async (senderId, recipientId, messageId, conversationId) => {
  return createNotification({
    recipientId,
    senderId,
    type: "message",
    title: "Tin nhắn mới 💬",
    message: "đã gửi tin nhắn cho bạn",
    relatedId: conversationId,
    relatedType: "Conversation",
  });
};