
import mongoose from "mongoose";
import Conversation from "../models/Conversation.js";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI = "mongodb+srv://vult:f49rX3PkWcXkCkV7@cluster0.x3dq9nh.mongodb.net/?appName=Cluster0";

const cleanupDuplicates = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("Connected to DB");

        const conversations = await Conversation.find({ type: "direct" });
        console.log(`Found ${conversations.length} direct conversations`);

        const uniquePairs = new Map();
        let deletedCount = 0;

        for (const conv of conversations) {
            // Sort participant IDs to ensure [A, B] is same as [B, A]
            const participants = conv.participants.map(p => p.userId.toString()).sort();
            const key = participants.join("-");

            if (uniquePairs.has(key)) {
                // Duplicate found!
                console.log(`Duplicate found for pair ${key}, deleting conversation ${conv._id}`);
                await Conversation.findByIdAndDelete(conv._id);
                deletedCount++;
            } else {
                uniquePairs.set(key, conv._id);
            }
        }

        console.log(`Cleanup complete. Deleted ${deletedCount} duplicate conversations.`);
        process.exit(0);
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
};

cleanupDuplicates();
