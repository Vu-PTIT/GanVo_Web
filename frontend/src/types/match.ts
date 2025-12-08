// Match-related types
export interface UserProfile {
    _id: string;
    displayName: string;
    avatarUrl: string;
    bio?: string;
    gender?: string;
    age?: number;
    location?: string;
    interests?: string[];
    photos?: string[];
    matchScore?: number;
}

export interface Match {
    _id: string;
    displayName: string;
    avatarUrl: string;
    location?: string;
    age?: number;
    bio?: string;
    isOnline?: boolean;
    matchId: string;
    similarityScore: number;
    matchedAt: Date;
}

export interface Like {
    _id: string;
    displayName: string;
    avatarUrl: string;
    location?: string;
    age?: number;
    bio?: string;
    interests?: string[];
    likedAt: Date;
    matchId?: string;
}

export interface SwipeAction {
    targetUserId: string;
    action: 'like' | 'dislike';
}

export interface SwipeResponse {
    message: string;
    isMatch: boolean;
    matchData?: {
        userId: string;
        displayName: string;
        similarityScore: number;
    };
}

export interface ExploreFilters {
    minAge?: number;
    maxAge?: number;
    gender?: string;
    location?: string;
    limit?: number;
}
