import Conversation from "../models/Conversation.js";
import User from "../models/User.js";

export const getOrCreateDirectConversation = async (req, res) => {
  try {
    const { friendId } = req.body;
    const userId = req.user._id;

    if (!friendId) {
      return res.status(400).json({ message: "Friend ID is required" });
    }

    // Check if conversation already exists between these 2 users
    let conversation = await Conversation.findOne({
      type: "direct",
      $and: [
        { "participants.userId": userId },
        { "participants.userId": friendId }
      ],
      // Ensure exactly 2 participants (no group chats)
      "participants": { $size: 2 }
    });

    if (!conversation) {
      conversation = await Conversation.create({
        type: "direct",
        participants: [
          { userId: userId },
          { userId: friendId },
        ],
        lastMessageAt: new Date(),
      });
    }

    // Populate participants info
    const populatedConversation = await Conversation.findById(conversation._id)
      .populate("participants.userId", "username displayName avatarUrl");

    res.status(200).json(populatedConversation);
  } catch (error) {
    console.error("Error in getOrCreateDirectConversation:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update getConversations to exclude deleted ones
export const getConversations = async (req, res) => {
  try {
    const userId = req.user._id;

    const conversations = await Conversation.find({
      "participants.userId": userId,
      deletedBy: { $ne: userId } // Exclude if user is in deletedBy list
    })
      .sort({ lastMessageAt: -1 })
      .populate("participants.userId", "username displayName avatarUrl")
      .populate("lastMessage.senderId", "username displayName");

    res.status(200).json(conversations);
  } catch (error) {
    console.error("Error in getConversations:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getConversationById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const conversation = await Conversation.findOne({
      _id: id,
      "participants.userId": userId,
      deletedBy: { $ne: userId } // Ensure not deleted
    }).populate("participants.userId", "username displayName avatarUrl");

    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    res.status(200).json(conversation);
  } catch (error) {
    console.error("Error in getConversationById:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export const deleteConversation = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    await Conversation.findByIdAndUpdate(id, {
      $addToSet: { deletedBy: userId }
    });

    res.status(200).json({ message: "Conversation deleted for you" });
  } catch (error) {
    console.error("Error in deleteConversation:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
