import './LikesList.css';
import { useEffect } from 'react';
import { useMatchStore } from '../../../stores/useMatchStore';

export default function LikesList() {
    const { likes, loadingLikes, fetchLikes, swipe } = useMatchStore();

    useEffect(() => {
        fetchLikes();
    }, []);

    const handleLikeBack = async (userId: string) => {
        const result = await swipe(userId, 'like');
        if (result.isMatch) {
            // Remove from likes list and refresh
            fetchLikes();
        }
    };

    const handlePass = async (userId: string) => {
        await swipe(userId, 'dislike');
        // Refresh likes list
        fetchLikes();
    };

    if (loadingLikes) {
        return (
            <div className="likes-list-loading">
                <div className="spinner"></div>
                <p>Đang tải danh sách...</p>
            </div>
        );
    }

    if (likes.length === 0) {
        return (
            <div className="likes-list-empty">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
                <h3>Chưa có ai thích bạn</h3>
                <p>Đừng lo! Hãy tiếp tục khám phá và kết nối.</p>
            </div>
        );
    }

    return (
        <div className="likes-list">
            <div className="likes-grid">
                {likes.map((like) => (
                    <div key={like._id} className="like-card">
                        <div className="like-avatar">
                            <img src={like.avatarUrl || '/z7162069739961_81cab8e64cc2813944f4900ca14b7c0b.jpg'} alt={like.displayName} />
                        </div>

                        <div className="like-info">
                            <h3 className="like-name">{like.displayName}</h3>
                            {like.age && like.location && (
                                <p className="like-meta">{like.age} tuổi • {like.location}</p>
                            )}
                            {like.bio && (
                                <p className="like-bio">{like.bio}</p>
                            )}
                            {like.interests && like.interests.length > 0 && (
                                <div className="like-interests">
                                    {like.interests.slice(0, 3).map((interest, idx) => (
                                        <span key={idx} className="interest-tag">{interest}</span>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="like-actions">
                            <button
                                className="btn-pass"
                                onClick={() => handlePass(like._id)}
                                title="Bỏ qua"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                            </button>
                            <button
                                className="btn-like-back"
                                onClick={() => handleLikeBack(like._id)}
                                title="Thích lại"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                                </svg>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
