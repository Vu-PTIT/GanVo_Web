
import './profile-form.css';
import '../../../assets/css/asset.css';
import '../../../assets/css/index.css';
import { Calendar, Users, Sparkles, Heart, Image as ImageIcon, Search } from "lucide-react";
import { useState, useEffect } from 'react';
import axiosInstance from '../../../lib/axios';

type Profile = {
    avatar: string;
    name: string;
    location: string;
    birthDate: string;
    gender: string;
    about: string;
    hobbies: string | string[]; // Allow string for editing comma-separated
    images: string[];
    preference: string;
}

const emptyProfile: Profile = {
    avatar: '',
    name: '',
    location: '',
    birthDate: '',
    gender: '',
    about: '',
    hobbies: [],
    images: [],
    preference: ''
}

export function ProfileForm() {
    const [profile, setProfile] = useState<Profile>(emptyProfile);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState<Profile>(emptyProfile);

    // Fetch profile data on component mount
    const fetchProfile = async () => {

        try {
            const response = await axiosInstance.get('/users/me');
            console.log('[ProfileForm] /users/me status:', response?.status);
            console.log('[ProfileForm] /users/me data:', response?.data);

            const data = response?.data?.user ?? response?.data ?? null;

            if (!data) {
                console.warn('[ProfileForm] No profile data returned from API');
                setProfile(emptyProfile);
                console.warn('Không tìm thấy dữ liệu hồ sơ.');
                return;
            }

            // Ensure hobbies is an array for display
            const hobbies = Array.isArray(data.interests) ? data.interests : [];

            // Helper to format date for input (YYYY-MM-DD)
            const formatDateForInput = (isoDate: string) => {
                if (!isoDate) return '';
                const d = new Date(isoDate);
                return d.toISOString().split('T')[0];
            };

            const mapped = {
                avatar: data.avatarUrl || '',
                name: data.displayName || '',
                location: data.location || '',
                // Store mapped display string for view
                birthDate: data.dateOfBirth ? new Date(data.dateOfBirth).toLocaleDateString('vi-VN') : 'Chưa cập nhật',
                gender: data.gender || 'other',
                about: data.bio || '',
                hobbies: hobbies,
                images: Array.isArray(data.photos) ? data.photos.map((p: any) => p.url || p) : [],
                preference: data.lookingFor || ''
            } as Profile;

            setProfile(mapped);

            // Set edit data with raw values suitable for inputs
            setEditData({
                ...mapped,
                birthDate: data.dateOfBirth ? formatDateForInput(data.dateOfBirth) : '',
                hobbies: hobbies.join(', ') // Join for comma-separated edit
            });

        } catch (err: any) {
            console.error('[ProfileForm] fetchProfile error:', err);
            setProfile(emptyProfile);
            setProfile(emptyProfile);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const handleEditToggle = () => {
        if (!isEditing) {
            // Enter edit mode: Reset editData to current profile (but formatted for inputs)
            // Re-fetching or re-syncing might be safer but for now assume profile state is ok.
            // Actually, we set editData on fetch. If user edits then cancels, we might want to reset.
            // Let's just use the current profile state to re-populate editData just in case.
            // Note: profile.birthDate is strictly for display (DD/MM/YYYY), so we rely on what we had or clears it.
            // Ideally we should keep raw data. For now, let's keep it simple: 
            // If we entered edit mode, we use the editData we prepared during fetch, 
            // OR we might need to parse the display date back if we didn't store raw.
            // DECISION: Let's fetch pure data again or rely on editData being kept in sync?
            // Simplest: just toggle. If canceling, we revert changes.
        }
        setIsEditing(!isEditing);
    };

    const handleCancel = () => {
        setIsEditing(false);
        // ideally reset editData to original
        fetchProfile();
    };

    const handleSave = async () => {
        try {
            setLoading(true);
            const payload = {
                displayName: editData.name,
                location: editData.location,
                dateOfBirth: editData.birthDate, // YYYY-MM-DD is fine for backend usually
                gender: editData.gender,
                bio: editData.about,
                lookingFor: editData.preference,
                interests: typeof editData.hobbies === 'string'
                    ? editData.hobbies.split(',').map(s => s.trim()).filter(s => s)
                    : editData.hobbies
            };

            await axiosInstance.put('/users/profile', payload);
            setIsEditing(false);
            await fetchProfile(); // Refresh data
        } catch (err) {
            console.error('Update failed', err);
            alert('Cập nhật thất bại. Vui lòng kiểm tra lại thông tin.');
            setLoading(false);
        }
    };

    const handleChange = (field: keyof Profile, value: any) => {
        setEditData(prev => ({ ...prev, [field]: value }));
    };

    if (loading) {
        return (
            <div className="container container-1000">
                <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p>Đang tải thông tin...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container container-1000">
            <div className="profile-form">

                {/* Header Section */}
                <div className="profile-header-text">
                    <h1 className="profile-title">Hồ Sơ Của Bạn</h1>
                </div>

                <div className="cont-content-profile">

                    {/* Top Info: Avatar & Name */}
                    <div className="profile-main-info">
                        <div className="avatar-container">
                            <img
                                src={profile.avatar || '/img/default-avatar.jpg'}
                                alt="avatar"
                                className="avatar-img"
                                onError={(e: any) => { e.currentTarget.src = '/img/default-avatar.jpg'; }}
                            />
                        </div>
                        {isEditing ? (
                            <div style={{ width: '100%', maxWidth: '300px', display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
                                <input
                                    className="edit-input"
                                    value={editData.name}
                                    onChange={(e) => handleChange('name', e.target.value)}
                                    placeholder="Tên hiển thị"
                                />
                                <input
                                    className="edit-input"
                                    value={editData.location}
                                    onChange={(e) => handleChange('location', e.target.value)}
                                    placeholder="Vị trí (VD: Hà Nội)"
                                    style={{ fontSize: '14px', textAlign: 'center' }}
                                />
                            </div>
                        ) : (
                            <>
                                <h2 className="profile-name-age">{profile.name || 'Người dùng'}</h2>
                                <p className="profile-location">{profile.location || 'Chưa cập nhật'}</p>
                            </>
                        )}
                    </div>

                    <div className="content-profile">
                        {/* Birthday Section */}
                        <div className="profile-section">
                            <div className="section-header">
                                <Calendar className="section-icon" strokeWidth={2.5} />
                                <span className="section-title">Ngày sinh</span>
                            </div>
                            <div className="section-content text-sm">
                                {isEditing ? (
                                    <input
                                        type="date"
                                        className="edit-input"
                                        value={editData.birthDate}
                                        onChange={(e) => handleChange('birthDate', e.target.value)}
                                    />
                                ) : profile.birthDate}
                            </div>
                        </div>

                        {/* Gender Section */}
                        <div className="profile-section">
                            <div className="section-header">
                                <Users className="section-icon" strokeWidth={2.5} />
                                <span className="section-title">Giới tính</span>
                            </div>
                            <div className="section-content text-sm">
                                {isEditing ? (
                                    <select
                                        className="edit-input"
                                        value={editData.gender}
                                        onChange={(e) => handleChange('gender', e.target.value)}
                                    >
                                        <option value="male">Nam</option>
                                        <option value="female">Nữ</option>
                                        <option value="other">Khác</option>
                                    </select>
                                ) : (profile.gender === 'male' ? 'Nam' : profile.gender === 'female' ? 'Nữ' : 'Khác')}
                            </div>
                        </div>

                        {/* About Section */}
                        <div className="profile-section">
                            <div className="section-header">
                                <Sparkles className="section-icon" strokeWidth={2.5} />
                                <span className="section-title">Về tôi</span>
                            </div>
                            <div className="section-content">
                                {isEditing ? (
                                    <textarea
                                        className="edit-textarea"
                                        value={editData.about}
                                        onChange={(e) => handleChange('about', e.target.value)}
                                        placeholder="Giới thiệu bản thân..."
                                        maxLength={500}
                                    />
                                ) : (profile.about || 'Chưa có giới thiệu bản thân...')}
                            </div>
                        </div>

                        {/* Hobbies Section */}
                        <div className="profile-section">
                            <div className="section-header">
                                <Heart className="section-icon" strokeWidth={2.5} />
                                <span className="section-title">Sở thích</span>
                            </div>
                            <div className="hobbies-list">
                                {isEditing ? (
                                    <input
                                        className="edit-input"
                                        value={editData.hobbies as string}
                                        onChange={(e) => handleChange('hobbies', e.target.value)}
                                        placeholder="Nhập sở thích, cách nhau bởi dấu phẩy (VD: Đọc sách, Du lịch)"
                                    />
                                ) : (
                                    (Array.isArray(profile.hobbies) && profile.hobbies.length > 0) ? (
                                        profile.hobbies.map((hobby, index) => (
                                            <span key={index} className="hobby-tag">
                                                {hobby}
                                            </span>
                                        ))
                                    ) : (
                                        <span className="section-content">Chưa thêm sở thích</span>
                                    )
                                )}
                            </div>
                        </div>

                        {/* Photos Section */}
                        <div className="profile-section">
                            <div className="section-header">
                                <ImageIcon className="section-icon" strokeWidth={2.5} />
                                <span className="section-title">Thư viện ảnh</span>
                            </div>
                            {isEditing ? (
                                <p className="text-sm text-gray-500 italic">Tính năng quản lý ảnh đang được cập nhật.</p>
                            ) : (
                                <div className="photo-grid">
                                    {profile.images.map((img, idx) => (
                                        <img key={idx} src={img} alt={`Gallery ${idx}`} className="photo-item" />
                                    ))}
                                    {Array.from({ length: Math.max(0, 4 - profile.images.length) }).map((_, i) => (
                                        <div key={i} className="photo-item photo-item-placeholder">
                                            Ảnh trống
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Looking For Section */}
                        <div className="profile-section">
                            <div className="section-header">
                                <Search className="section-icon" strokeWidth={2.5} />
                                <span className="section-title">Ưu tiên tìm kiếm</span>
                            </div>
                            <div className="preference-text">
                                {isEditing ? (
                                    <input
                                        className="edit-input"
                                        value={editData.preference}
                                        onChange={(e) => handleChange('preference', e.target.value)}
                                        placeholder="Bạn đang tìm kiếm điều gì?"
                                    />
                                ) : (profile.preference || 'Chưa thiết lập')}
                            </div>
                        </div>

                    </div>

                    {/* Footer Buttons */}
                    <div className="profile-footer">
                        {isEditing ? (
                            <>
                                <button onClick={handleSave} className="btn-profile-action btn-primary-blue">
                                    Lưu Thay Đổi
                                </button>
                                <button onClick={handleCancel} className="btn-profile-action btn-secondary-gray">
                                    Hủy
                                </button>
                            </>
                        ) : (
                            <button onClick={handleEditToggle} className="btn-profile-action btn-primary-blue">
                                Chỉnh Sửa Hồ Sơ
                            </button>
                        )}
                        {/* Removed: Xem Kết Nối, Bắt Đầu Trò Chuyện */}
                    </div>

                </div>
            </div>
        </div>

    )
}