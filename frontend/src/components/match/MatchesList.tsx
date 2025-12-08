import './MatchesList.css';
import { useEffect } from 'react';
import { useMatchStore } from '../../stores/useMatchStore';
import { useNavigate } from 'react-router-dom';

export default function MatchesList() {
    const { matches, loadingMatches, fetchMatches, unmatch } = useMatchStore();
    const navigate = useNavigate();

    useEffect(() => {
        fetchMatches();
    }, []);

    const handleMessage = (userId: string) => {
        // Navigate to chat with this user
        navigate(`/chat?userId=${userId}`);
    };

    const handleUnmatch = async (matchId: string, displayName: string) => {
        if (window.confirm(`Bạn có chắc muốn hủy kết nối với ${displayName}?`)) {
            await unmatch(matchId);
        }
    };

    if (loadingMatches) {
        return (
            <div className="matches-list-loading">
                <div className="spinner"></div>
                <p>Đang tải danh sách match...</p>
            </div>
        );
    }

    if (matches.length === 0) {
        return (
            <div className="matches-list-empty">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
                <h3>Chưa có match nào</h3>
                <p>Hãy bắt đầu khám phá và kết nối với những người mới!</p>
            </div>
        );
    }

    return (
        <div className="matches-list">
            <div className="matches-grid">
                {matches.map((match) => (
                    <div key={match.matchId} className="match-card">
                        <div className="match-card-header">
                            <div className="match-avatar">
                                <img src={match.avatarUrl || '/z7162069739961_81cab8e64cc2813944f4900ca14b7c0b.jpg'} alt={match.displayName} />
                                {match.isOnline && <span className="online-indicator"></span>}
                            </div>
                        </div>

                        <div className="match-info">
                            <h3 className="match-name">{match.displayName}</h3>
                            {match.age && match.location && (
                                <p className="match-meta">{match.age} tuổi • {match.location}</p>
                            )}
                            {match.similarityScore > 0 && (
                                <div className="match-score">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                                    </svg>
                                    <span>{match.similarityScore}% phù hợp</span>
                                </div>
                            )}
                        </div>

                        <div className="match-actions">
                            <button
                                className="btn-message"
                                onClick={() => handleMessage(match._id)}
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                                </svg>
                                Nhắn tin
                            </button>
                            <button
                                className="btn-unmatch"
                                onClick={() => handleUnmatch(match.matchId, match.displayName)}
                                title="Hủy kết nối"
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
