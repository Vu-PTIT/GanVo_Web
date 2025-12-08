import './connect-form.css';
import '../../../assets/css/asset.css';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ExploreGrid from '../../match/ExploreGrid';
import MatchesList from '../../match/MatchesList';
import LikesList from '../../match/LikesList';
import MyLikesList from '../../match/MyLikesList';

type TabType = 'explore' | 'matches' | 'likes' | 'my-likes';

export function ConnectForm() {
    const location = useLocation();
    const [activeTab, setActiveTab] = useState<TabType>('explore');

    useEffect(() => {
        if (location.state?.tab) {
            setActiveTab(location.state.tab);
            // Clear state to avoid persistent tab on refresh (optional, but good UX)
            // window.history.replaceState({}, document.title); 
        }
    }, [location.state]);

    const [filters, setFilters] = useState<{
        minAge?: number;
        maxAge?: number;
        gender: string;
        location: string;
        name: string;
    }>({
        minAge: undefined,
        maxAge: undefined,
        gender: 'all',
        location: '',
        name: '',
    });

    return (
        <div className="connect-scroll-container">
            <div className="connect-form">
                {/* Header with title */}
                <div className="connect-header">
                    <h2>Khám Phá Hồ Sơ Mới</h2>
                </div>

                {/* Tabs Navigation */}
                <div className="connect-tabs">
                    <button
                        className={`tab-btn ${activeTab === 'explore' ? 'active' : ''}`}
                        onClick={() => setActiveTab('explore')}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="11" cy="11" r="8"></circle>
                            <path d="m21 21-4.35-4.35"></path>
                        </svg>
                        Khám Phá
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'matches' ? 'active' : ''}`}
                        onClick={() => setActiveTab('matches')}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                        </svg>
                        Đã Match
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'likes' ? 'active' : ''}`}
                        onClick={() => setActiveTab('likes')}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                            <circle cx="9" cy="7" r="4"></circle>
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                        </svg>
                        Đã Like Tôi
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'my-likes' ? 'active' : ''}`}
                        onClick={() => setActiveTab('my-likes')}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
                        </svg>
                        Tôi Đã Like
                    </button>
                </div>

                {/* Filters - only show on explore tab */}
                {activeTab === 'explore' && (
                    <div className="connect-filters">
                        <select
                            value={filters.gender}
                            onChange={(e) => setFilters({ ...filters, gender: e.target.value })}
                            className="filter-select"
                        >
                            <option value="all">Tất cả giới tính</option>
                            <option value="male">Nam</option>
                            <option value="female">Nữ</option>
                        </select>

                        <input
                            type="text"
                            placeholder="Tìm theo tên"
                            value={filters.name}
                            onChange={(e) => setFilters({ ...filters, name: e.target.value })}
                            className="filter-input"
                        />
                        <input
                            type="number"
                            placeholder="Tuổi từ"
                            value={filters.minAge || ''}
                            onChange={(e) => setFilters({ ...filters, minAge: e.target.value ? parseInt(e.target.value) : undefined })}
                            className="filter-input"
                            min="18"
                            max="100"
                        />

                        <input
                            type="number"
                            placeholder="Tuổi đến"
                            value={filters.maxAge || ''}
                            onChange={(e) => setFilters({ ...filters, maxAge: e.target.value ? parseInt(e.target.value) : undefined })}
                            className="filter-input"
                            min="18"
                            max="100"
                        />

                        <input
                            type="text"
                            placeholder="Khu vực"
                            value={filters.location}
                            onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                            className="filter-input"
                        />

                    </div>
                )}

                {/* Tab Content */}
                <div className="tab-content">
                    {activeTab === 'explore' && (
                        <ExploreGrid
                            filters={{
                                minAge: filters.minAge,
                                maxAge: filters.maxAge,
                                gender: filters.gender === 'all' ? undefined : filters.gender,
                                location: filters.location || undefined,
                                name: filters.name || undefined,
                            }}
                        />
                    )}
                    {activeTab === 'matches' && <MatchesList />}
                    {activeTab === 'likes' && <LikesList />}
                    {activeTab === 'my-likes' && <MyLikesList />}
                </div>
            </div>
        </div>
    );
}
