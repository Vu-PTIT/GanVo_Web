import { create } from "zustand";
import axiosInstance from "@/lib/axios";
import { toast } from "sonner";
import { useChatStore } from "./useChatStore";

export interface Friend {
    _id: string;
    username: string;
    displayName: string;
    avatarUrl?: string;
}

export interface FriendRequest {
    _id: string;
    from: Friend;
    to: Friend;
    status: string;
    createdAt: string;
}

interface FriendStore {
    friends: Friend[];
    friendRequests: FriendRequest[];
    isLoading: boolean;

    fetchFriends: () => Promise<void>;
    fetchFriendRequests: () => Promise<void>;
    sendFriendRequest: (userId: string) => Promise<void>;
    acceptFriendRequest: (requestId: string) => Promise<void>;
    declineFriendRequest: (requestId: string) => Promise<void>;
    subscribeToFriendUpdates: () => void;
    unsubscribeFromFriendUpdates: () => void;
}

export const useFriendStore = create<FriendStore>((set, get) => ({
    friends: [],
    friendRequests: [],
    isLoading: false,

    fetchFriends: async () => {
        set({ isLoading: true });
        try {
            const res = await axiosInstance.get("/friends");
            set({ friends: res.data.friends });
        } catch (error) {
            console.error("Error fetching friends:", error);
        } finally {
            set({ isLoading: false });
        }
    },

    fetchFriendRequests: async () => {
        set({ isLoading: true });
        try {
            const res = await axiosInstance.get("/friends/requests");
            set({ friendRequests: res.data.received });
        } catch (error) {
            console.error("Error fetching friend requests:", error);
        } finally {
            set({ isLoading: false });
        }
    },

    sendFriendRequest: async (userId: string) => {
        try {
            await axiosInstance.post("/friends/requests", { to: userId });
            toast.success("Friend request sent!");
        } catch (error: any) {
            console.error("Error sending friend request:", error);
            toast.error(error.response?.data?.message || "Failed to send friend request");
        }
    },

    acceptFriendRequest: async (requestId: string) => {
        try {
            await axiosInstance.post(`/friends/requests/${requestId}/accept`);
            toast.success("Friend request accepted!");
            get().fetchFriendRequests();
            get().fetchFriends();
        } catch (error) {
            console.error("Error accepting friend request:", error);
            toast.error("Failed to accept friend request");
        }
    },

    declineFriendRequest: async (requestId: string) => {
        try {
            await axiosInstance.post(`/friends/requests/${requestId}/decline`);
            toast.success("Friend request declined");
            get().fetchFriendRequests();
        } catch (error) {
            console.error("Error declining friend request:", error);
            toast.error("Failed to decline friend request");
        }
    },

    subscribeToFriendUpdates: () => {
        const socket = useChatStore.getState().socket;
        if (!socket) return;

        socket.on("new_friend_request", (request: FriendRequest) => {
            toast.info(`New friend request from ${request.from.username}`);
            set((state) => ({ friendRequests: [...state.friendRequests, request] }));
        });

        socket.on("friend_request_accepted", (data: any) => {
            // data can be the user object or { friend: ... } depending on backend
            const friend = data.friend || data;
            toast.success(`${friend.username} accepted your friend request`);
            set((state) => ({ friends: [...state.friends, friend] }));
        });
    },

    unsubscribeFromFriendUpdates: () => {
        const socket = useChatStore.getState().socket;
        if (!socket) return;

        socket.off("new_friend_request");
        socket.off("friend_request_accepted");
    },
}));
