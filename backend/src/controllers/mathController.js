import Match from "../models/Match.js";
import User from "../models/User.js";

// 1. Lấy danh sách "Khám Phá" (Những người chưa từng tương tác)
export const getExplorations = async (req, res) => {
  try {
    const currentUserId = req.user._id;

    // Bước 1: Tìm tất cả những người mình đã từng Like hoặc Dislike (mình là requester)
    // Để không hiển thị lại những người mình đã quyết định rồi
    const interactedMatches = await Match.find({ requester: currentUserId }).select("recipient");
    const interactedIds = interactedMatches.map((m) => m.recipient);

    // Bước 2: Tìm tất cả những người đã Match với mình (mình là recipient nhưng status là matched)
    // Để tránh hiển thị lại những người đã là bạn bè (đã match)
    const friendMatches = await Match.find({ recipient: currentUserId, status: "matched" }).select("requester");
    const friendIds = friendMatches.map((m) => m.requester);

    // Danh sách cần loại trừ: Chính mình + Người đã tương tác + Bạn bè đã match
    const excludeIds = [currentUserId, ...interactedIds, ...friendIds];

    // Bước 3: Query User (có thể thêm filter theo location, gender ở đây nếu cần)
    // Sử dụng $nin (not in) để loại trừ các ID trong danh sách excludeIds
    const candidates = await User.find({ _id: { $nin: excludeIds } })
      .select("displayName avatarUrl bio gender dateOfBirth location") // Chỉ lấy trường cần thiết để hiển thị card
      .limit(20); // Giới hạn số lượng trả về để tối ưu hiệu năng

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

    if (action === 'dislike') {
      // Nếu Dislike, tạo bản ghi với status 'rejected' để không hiện lại nữa
      await Match.create({
        requester: currentUserId,
        recipient: targetUserId,
        status: "rejected",
      });
      return res.status(200).json({ message: "Đã bỏ qua" });
    }

    // Nếu Like: Kiểm tra xem họ có Like mình trước đó không 
    // (Tức là tìm xem có bản ghi nào Họ là requester, Mình là recipient, và status là pending không)
    const existingMatch = await Match.findOne({
      requester: targetUserId,
      recipient: currentUserId,
      status: "pending",
    });

    if (existingMatch) {
      // => IT'S A MATCH! Cả hai đều like nhau.
      // Cập nhật trạng thái bản ghi cũ của họ thành 'matched'
      existingMatch.status = "matched";
      await existingMatch.save();
      
      // Ở đây ta không cần tạo thêm bản ghi mới chiều ngược lại (Mình -> Họ), 
      // vì logic query 'getMatches' sẽ tìm cả 2 chiều.
      
      return res.status(200).json({ message: "Tương hợp thành công!", isMatch: true });
    }

    // Nếu họ chưa like mình (hoặc chưa thấy mình) -> Tạo bản ghi 'pending' (Chờ họ like lại)
    await Match.create({
      requester: currentUserId,
      recipient: targetUserId,
      status: "pending",
    });

    return res.status(200).json({ message: "Đã gửi yêu cầu thích", isMatch: false });

  } catch (error) {
    // Lỗi duplicate key (đã like rồi mà like lại lần nữa)
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

    // Tìm các bản ghi có status = 'matched' mà mình có liên quan (là requester HOẶC recipient)
    const matches = await Match.find({
      $or: [
        { requester: currentUserId, status: "matched" },
        { recipient: currentUserId, status: "matched" },
      ],
    })
    // Populate để lấy thông tin chi tiết user thay vì chỉ lấy ID
    .populate("requester", "displayName avatarUrl location dateOfBirth bio")
    .populate("recipient", "displayName avatarUrl location dateOfBirth bio");

    // Map ra danh sách chỉ chứa thông tin của "người kia" (đối phương)
    const data = matches.map((match) => {
        // Kiểm tra xem trong bản ghi match này, mình là requester hay recipient
        const isRequester = match.requester._id.toString() === currentUserId.toString();
        // Nếu mình là requester -> lấy recipient (người kia)
        // Nếu mình là recipient -> lấy requester (người kia)
        return isRequester ? match.recipient : match.requester;
    });

    return res.status(200).json({ matches: data });
  } catch (error) {
    console.error("Lỗi getMatches:", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};