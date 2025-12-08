import './UserProfileCard.css';
import type { UserProfile } from '../../types/match';

interface UserProfileCardProps {
    user: UserProfile;
    onLike: () => void;
    onDislike: () => void;
    onMessage?: () => void;
}

export default function UserProfileCard({ user, onLike, onDislike, onMessage }: UserProfileCardProps) {
    const avatarSrc = user.avatarUrl || '/z7162069739961_81cab8e64cc2813944f4900ca14b7c0b.jpg';

    console.log('🎴 Rendering UserProfileCard for:', user.displayName, user);


    return (
        <div className="user-profile-card">
            <div className="profile-card-inner">
                {/* Avatar */}
                <div className="profile-avatar">
                    <img src={avatarSrc} alt={user.displayName} />
                </div>

                {/* Info */}
                <div className="profile-info">
                    <h3 className="profile-name">
                        {user.displayName} - {user.age || 0} - {user.gender === 'male' ? 'Nam' : 'Nữ'}
                    </h3>
                    {user.location && (
                        <p className="profile-location">{user.location}</p>
                    )}
                    {user.bio && (
                        <p className="profile-bio">{user.bio}</p>
                    )}
                    {user.interests && user.interests.length > 0 && (
                        <div className="profile-interests">
                            {user.interests.slice(0, 3).map((interest, idx) => (
                                <span key={idx} className="interest-tag">{interest}</span>
                            ))}
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="profile-actions">
                    <button
                        className="action-btn dislike-btn"
                        onClick={onDislike}
                        aria-label="Dislike"
                        title="Bỏ qua"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>

                    {onMessage && (
                        <button
                            className="action-btn message-btn"
                            onClick={onMessage}
                            aria-label="Message"
                            title="Nhắn tin"
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                            </svg>
                        </button>
                    )}

                    <button
                        className="action-btn like-btn"
                        onClick={onLike}
                        aria-label="Like"
                        title="Thích"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}
