import { create } from 'zustand';
import { toast } from 'sonner';
import { matchService } from '../services/matchService';
import type { UserProfile, Match, Like, ExploreFilters } from '../types/match';

interface MatchState {
    // Data
    explorations: UserProfile[];
    matches: Match[];
    likes: Like[];
    myLikes: Like[]; // Users I liked
    currentCardIndex: number;

    // Loading states
    loadingExplorations: boolean;
    loadingMatches: boolean;
    loadingLikes: boolean;

    // Filters
    filters: ExploreFilters;

    // Actions
    setFilters: (filters: ExploreFilters) => void;
    fetchExplorations: () => Promise<void>;
    swipe: (targetUserId: string, action: 'like' | 'dislike') => Promise<{ isMatch: boolean; matchData?: any }>;
    fetchMatches: () => Promise<void>;
    fetchLikes: () => Promise<void>;
    fetchMyLikes: () => Promise<void>;
    unmatch: (matchId: string) => Promise<void>;
    nextCard: () => void;
    resetCardIndex: () => void;
}

export const useMatchStore = create<MatchState>((set, get) => ({
    // Initial state
    explorations: [],
    matches: [],
    likes: [],
    myLikes: [],
    currentCardIndex: 0,
    loadingExplorations: false,
    loadingMatches: false,
    loadingLikes: false,
    filters: {
        limit: 20,
    },

    // Set filters
    setFilters: (filters) => {
        set({ filters: { ...get().filters, ...filters } });
    },

    // Fetch explorations
    fetchExplorations: async () => {
        try {
            set({ loadingExplorations: true });
            const { filters } = get();
            console.log('🔄 Fetching with filters:', filters);

            const data = await matchService.getExplorations(filters);
            console.log('📦 Raw API response:', data);

            // Handle both response formats: { users: [...] } or direct array
            const users = Array.isArray(data) ? data : (data.users || []);
            console.log('✅ Processed users:', users);

            set({ explorations: users, currentCardIndex: 0 });
        } catch (error) {
            console.error('❌ Error fetching explorations:', error);
            toast.error('Không thể tải danh sách người dùng');
            set({ explorations: [] });
        } finally {
            set({ loadingExplorations: false });
        }
    },


    // Swipe action
    swipe: async (targetUserId: string, action: 'like' | 'dislike') => {
        try {
            const response = await matchService.swipe({ targetUserId, action });

            // Remove the user from the list
            set((state) => ({
                explorations: state.explorations.filter(u => u._id !== targetUserId)
            }));

            // If it's a match, show notification
            if (response.isMatch) {
                toast.success(`🎉 ${response.message}`);
                // Refresh matches list
                get().fetchMatches();
            }

            return { isMatch: response.isMatch, matchData: response.matchData };
        } catch (error) {
            console.error('Error swiping:', error);
            toast.error('Có lỗi xảy ra');
            return { isMatch: false };
        }
    },

    // Fetch matches
    fetchMatches: async () => {
        try {
            set({ loadingMatches: true });
            const data = await matchService.getMatches();
            set({ matches: data.matches });
        } catch (error) {
            console.error('Error fetching matches:', error);
            toast.error('Không thể tải danh sách match');
        } finally {
            set({ loadingMatches: false });
        }
    },

    // Fetch likes
    fetchLikes: async () => {
        try {
            set({ loadingLikes: true });
            const data = await matchService.getWhoLikesMe();
            set({ likes: data.likes });
        } catch (error) {
            console.error('Error fetching likes:', error);
            toast.error('Không thể tải danh sách người thích bạn');
        } finally {
            set({ loadingLikes: false });
        }
    },

    // Fetch my likes
    fetchMyLikes: async () => {
        try {
            set({ loadingLikes: true }); // Reuse loading state or add new one? Reuse seems fine for now or add loadingMyLikes. 
            // Better to strictly follow state interface, let's reuse loadingLikes for simplicity or just don't set separate loading for now as it wasn't defined in interface.
            // Actually I should verify if I added loadingMyLikes to interface. I didn't. I'll just use loadingLikes or nothing.
            // Let's add loadingMyLikes to be clean.
            // Wait, I didn't add loadingMyLikes to interface. 
            // I'll just use loadingLikes since they are on different tabs usually.
            const data = await matchService.getMyLikes();
            set({ myLikes: data.likes });
        } catch (error) {
            console.error('Error fetching my likes:', error);
            // toast.error('Không thể tải danh sách đã thích'); // Optional toast
        } finally {
            set({ loadingLikes: false });
        }
    },

    // Unmatch
    unmatch: async (matchId: string) => {
        try {
            await matchService.unmatch(matchId);
            // Remove from matches list or myLikes list
            set({
                matches: get().matches.filter(m => m.matchId !== matchId),
                myLikes: get().myLikes.filter(l => l.matchId !== matchId)
            });
            toast.success('Đã hủy kết nối');
        } catch (error) {
            console.error('Error unmatching:', error);
            toast.error('Không thể hủy kết nối');
        }
    },

    // Next card
    nextCard: () => {
        const { currentCardIndex, explorations } = get();
        if (currentCardIndex < explorations.length - 1) {
            set({ currentCardIndex: currentCardIndex + 1 });
        }
    },

    // Reset card index
    resetCardIndex: () => {
        set({ currentCardIndex: 0 });
    },
}));
