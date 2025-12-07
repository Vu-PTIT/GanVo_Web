import { create } from "zustand";
import axiosInstance from "@/lib/axios";
import type { Conversation } from "@/types/chat";

interface ConversationStore {
    conversations: Conversation[];
    isLoading: boolean;

    fetchConversations: () => Promise<void>;
    getOrCreateDirectConversation: (friendId: string) => Promise<string | null>;
}

export const useConversationStore = create<ConversationStore>((set, get) => ({
    conversations: [],
    isLoading: false,

    fetchConversations: async () => {
        set({ isLoading: true });
        try {
            const res = await axiosInstance.get("/conversations");
            set({ conversations: res.data });
        } catch (error) {
            console.error("Error fetching conversations:", error);
        } finally {
            set({ isLoading: false });
        }
    },

    getOrCreateDirectConversation: async (friendId: string) => {
        try {
            const res = await axiosInstance.post("/conversations/direct", { friendId });
            const conversation = res.data;

            // Update list if new
            const exists = get().conversations.some(c => c._id === conversation._id);
            if (!exists) {
                set(state => ({ conversations: [conversation, ...state.conversations] }));
            }

            return conversation._id;
        } catch (error) {
            console.error("Error getting/creating conversation:", error);
            return null;
        }
    },
}));
