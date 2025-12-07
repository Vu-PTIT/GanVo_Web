import axiosInstance from '../lib/axios';
import type { UserProfile, Match, Like, SwipeAction, SwipeResponse, ExploreFilters } from '../types/match';

export const matchService = {
    // Lấy danh sách người dùng để khám phá
    async getExplorations(filters?: ExploreFilters): Promise<{ users: UserProfile[]; total: number }> {
        const params = new URLSearchParams();
        if (filters?.minAge) params.append('minAge', filters.minAge.toString());
        if (filters?.maxAge) params.append('maxAge', filters.maxAge.toString());
        if (filters?.gender) params.append('gender', filters.gender);
        if (filters?.location) params.append('location', filters.location);
        if (filters?.limit) params.append('limit', filters.limit.toString());

        const response = await axiosInstance.get(`/match/explore?${params.toString()}`);
        return response.data;
    },

    // Swipe (like/dislike)
    async swipe(data: SwipeAction): Promise<SwipeResponse> {
        const response = await axiosInstance.post('/match/swipe', data);
        return response.data;
    },

    // Lấy danh sách đã match
    async getMatches(): Promise<{ matches: Match[]; total: number }> {
        const response = await axiosInstance.get('/match/list');
        return response.data;
    },

    // Lấy danh sách người đã like mình
    async getWhoLikesMe(): Promise<{ likes: Like[]; total: number }> {
        const response = await axiosInstance.get('/match/likes');
        return response.data;
    },

    // Unmatch
    async unmatch(matchId: string): Promise<{ message: string }> {
        const response = await axiosInstance.delete(`/match/${matchId}`);
        return response.data;
    },
};
