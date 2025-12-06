import { GoogleGenerativeAI } from "@google/generative-ai";
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const embeddingModel = genAI.getGenerativeModel({ model: "text-embedding-004" });

// TẠO EMBEDDING TỪ PROFILE 
export const getEmbedding = async (text) => {
  try {
    if (!text || text.length < 5) return [];

    const result = await embeddingModel.embedContent(text);
    return result.embedding.values;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return [];
  }
};

// TÍNH COSINE SIMILARITY 
export const calculateSimilarity = (vecA, vecB) => {
  if (!vecA || !vecB || vecA.length === 0 || vecB.length === 0) return 0;
  if (vecA.length !== vecB.length) return 0;

  // Cosine Similarity = (A · B) / (||A|| * ||B||)
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }

  normA = Math.sqrt(normA);
  normB = Math.sqrt(normB);

  if (normA === 0 || normB === 0) return 0;

  return dotProduct / (normA * normB); // Giá trị từ -1 đến 1
};

// TẠO TEXT PROFILE ĐỂ EMBEDDING
export const buildProfileText = (user) => {
  const parts = [];

  if (user.location) {
    parts.push(`Tôi sống tại ${user.location}`);
  }

  if (user.interests && user.interests.length > 0) {
    parts.push(`Sở thích: ${user.interests.join(", ")}`);
  }

  if (user.lookingFor) {
    parts.push(`Mục tiêu: ${user.lookingFor}`);
  }

  if (user.bio) {
    parts.push(`Về tôi: ${user.bio}`);
  }

  if (user.gender) {
    parts.push(`Giới tính: ${user.gender}`);
  }

  return parts.join(". ").trim();
};

// CẬP NHẬT EMBEDDING CHO USER
export const updateUserEmbedding = async (userId, profileData) => {
  try {
    const User = (await import("../models/User.js")).default;
    
    const profileText = buildProfileText(profileData);
    
    if (!profileText || profileText.length < 10) {
      console.log(`Profile của user ${userId} quá ngắn, bỏ qua embedding`);
      return null;
    }

    console.log(`Đang tạo embedding cho user ${userId}...`);
    const embedding = await getEmbedding(profileText);

    if (embedding.length > 0) {
      await User.findByIdAndUpdate(userId, { 
        embedding 
      });
      console.log(` Đã cập nhật embedding cho user ${userId}`);
      return embedding;
    }

    return null;
  } catch (error) {
    console.error("Lỗi updateUserEmbedding:", error);
    return null;
  }
};

//  GỢI Ý CÂU MỞ ĐẦU (ICE BREAKER)
export const generateIceBreaker = (currentUser, targetUser) => {
  const suggestions = [];

  // 1. Common Interests
  if (currentUser.interests && targetUser.interests) {
    const common = currentUser.interests.filter(i => 
      targetUser.interests.includes(i)
    );
    
    if (common.length > 0) {
      suggestions.push(
        `Mình thấy bạn cũng thích ${common[0]}, bạn thường ${common[0]} ở đâu vậy? `,
        `Chào ${targetUser.displayName}! Mình cũng là fan của ${common[0]} đây `
      );
    }
  }

  // 2. Same Location
  if (currentUser.location === targetUser.location) {
    suggestions.push(
      `Hey! Mình cũng ở ${currentUser.location}, thật trùng hợp! `,
      `Chào người ${currentUser.location}! Có địa điểm nào hay ho bạn muốn giới thiệu không? `
    );
  }

  // 3. Bio-based
  if (targetUser.bio && targetUser.bio.length > 20) {
    const preview = targetUser.bio.substring(0, 40);
    suggestions.push(
      `"${preview}..." - Profile bạn thú vị đấy! Kể thêm đi `,
      `Mình thấy bạn có vẻ là người ${targetUser.bio.split(' ')[0]}, mình cũng thế!`
    );
  }

  // 4. Fallback
  if (suggestions.length === 0) {
    suggestions.push(
      `Chào ${targetUser.displayName}! Rất vui được match với bạn `,
      `Hi! Profile bạn thu hút mình đấy, hẹn được trò chuyện nhé `,
      `Hey ${targetUser.displayName}! Có vẻ chúng ta có nhiều điểm chung, mình có thể biết thêm về bạn không?`
    );
  }

  return suggestions.slice(0, 3); // Trả về tối đa 3 gợi ý
};