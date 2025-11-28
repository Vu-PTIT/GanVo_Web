// utils/gemini.js
import { GoogleGenerativeAI } from "@google/generative-ai";

// Thay API KEY của bạn vào đây hoặc dùng biến môi trường process.env.GEMINI_API_KEY
const genAI = new GoogleGenerativeAI("AIzaSyBE3Urq4Nyzk8ETgK5Icy7d6kRn7B6fVFo");

// Sử dụng model chuyên dùng để nhúng văn bản (Embedding)
const model = genAI.getGenerativeModel({ model: "text-embedding-004" });

export const getEmbedding = async (text) => {
  try {
    // Nếu text ngắn quá thì không cần chạy
    if (!text || text.length < 5) return [];

    // Gọi API của Google
    const result = await model.embedContent(text);
    const embedding = result.embedding;
    return embedding.values; // Trả về mảng số: [0.123, -0.456, ...]
  } catch (error) {
    console.error("Gemini API Error:", error);
    return [];
  }
};

export const calculateSimilarity = (vecA, vecB) => {
  if (!vecA || !vecB || vecA.length === 0 || vecB.length === 0) return 0;

  const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
  return dotProduct;
};