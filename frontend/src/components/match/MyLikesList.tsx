import './LikesList.css';
import { useEffect } from 'react';
import { useMatchStore } from '../../stores/useMatchStore';

export default function MyLikesList() {
    const { myLikes, loadingLikes, fetchMyLikes, unmatch } = useMatchStore();

    useEffect(() => {
        fetchMyLikes();
    }, []);

    const handleUnlike = async (matchId: string) => {
        if (window.confirm('Bạn có chắc muốn hủy lời mời kết bạn này?')) {
            await unmatch(matchId);
            // Optionally fetchMyLikes() again if store doesn't update optimistic
            fetchMyLikes();
        }
    };

    if (loadingLikes) {
        return (
            <div className="likes-list-loading">
                <div className="spinner"></div>
                <p>Đang tải danh sách...</p>
            </div>
        );
    }

    if (myLikes.length === 0) {
        return (
            <div className="likes-list-empty">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
                <h3>Bạn chưa thích ai</h3>
                <p>Hãy vào phần Khám phá để tìm người phù hợp nhé!</p>
            </div>
        );
    }

    return (
        <div className="likes-list">
            <div className="likes-grid">
                {myLikes.map((user) => (
                    <div key={user._id} className="like-card">
                        <div className="like-avatar">
                            <img src={user.avatarUrl || '/z7162069739961_81cab8e64cc2813944f4900ca14b7c0b.jpg'} alt={user.displayName} />
                        </div>

                        <div className="like-info">
                            <h3 className="like-name">{user.displayName}</h3>
                            {user.age && user.location && (
                                <p className="like-meta">{user.age} tuổi • {user.location}</p>
                            )}
                            {user.bio && (
                                <p className="like-bio">{user.bio}</p>
                            )}
                            {user.interests && user.interests.length > 0 && (
                                <div className="like-interests">
                                    {user.interests.slice(0, 3).map((interest, idx) => (
                                        <span key={idx} className="interest-tag">{interest}</span>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="like-actions">
                            <button
                                className="action-btn dislike-btn"
                                onClick={() => user.matchId && handleUnlike(user.matchId)}
                                title="Hủy lời mời"
                                style={{ width: '100%', marginTop: '10px', borderRadius: '8px' }}
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                                Hủy lời mời
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
