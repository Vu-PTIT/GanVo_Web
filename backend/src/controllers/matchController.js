import Match from "../models/Match.js"; // Đảm bảo import đúng file Match.js
import User from "../models/User.js";

// 1. Lấy danh sách "Khám Phá" (Những người chưa từng tương tác)
export const getExplorations = async (req, res) => {
  try {
    const currentUserId = req.user._id;

    // Bước 1: Tìm những người MÌNH đã từng Like/Dislike (mình là requester)
    const interactedMatches = await Match.find({ requester: currentUserId }).select("recipient");
    const interactedIds = interactedMatches.map((m) => m.recipient);

    // Bước 2: Tìm những người đã Match với mình (mình là recipient, status matched)
    // (Để tránh hiện lại người yêu/bạn bè cũ trong list khám phá)
    const friendMatches = await Match.find({ recipient: currentUserId, status: "matched" }).select("requester");
    const friendIds = friendMatches.map((m) => m.requester);

    // Tổng hợp danh sách loại trừ
    const excludeIds = [currentUserId, ...interactedIds, ...friendIds];

    // Bước 3: Query User, loại trừ danh sách trên
    const candidates = await User.find({ _id: { $nin: excludeIds } })
      .select("displayName avatarUrl bio gender dateOfBirth location interests photos") 
      .limit(20); 

    return res.status(200).json({ users: candidates });
  } catch (error) {
    console.error("Lỗi getExplorations:", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

// 2. Xử lý hành động Swipe (Like/Dislike)
export const swipe = async (req, res) => {
  try {
    const { targetUserId, action } = req.body; // action: 'like' | 'dislike'
    const currentUserId = req.user._id;

    if (!targetUserId || !['like', 'dislike'].includes(action)) {
      return res.status(400).json({ message: "Dữ liệu không hợp lệ" });
    }

    // CASE 1: DISLIKE
    if (action === 'dislike') {
      await Match.create({
        requester: currentUserId,
        recipient: targetUserId,
        status: "rejected",
      });
      return res.status(200).json({ message: "Đã bỏ qua", isMatch: false });
    }

    // CASE 2: LIKE
    // Kiểm tra xem người kia CÓ LIKE MÌNH TRƯỚC ĐÓ KHÔNG?
    // (Họ là requester, Mình là recipient, status là pending)
    const existingMatch = await Match.findOne({
      requester: targetUserId,
      recipient: currentUserId,
      status: "pending",
    });

    if (existingMatch) {
      // => IT'S A MATCH!
      existingMatch.status = "matched";
      await existingMatch.save();
      
      // Không cần tạo record ngược lại, vì logic getMatches sẽ tìm cả 2 chiều
      
      return res.status(200).json({ message: "Tương hợp thành công!", isMatch: true });
    }

    // Nếu họ chưa like mình -> Tạo record pending chờ họ
    await Match.create({
      requester: currentUserId,
      recipient: targetUserId,
      status: "pending",
    });

    return res.status(200).json({ message: "Đã gửi yêu cầu thích", isMatch: false });

  } catch (error) {
    // Lỗi duplicate key (đã quẹt rồi mà quẹt lại)
    if (error.code === 11000) {
        return res.status(200).json({ message: "Bạn đã tương tác với người này rồi" });
    }
    console.error("Lỗi swipe:", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

// 3. Lấy danh sách "Đã Match" (Bạn bè)
export const getMatches = async (req, res) => {
  try {
    const currentUserId = req.user._id;

    // Tìm các bản ghi status = 'matched' mà mình có liên quan
    const matches = await Match.find({
      $or: [
        { requester: currentUserId, status: "matched" },
        { recipient: currentUserId, status: "matched" },
      ],
    })
    .populate("requester", "displayName avatarUrl location dateOfBirth bio isOnline")
    .populate("recipient", "displayName avatarUrl location dateOfBirth bio isOnline");

    // Lọc ra thông tin của người đối diện
    const data = matches.map((match) => {
        const isRequester = match.requester._id.toString() === currentUserId.toString();
        return isRequester ? match.recipient : match.requester;
    });

    return res.status(200).json({ matches: data });
  } catch (error) {
    console.error("Lỗi getMatches:", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};