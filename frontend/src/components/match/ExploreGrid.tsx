import './ExploreGrid.css';
import { useEffect } from 'react';
import { useMatchStore } from '../../stores/useMatchStore';
import UserProfileCard from './UserProfileCard';
import type { ExploreFilters } from '../../types/match';

interface ExploreGridProps {
    filters?: ExploreFilters;
}

export default function ExploreGrid({ filters }: ExploreGridProps) {
    const {
        explorations,
        loadingExplorations,
        fetchExplorations,
        swipe,
        setFilters
    } = useMatchStore();

    useEffect(() => {
        if (filters) {
            setFilters(filters);
        }
        fetchExplorations();
    }, [filters]);

    const handleLike = async (userId: string) => {
        const result = await swipe(userId, 'like');
        if (result.isMatch) {
            // Match notification is handled in the store
        }
    };

    const handleDislike = async (userId: string) => {
        await swipe(userId, 'dislike');
    };

    if (loadingExplorations) {
        return (
            <div className="explore-grid-loading">
                <div className="spinner"></div>
                <p>Đang tìm kiếm người phù hợp...</p>
            </div>
        );
    }

    if (explorations.length === 0) {
        return (
            <div className="explore-grid-empty">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                <h3>Không còn người dùng mới</h3>
                <p>Hãy thử điều chỉnh bộ lọc hoặc quay lại sau!</p>
            </div>
        );
    }

    return (
        <div className="explore-grid">
            {explorations.map((user) => (
                <UserProfileCard
                    key={user._id}
                    user={user}
                    onLike={() => handleLike(user._id)}
                    onDislike={() => handleDislike(user._id)}
                />
            ))}
        </div>
    );
}
