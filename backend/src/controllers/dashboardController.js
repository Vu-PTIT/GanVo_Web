import Match from "../models/Match.js";
import Appointment from "../models/appointmentModel.js";
import Message from "../models/Message.js";
import User from "../models/User.js";

// LẤY THỐNG KÊ TỔNG QUAN
export const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user._id;
    
    const now = new Date();
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const thisYear = new Date(now.getFullYear(), 0, 1);
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    // 1. MATCH STATS
    const matchesThisMonth = await Match.countDocuments({
      $or: [{ requester: userId }, { recipient: userId }],
      status: "matched",
      createdAt: { $gte: thisMonth }
    });

    const matchesLastMonth = await Match.countDocuments({
      $or: [{ requester: userId }, { recipient: userId }],
      status: "matched",
      createdAt: { $gte: lastMonth, $lt: thisMonth }
    });

    const matchesThisYear = await Match.countDocuments({
      $or: [{ requester: userId }, { recipient: userId }],
      status: "matched",
      createdAt: { $gte: thisYear }
    });

    // 2. APPOINTMENT STATS
    const appointmentsCreated = await Appointment.countDocuments({
      userId,
      createdAt: { $gte: thisYear }
    });

    const appointmentsThisMonth = await Appointment.countDocuments({
      userId,
      createdAt: { $gte: thisMonth }
    });

    const appointmentsLastMonth = await Appointment.countDocuments({
      userId,
      createdAt: { $gte: lastMonth, $lt: thisMonth }
    });

    // 3. MESSAGE STATS
    const messagesSent = await Message.countDocuments({
      senderId: userId,
      createdAt: { $gte: thisYear }
    });

    const messagesThisMonth = await Message.countDocuments({
      senderId: userId,
      createdAt: { $gte: thisMonth }
    });

    const messagesLastMonth = await Message.countDocuments({
      senderId: userId,
      createdAt: { $gte: lastMonth, $lt: thisMonth }
    });

    // 4. TÍNH TREND (% thay đổi so với tháng trước)
    const matchTrend = matchesLastMonth > 0 
      ? ((matchesThisMonth - matchesLastMonth) / matchesLastMonth * 100).toFixed(1)
      : 0;

    const appointmentTrend = appointmentsLastMonth > 0
      ? ((appointmentsThisMonth - appointmentsLastMonth) / appointmentsLastMonth * 100).toFixed(1)
      : 0;

    const messageTrend = messagesLastMonth > 0
      ? ((messagesThisMonth - messagesLastMonth) / messagesLastMonth * 100).toFixed(1)
      : 0;

    return res.status(200).json({
      stats: {
        matchesThisMonth,
        matchesThisYear,
        appointmentsCreated,
        messagesSent
      },
      trends: {
        matchTrend: parseFloat(matchTrend),
        appointmentTrend: parseFloat(appointmentTrend),
        messageTrend: parseFloat(messageTrend)
      }
    });

  } catch (error) {
    console.error("Lỗi getDashboardStats:", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

// LẤY DỮ LIỆU BIỂU ĐỒ
export const getChartData = async (req, res) => {
  try {
    const userId = req.user._id;
    const { months = 10 } = req.query;

    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth() - parseInt(months) + 1, 1);

    // Helper function để group by month
    const getMonthlyData = async (Model, matchQuery = {}) => {
      const data = await Model.aggregate([
        {
          $match: {
            createdAt: { $gte: startDate },
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

      return data;
    };

    // Lấy dữ liệu Match
    const matchData = await getMonthlyData(Match, {
      $or: [{ requester: userId }, { recipient: userId }],
      status: "matched"
    });

    // Lấy dữ liệu Appointment
    const appointmentData = await getMonthlyData(Appointment, { userId });

    // Fill missing months với giá trị 0
    const chartData = [];
    for (let i = 0; i < parseInt(months); i++) {
      const date = new Date(now.getFullYear(), now.getMonth() - parseInt(months) + i + 1, 1);
      const month = date.getMonth() + 1;
      const year = date.getFullYear();

      const matchCount = matchData.find(
        item => item._id.month === month && item._id.year === year
      )?.count || 0;

      const appointmentCount = appointmentData.find(
        item => item._id.month === month && item._id.year === year
      )?.count || 0;

      chartData.push({
        name: `Th${month}`,
        month,
        year,
        matches: matchCount,
        appointments: appointmentCount
      });
    }

    return res.status(200).json({ chartData });

  } catch (error) {
    console.error("Lỗi getChartData:", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

// LẤY HOẠT ĐỘNG GÂN ĐÂY
export const getRecentActivities = async (req, res) => {
  try {
    const userId = req.user._id;
    const { limit = 20 } = req.query;

    const activities = [];

    // 1. Lấy Match gần đây
    const recentMatches = await Match.find({
      $or: [{ requester: userId }, { recipient: userId }],
      status: "matched"
    })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("requester recipient", "displayName avatarUrl");

    recentMatches.forEach(match => {
      const otherUser = match.requester._id.toString() === userId.toString() 
        ? match.recipient 
        : match.requester;

      activities.push({
        id: match._id,
        type: "match",
        user: otherUser.displayName,
        action: "đã match với bạn",
        time: formatTimeAgo(match.createdAt),
        createdAt: match.createdAt,
        icon: "Heart",
        color: "text-pink-500"
      });
    });

    // 2. Lấy Appointment gần đây
    const recentAppointments = await Appointment.find({ userId })
      .sort({ createdAt: -1 })
      .limit(5);

    recentAppointments.forEach(appointment => {
      activities.push({
        id: appointment._id,
        type: "appointment",
        user: req.user.displayName,
        action: `đã tạo một lịch hẹn vào ${new Date(appointment.dateTime).toLocaleDateString('vi-VN')}`,
        time: formatTimeAgo(appointment.createdAt),
        createdAt: appointment.createdAt,
        icon: "Calendar",
        color: "text-blue-500"
      });
    });

    // 3. Lấy Message gần đây (unique conversations)
    const recentMessages = await Message.aggregate([
      {
        $match: { senderId: userId }
      },
      {
        $sort: { createdAt: -1 }
      },
      {
        $group: {
          _id: "$conversationId",
          lastMessage: { $first: "$$ROOT" },
          count: { $sum: 1 }
        }
      },
      {
        $limit: 5
      }
    ]);

    for (const msg of recentMessages) {
      activities.push({
        id: msg._id,
        type: "message",
        user: req.user.displayName,
        action: `đã gửi ${msg.count} tin nhắn mới`,
        time: formatTimeAgo(msg.lastMessage.createdAt),
        createdAt: msg.lastMessage.createdAt,
        icon: "MessageCircle",
        color: "text-green-500"
      });
    }

    // Sort theo thời gian và limit
    activities.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    const limitedActivities = activities.slice(0, parseInt(limit));

    return res.status(200).json({
      activities: limitedActivities,
      total: limitedActivities.length
    });

  } catch (error) {
    console.error("Lỗi getRecentActivities:", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

// Helper function format thời gian
function formatTimeAgo(date) {
  const now = new Date();
  const diff = now - new Date(date);
  
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "Vừa xong";
  if (minutes < 60) return `${minutes} phút trước`;
  if (hours < 24) return `${hours} giờ trước`;
  if (days < 7) return `${days} ngày trước`;
  if (days < 30) return `${Math.floor(days / 7)} tuần trước`;
  return `${Math.floor(days / 30)} tháng trước`;
}

// TỔNG HỢP TẤT CẢ (1 API)
export const getDashboardOverview = async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Gọi song song các function
    const [statsResult, chartResult, activitiesResult] = await Promise.all([
      getDashboardStatsData(userId),
      getChartDataData(userId),
      getRecentActivitiesData(userId)
    ]);

    return res.status(200).json({
      ...statsResult,
      ...chartResult,
      ...activitiesResult
    });

  } catch (error) {
    console.error("Lỗi getDashboardOverview:", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

// Helper functions để tái sử dụng logic
async function getDashboardStatsData(userId) {
  const now = new Date();
  const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const thisYear = new Date(now.getFullYear(), 0, 1);

  const matchesThisMonth = await Match.countDocuments({
    $or: [{ requester: userId }, { recipient: userId }],
    status: "matched",
    createdAt: { $gte: thisMonth }
  });

  const matchesThisYear = await Match.countDocuments({
    $or: [{ requester: userId }, { recipient: userId }],
    status: "matched",
    createdAt: { $gte: thisYear }
  });

  const appointmentsCreated = await Appointment.countDocuments({
    userId,
    createdAt: { $gte: thisYear }
  });

  const messagesSent = await Message.countDocuments({
    senderId: userId,
    createdAt: { $gte: thisYear }
  });

  return {
    stats: {
      matchesThisMonth,
      matchesThisYear,
      appointmentsCreated,
      messagesSent
    }
  };
}

async function getChartDataData(userId, months = 10) {
  const now = new Date();
  const startDate = new Date(now.getFullYear(), now.getMonth() - months + 1, 1);

  const matchData = await Match.aggregate([
    {
      $match: {
        $or: [{ requester: userId }, { recipient: userId }],
        status: "matched",
        createdAt: { $gte: startDate }
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

  const appointmentData = await Appointment.aggregate([
    {
      $match: {
        userId,
        createdAt: { $gte: startDate }
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

  const chartData = [];
  for (let i = 0; i < months; i++) {
    const date = new Date(now.getFullYear(), now.getMonth() - months + i + 1, 1);
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    const matchCount = matchData.find(
      item => item._id.month === month && item._id.year === year
    )?.count || 0;

    const appointmentCount = appointmentData.find(
      item => item._id.month === month && item._id.year === year
    )?.count || 0;

    chartData.push({
      name: `Th${month}`,
      matches: matchCount,
      appointments: appointmentCount
    });
  }

  return { chartData };
}

async function getRecentActivitiesData(userId) {
  const activities = [];

  const recentMatches = await Match.find({
    $or: [{ requester: userId }, { recipient: userId }],
    status: "matched"
  })
    .sort({ createdAt: -1 })
    .limit(5)
    .populate("requester recipient", "displayName");

  recentMatches.forEach(match => {
    const otherUser = match.requester._id.toString() === userId.toString() 
      ? match.recipient 
      : match.requester;

    activities.push({
      type: "match",
      user: otherUser.displayName,
      action: "đã match với bạn",
      time: formatTimeAgo(match.createdAt),
      createdAt: match.createdAt
    });
  });

  const recentAppointments = await Appointment.find({ userId })
    .sort({ createdAt: -1 })
    .limit(3);

  const user = await User.findById(userId).select("displayName");

  recentAppointments.forEach(appointment => {
    activities.push({
      type: "appointment",
      user: user.displayName,
      action: `đã tạo lịch hẹn`,
      time: formatTimeAgo(appointment.createdAt),
      createdAt: appointment.createdAt
    });
  });

  activities.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return { activities: activities.slice(0, 10) };
}