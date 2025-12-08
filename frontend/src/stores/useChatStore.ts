import { create } from "zustand";
import { io, Socket } from "socket.io-client";
import { useAuthStore } from "./useAuthStore";
import type { Message } from "@/types/chat";
import axiosInstance from "@/lib/axios";

const BASE_URL = "http://localhost:5001";

interface ChatStore {
    socket: Socket | null;
    messages: Message[];
    selectedConversationId: string | null;
    isMessagesLoading: boolean;

    connectSocket: () => void;
    disconnectSocket: () => void;
    joinConversation: (conversationId: string) => void;
    sendMessage: (conversationId: string, content: string, imgUrl?: string) => Promise<void>;
    fetchMessages: (conversationId: string) => Promise<void>;
    setSelectedConversationId: (id: string | null) => void;
    addMessage: (message: Message) => void;
}

export const useChatStore = create<ChatStore>((set, get) => ({
    socket: null,
    messages: [],
    selectedConversationId: null,
    isMessagesLoading: false,

    connectSocket: () => {
        const { user } = useAuthStore.getState();
        if (!user || get().socket?.connected) return;

        const socket = io(BASE_URL, {
            auth: (cb) => {
                const token = useAuthStore.getState().accessToken;
                cb({ token });
            },
            withCredentials: true,
        });

        socket.connect();

        socket.on("connect", () => {
            console.log("Connected to socket server");
        });

        socket.on("receive_message", (message: Message) => {
            const { selectedConversationId } = get();
            if (selectedConversationId === message.conversationId) {
                set((state) => ({ messages: [...state.messages, message] }));
            }
        });

        set({ socket });
    },

    disconnectSocket: () => {
        if (get().socket?.connected) {
            get().socket?.disconnect();
        }
        set({ socket: null });
    },

    joinConversation: (conversationId: string) => {
        const socket = get().socket;
        if (socket) {
            socket.emit("join_conversation", conversationId);
        }
    },

    sendMessage: async (conversationId: string, content: string, imgUrl?: string) => {
        try {
            if (!content && !imgUrl) return;

            await axiosInstance.post(
                "/messages",
                { conversationId, content, imgUrl }
            );
        } catch (error) {
            console.error("Error sending message:", error);
            throw error;
        }
    },

    fetchMessages: async (conversationId: string) => {
        set({ isMessagesLoading: true });
        try {
            const res = await axiosInstance.get(`/messages/${conversationId}`);
            set({ messages: res.data });
        } catch (error) {
            console.error("Error fetching messages:", error);
        } finally {
            set({ isMessagesLoading: false });
        }
    },

    setSelectedConversationId: (id: string | null) => {
        set({ selectedConversationId: id, messages: [] });
    },

    addMessage: (message: Message) => {
        set((state) => ({ messages: [...state.messages, message] }));
    },
}));

// Subscribe to auth changes to handle socket disconnection/reconnection
useAuthStore.subscribe((state, prevState) => {
    if (!state.accessToken && prevState.accessToken) {
        useChatStore.getState().disconnectSocket();
    }
});
