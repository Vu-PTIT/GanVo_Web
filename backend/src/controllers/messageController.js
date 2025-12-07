import Message from "../models/Message.js";
import Conversation from "../models/Conversation.js";

export const sendMessage = async (req, res) => {
  try {
    const { conversationId, content, imgUrl } = req.body;
    const senderId = req.user._id;

    if (!content && !imgUrl) {
      return res.status(400).json({ message: "Message content or image is required" });
    }

    const newMessage = await Message.create({
      conversationId,
      senderId,
      content,
      imgUrl,
    });

    // Update conversation last message
    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessageAt: new Date(),
      lastMessage: {
        _id: newMessage._id.toString(),
        content: content || "Sent an image",
        senderId,
        createdAt: newMessage.createdAt,
      },
      // Increment unread counts for other participants (logic to be refined)
    });

    // Populate sender info for realtime update
    const populatedMessage = await newMessage.populate("senderId", "username displayName avatarUrl");

    // Emit to room
    req.io.to(conversationId).emit("receive_message", populatedMessage);

    res.status(201).json(populatedMessage);
  } catch (error) {
    console.error("Error in sendMessage:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { limit = 50, before } = req.query;

    const query = { conversationId };
    if (before) {
      query.createdAt = { $lt: new Date(before) };
    }

    const messages = await Message.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .populate("senderId", "username displayName avatarUrl");

    res.status(200).json(messages.reverse());
  } catch (error) {
    console.error("Error in getMessages:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
