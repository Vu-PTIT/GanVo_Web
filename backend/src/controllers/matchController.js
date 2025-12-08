// controllers/matchController.js
import Match from "../models/Match.js";
import User from "../models/User.js";
import { calculateSimilarity } from "../utils/gemini.js";
import {
  createLikeNotification,
  createMatchNotification
} from "../controllers/notificationController.js";
// KHÁM PHÁ HỒ SƠ MỚI (Swipe Mode) 
export const getExplorations = async (req, res) => {
  try {
    const currentUserId = req.user._id;
    const currentUser = req.user;

    // Query params để filter
    const {
      minAge,
      maxAge,
      gender,
      location,
      maxDistance = 50, // km
      limit = 20
    } = req.query;

    // Bước 1: Lấy danh sách đã tương tác
    const interactedMatches = await Match.find({
      requester: currentUserId
    }).select("recipient");

    const interactedIds = interactedMatches.map(m => m.recipient.toString());

    // Bước 2: Lấy danh sách đã match/friend
    const connectedMatches = await Match.find({
      $or: [
        { requester: currentUserId, status: { $in: ["matched", "friends"] } },
        { recipient: currentUserId, status: { $in: ["matched", "friends"] } }
      ]
    }).select("requester recipient");

    const connectedIds = connectedMatches.map(m => {
      const otherId = m.requester.toString() === currentUserId.toString()
        ? m.recipient.toString()
        : m.requester.toString();
      return otherId;
    });

    const excludeIds = [
      currentUserId.toString(),
      ...interactedIds,
      ...connectedIds
    ];

    // Bước 3: Build query với filters
    let query = { _id: { $nin: excludeIds }, role: { $ne: "admin" } };

    // Filter theo tuổi
    if (minAge || maxAge) {
      const now = new Date();
      if (maxAge) {
        const minDate = new Date(now.getFullYear() - maxAge - 1, now.getMonth(), now.getDate());
        query.dateOfBirth = { $gte: minDate };
      }
      if (minAge) {
        const maxDate = new Date(now.getFullYear() - minAge, now.getMonth(), now.getDate());
        query.dateOfBirth = { ...query.dateOfBirth, $lte: maxDate };
      }
    }

    // Filter theo giới tính
    if (gender && gender !== "all") {
      query.gender = gender;
    }

    // Filter theo khu vực (nếu có location)
    if (location && location !== "all") {
      query.location = new RegExp(location, "i"); // Case-insensitive
    }

    // Bước 4: Query users với embedding
    let candidates = await User.find(query)
      .select("displayName avatarUrl bio gender dateOfBirth location interests photos embedding")
      .limit(parseInt(limit) * 3); // Lấy nhiều để sort

    if (candidates.length === 0) {
      return res.status(200).json({ users: [], message: "Không còn người dùng phù hợp" });
    }

    // Bước 5: Tính điểm tương đồng với Gemini AI
    if (currentUser.embedding && currentUser.embedding.length > 0) {
      candidates = candidates.map(candidate => {
        let score = 0;

        // 1. AI Similarity (60%)
        if (candidate.embedding && candidate.embedding.length > 0) {
          const aiScore = calculateSimilarity(currentUser.embedding, candidate.embedding);
          score += aiScore * 0.6;
        }

        // 2. Location Match (20%)
        if (currentUser.location && candidate.location) {
          const locationMatch = currentUser.location.toLowerCase() === candidate.location.toLowerCase();
          score += locationMatch ? 0.2 : 0;
        }

        // 3. Common Interests (20%)
        if (currentUser.interests && candidate.interests) {
          const commonCount = currentUser.interests.filter(i =>
            candidate.interests.includes(i)
          ).length;
          const interestScore = Math.min(commonCount / 5, 1); // Max 5 interests
          score += interestScore * 0.2;
        }

        return {
          _id: candidate._id,
          displayName: candidate.displayName,
          avatarUrl: candidate.avatarUrl,
          bio: candidate.bio,
          gender: candidate.gender,
          age: candidate.age, // Virtual field
          location: candidate.location,
          interests: candidate.interests,
          photos: candidate.photos,
          matchScore: Math.round(score * 100), // 0-100
        };
      })
        .sort((a, b) => b.matchScore - a.matchScore) // Điểm cao nhất lên đầu
        .slice(0, parseInt(limit));
    } else {
      // Nếu user chưa có embedding, trả về random
      candidates = candidates.slice(0, parseInt(limit)).map(c => ({
        _id: c._id,
        displayName: c.displayName,
        avatarUrl: c.avatarUrl,
        bio: c.bio,
        gender: c.gender,
        age: c.age,
        location: c.location,
        interests: c.interests,
        photos: c.photos,
        matchScore: 0
      }));
    }

    return res.status(200).json({
      users: candidates,
      total: candidates.length
    });

  } catch (error) {
    console.error("Lỗi getExplorations:", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

//SWIPE (LIKE/DISLIKE)
export const swipe = async (req, res) => {
  try {
    const { targetUserId, action } = req.body; // action: 'like' | 'dislike'
    const currentUserId = req.user._id;
    const currentUser = req.user;

    if (!targetUserId || !['like', 'dislike'].includes(action)) {
      return res.status(400).json({ message: "Dữ liệu không hợp lệ" });
    }

    if (currentUserId.toString() === targetUserId) {
      return res.status(400).json({ message: "Không thể tương tác với chính mình" });
    }

    // Kiểm tra user tồn tại
    const targetUser = await User.findById(targetUserId).select("embedding displayName");
    if (!targetUser) {
      return res.status(404).json({ message: "Người dùng không tồn tại" });
    }

    // CASE 1: DISLIKE 
    if (action === 'dislike') {
      await Match.create({
        requester: currentUserId,
        recipient: targetUserId,
        status: "rejected",
      });
      return res.status(200).json({
        message: "Đã bỏ qua",
        isMatch: false
      });
    }

    // CASE 2: LIKE 
    // Kiểm tra người kia đã like mình chưa
    const existingMatch = await Match.findOne({
      requester: targetUserId,
      recipient: currentUserId,
      status: "pending",
    });

    if (existingMatch) {
      // IT'S A MATCH!

      // Tính similarity score
      let similarityScore = 0;
      if (currentUser.embedding?.length > 0 && targetUser.embedding?.length > 0) {
        similarityScore = calculateSimilarity(currentUser.embedding, targetUser.embedding);
      }

      existingMatch.status = "matched";
      existingMatch.similarityScore = similarityScore;
      await existingMatch.save();

      // TẠO THÔNG BÁO MATCH CHO CẢ 2 NGƯỜI
      await createMatchNotification(currentUserId, targetUserId, existingMatch._id);

      return res.status(200).json({
        message: `Bạn và ${targetUser.displayName} đã match! `,
        isMatch: true,
        matchData: {
          userId: targetUserId,
          displayName: targetUser.displayName,
          similarityScore: Math.round(similarityScore * 100)
        }
      });
    }

    // Chưa match -> Tạo pending
    await Match.create({
      requester: currentUserId,
      recipient: targetUserId,
      status: "pending",
    });

    //  TẠO THÔNG BÁO CHO NGƯỜI BỊ LIKE
    await createLikeNotification(currentUserId, targetUserId);

    return res.status(200).json({
      message: "Đã gửi yêu cầu thích",
      isMatch: false
    });

  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Bạn đã tương tác với người này rồi" });
    }
    console.error("Lỗi swipe:", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};
// DANH SÁCH ĐÃ MATCH 
export const getMatches = async (req, res) => {
  try {
    const currentUserId = req.user._id;

    const matches = await Match.find({
      $or: [
        { requester: currentUserId, status: "matched" },
        { recipient: currentUserId, status: "matched" },
      ],
    })
      .populate("requester", "displayName avatarUrl location dateOfBirth bio isOnline")
      .populate("recipient", "displayName avatarUrl location dateOfBirth bio isOnline")
      .sort({ updatedAt: -1 });

    const data = matches.map((match) => {
      const isRequester = match.requester._id.toString() === currentUserId.toString();
      const person = isRequester ? match.recipient : match.requester;

      return {
        _id: person._id,
        displayName: person.displayName,
        avatarUrl: person.avatarUrl,
        location: person.location,
        age: person.age,
        bio: person.bio,
        isOnline: person.isOnline,
        matchId: match._id,
        similarityScore: match.similarityScore ? Math.round(match.similarityScore * 100) : 0,
        matchedAt: match.updatedAt
      };
    });

    return res.status(200).json({
      matches: data,
      total: data.length
    });
  } catch (error) {
    console.error("Lỗi getMatches:", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

// DANH SÁCH AI ĐÃ LIKE MÌNH 
export const getWhoLikesMe = async (req, res) => {
  try {
    const currentUserId = req.user._id;

    const likes = await Match.find({
      recipient: currentUserId,
      status: "pending" // Người ta đã like mình nhưng mình chưa phản hồi
    })
      .populate("requester", "displayName avatarUrl location dateOfBirth bio interests")
      .sort({ createdAt: -1 })
      .limit(50);

    const data = likes.map(like => ({
      _id: like.requester._id,
      displayName: like.requester.displayName,
      avatarUrl: like.requester.avatarUrl,
      location: like.requester.location,
      age: like.requester.age,
      bio: like.requester.bio,
      interests: like.requester.interests,
      likedAt: like.createdAt
    }));

    return res.status(200).json({
      likes: data,
      total: data.length
    });
  } catch (error) {
    console.error("Lỗi getWhoLikesMe:", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

// DANH SÁCH MÌNH ĐÃ LIKE (CHƯA MATCH)
export const getMyLikes = async (req, res) => {
  try {
    const currentUserId = req.user._id;

    const likes = await Match.find({
      requester: currentUserId,
      status: "pending"
    })
      .populate("recipient", "displayName avatarUrl location dateOfBirth bio interests")
      .sort({ createdAt: -1 })
      .limit(50);

    const data = likes.map(like => ({
      _id: like.recipient._id,
      displayName: like.recipient.displayName,
      avatarUrl: like.recipient.avatarUrl,
      location: like.recipient.location,
      age: like.recipient.age,
      bio: like.recipient.bio,
      interests: like.recipient.interests,
      likedAt: like.createdAt,
      matchId: like._id // Match document ID needed for unmatch
    }));

    return res.status(200).json({
      likes: data,
      total: data.length
    });
  } catch (error) {
    console.error("Lỗi getMyLikes:", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

// XÓA MATCH (UNMATCH) 
export const unmatch = async (req, res) => {
  try {
    const { matchId } = req.params;
    const currentUserId = req.user._id;

    const match = await Match.findById(matchId);

    if (!match) {
      return res.status(404).json({ message: "Không tìm thấy match" });
    }

    // Kiểm tra có phải match của mình không
    const isMyMatch =
      match.requester.toString() === currentUserId.toString() ||
      match.recipient.toString() === currentUserId.toString();

    if (!isMyMatch) {
      return res.status(403).json({ message: "Không có quyền xóa match này" });
    }

    await Match.findByIdAndDelete(matchId);

    return res.status(200).json({ message: "Đã unmatch" });
  } catch (error) {
    console.error("Lỗi unmatch:", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};