
import './profile-form.css';
import '../../../assets/css/asset.css';
import '../../../assets/css/index.css';
import { Calendar, Users, Sparkles, Heart, Image as ImageIcon, Search, Plus, X } from "lucide-react";
import { useState, useEffect } from 'react';
import axiosInstance from '../../../lib/axios';
import AvatarUploader from "../../ui/avatar-uploader/avatar-uploader";
import { toast } from "sonner";

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
    const [uploadingImage, setUploadingImage] = useState(false);

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
            // Enter edit mode
        }
        setIsEditing(!isEditing);
    };

    const handleCancel = () => {
        setIsEditing(false);
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
                    : editData.hobbies,
                photos: editData.images.map(img => ({ url: img })),
                avatarUrl: editData.avatar // Added avatarUrl to payload
            };

            await axiosInstance.put('/users/profile', payload);
            setIsEditing(false);
            await fetchProfile(); // Refresh data
            toast.success("Cập nhật hồ sơ thành công!");
        } catch (err) {
            console.error('Update failed', err);
            toast.error('Cập nhật thất bại. Vui lòng kiểm tra lại thông tin.');
            setLoading(false);
        }
    };

    const handleChange = (field: keyof Profile, value: any) => {
        setEditData(prev => ({ ...prev, [field]: value }));
    };

    const handleAvatarChange = async (file: File | null) => {
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await axiosInstance.post('/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (res.data && res.data.url) {
                setEditData(prev => ({ ...prev, avatar: res.data.url }));
                toast.success('Ảnh đại diện đã được tải lên');
            }
        } catch (error) {
            console.error('Avatar upload failed:', error);
            toast.error('Lỗi khi tải ảnh đại diện');
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Basic validation
        if (!file.type.startsWith('image/')) {
            alert('Vui lòng chọn file ảnh!');
            return;
        }
        if (file.size > 5 * 1024 * 1024) { // 5MB
            alert('File quá lớn (tối đa 5MB)');
            return;
        }

        try {
            // Convert to Base64
            const reader = new FileReader();
            reader.onloadend = () => {
                // Upload to server directly instead of just base64 preview?
                // The original code used base64 for 'images'. Let's keep it consistent or upgrade?
                // For now, let's stick to original logic: base64 first, but backend expects URLs.
                // Wait, original logic sent { url: img }. If img is base64, backend might not handle it unless tailored.
                // The user only asked for AVATAR fix. I won't touch gallery upload logic unless asked.
                const base64String = reader.result as string;
                setEditData(prev => ({
                    ...prev,
                    images: [...prev.images, base64String]
                }));
                // Reset input
                e.target.value = '';
                setUploadingImage(false);
            };
            reader.readAsDataURL(file);

        } catch (error) {
            console.error('Error reading file:', error);
            alert('Lỗi đọc file ảnh');
            setUploadingImage(false);
        }
    };

    const handleRemoveImage = (indexToRemove: number) => {
        setEditData(prev => ({
            ...prev,
            images: prev.images.filter((_, idx) => idx !== indexToRemove)
        }));
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
                            {isEditing ? (
                                <AvatarUploader
                                    initialSrc={editData.avatar || '/img/default-avatar.jpg'}
                                    onChange={handleAvatarChange}
                                    size={120}
                                />
                            ) : (
                                <img
                                    src={profile.avatar || '/img/default-avatar.jpg'}
                                    alt="avatar"
                                    className="avatar-img"
                                    onError={(e: any) => { e.currentTarget.src = '/img/default-avatar.jpg'; }}
                                />
                            )}
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
                                <div>
                                    <div className="photo-grid">
                                        {editData.images.map((img, idx) => (
                                            <div key={idx} className="photo-item relative group">
                                                <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                                                <button
                                                    onClick={() => handleRemoveImage(idx)}
                                                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-90 hover:opacity-100 transition-opacity"
                                                    title="Xóa ảnh"
                                                    style={{ position: 'absolute', top: '5px', right: '5px', background: 'rgba(255,0,0,0.8)', color: 'white', borderRadius: '50%', border: 'none', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                                >
                                                    <X size={14} />
                                                </button>
                                            </div>
                                        ))}

                                        <label className="photo-item photo-add-btn cursor-pointer hover:bg-gray-100 transition-colors" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: '2px dashed #ccc', borderRadius: '8px', minHeight: '150px' }}>
                                            {uploadingImage ? (
                                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                                            ) : (
                                                <>
                                                    <Plus size={32} className="text-gray-400" />
                                                    <span className="text-sm text-gray-400 mt-2">Thêm ảnh</span>
                                                </>
                                            )}
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                style={{ display: 'none' }}
                                                onChange={handleImageUpload}
                                                disabled={uploadingImage}
                                            />
                                        </label>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-2 italic">* Tải lên ảnh từ thiết bị của bạn.</p>
                                </div>
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
                                <button onClick={handleCancel} className="btn-profile-action btn-secondary-gray box-sha-none">
                                    Hủy
                                </button>
                            </>
                        ) : (
                            <button onClick={handleEditToggle} className="btn-profile-action btn-primary-blue">
                                Chỉnh Sửa Hồ Sơ
                            </button>
                        )}
                    </div>

                </div>
            </div>
        </div>

    )
}