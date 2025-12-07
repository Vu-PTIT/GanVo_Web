import './profile-form.css';
import '../../../assets/css/asset.css';
import '../../../assets/css/index.css';
import { Calendar, Users, Sparkles, Edit } from "lucide-react";
import { useState, useEffect } from 'react';
import axiosInstance from '../../../lib/axios';

type Profile = {
    avatar: string;
    name: string;
    location: string;
    birthDate: string;
    gender: string;
    about: string;
    hobbies: string[];
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
    const [error, setError] = useState<string | null>(null);
    const [editingSection, setEditingSection] = useState<string | null>(null);
    const [draft, setDraft] = useState<Profile>(emptyProfile);
    const [hobbyInputs, setHobbyInputs] = useState<string[]>([]);

    // Fetch profile data on component mount
    useEffect(() => {
        const fetchProfile = async () => {
            setError(null);
            try {
                const response = await axiosInstance.get('/users/profile');
                console.log('[ProfileForm] /users/profile status:', response?.status);
                console.log('[ProfileForm] /users/profile data:', response?.data);

                const data = response?.data?.data ?? response?.data ?? null;

                if (!data || (typeof data === 'object' && Object.keys(data).length === 0)) {
                    console.warn('[ProfileForm] No profile data returned from API');
                    setProfile(emptyProfile);
                    setDraft(emptyProfile);
                    setError('Không tìm thấy dữ liệu hồ sơ.');
                    return;
                }

                const mapped = {
                    avatar: data.avatar || '',
                    name: data.displayName || data.name || 'Người dùng',
                    location: data.location || '',
                    birthDate: data.birthDate ? new Date(data.birthDate).toISOString().split('T')[0] : '',
                    gender: data.gender || '',
                    about: data.bio || data.about || '',
                    hobbies: Array.isArray(data.hobbies) ? data.hobbies : [],
                    images: Array.isArray(data.images) ? data.images : [],
                    preference: data.preference || ''
                } as Profile;

                setProfile(mapped);
                setDraft(mapped);
            } catch (err: any) {
                console.error('[ProfileForm] fetchProfile error:', err, err?.response?.data ?? err?.message);
                setProfile(emptyProfile);
                setDraft(emptyProfile);
                if (err?.response?.status === 401) {
                    setError('Bạn cần đăng nhập để xem hồ sơ.');
                } else {
                    setError('Không thể tải hồ sơ. Vui lòng thử lại.');
                }
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    if (loading) {
        return (
            <div className="container container-1000">
                <div className="profile-form">
                    <div className="cont-content-profile">
                        <div style={{ textAlign: 'center', padding: '40px' }}>
                            <p>Đang tải thông tin...</p>
                            {error && <p style={{ color: 'var(--destructive, #e53935)' }}>{error}</p>}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Start editing a specific section, or omit to edit all ('all')
    const startEdit = (section?: string) => {
        setDraft(profile);
        if (section === 'hobbies') setHobbyInputs([]);
        setEditingSection(section ?? 'all');
    };

    const addHobbyInput = () => setHobbyInputs((prev) => [...prev, '']);
    const updateHobbyInput = (idx: number, value: string) => setHobbyInputs((prev) => prev.map((v, i) => (i === idx ? value : v)));
    const removeHobbyInput = (idx: number) => setHobbyInputs((prev) => prev.filter((_, i) => i !== idx));
    const confirmHobbies = () => {
        const toAdd = hobbyInputs.map((h) => h.trim()).filter((h) => h.length > 0);
        if (toAdd.length > 0) {
            setProfile((prev) => ({ ...prev, hobbies: [...prev.hobbies, ...toAdd] }));
            setDraft((prev) => ({ ...prev, hobbies: [...prev.hobbies, ...toAdd] }));
        }
        setHobbyInputs([]);
        setEditingSection(null);
    };

    const cancelEdit = () => {
        setDraft(profile);
        setEditingSection(null);
    };

    const saveEdit = () => {
        setProfile(draft);
        setEditingSection(null);
    };

    const updateDraft = (patch: Partial<Profile>) => setDraft(prev => ({ ...prev, ...patch }));

    return (
        <div className="container container-1000">
            <div className="profile-form">
            <div className="cont-content-profile">
                <div className="content-profile">
                    <div className="info-01-profile">
                        <div className="avatar-user">
                            {(editingSection === 'all' || editingSection === 'avatar') ? (
                                <input type="text" value={draft.avatar} onChange={(e) => updateDraft({ avatar: e.target.value })} />
                            ) : (
                                <img src={profile.avatar || '/img/default-avatar.jpg'} alt="avatar" onError={(e:any) => { e.currentTarget.src = '/img/default-avatar.jpg'; }} />
                            )}
                        </div>
                        {(editingSection === 'all' || editingSection === 'name') ? (
                            <input className="name-user-input" value={draft.name} onChange={(e) => updateDraft({ name: e.target.value })} />
                        ) : (
                            <div className="name-user">{profile.name || 'Người dùng'}</div>
                        )}
                        {(editingSection === 'all' || editingSection === 'location') ? (
                            <input className="born-user-input" value={draft.location} onChange={(e) => updateDraft({ location: e.target.value })} />
                        ) : (
                            <div className="born-user">{profile.location}</div>
                        )}
                    </div>
                    <div className="info-profile">
                        <div className="cont-info-user">
                            <div className="title-info">
                                <Calendar className='style-icon cl-blue' />
                                <span>Ngày sinh</span>
                                <button className="edit-icon" onClick={(e) => { e.stopPropagation(); startEdit('birthDate'); }}>
                                    <Edit size={16} />
                                </button>
                            </div>
                            {(editingSection === 'all' || editingSection === 'birthDate') ? (
                                <div className="edit-block">
                                    <input
                                        type="date"
                                        value={draft.birthDate}
                                        onChange={(e) => updateDraft({ birthDate: e.target.value })}
                                    />

                                    <div className="edit-actions">
                                        <button className="btn-short cl-blue" onClick={saveEdit}>
                                            Xác nhận
                                        </button>
                                        <button className="btn-short" onClick={cancelEdit}>
                                            Hủy
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="detail-info">{profile.birthDate}</div>
                            )}

                        </div>
                        <div className="cont-info-user">
                            <div className="title-info">
                                <Users className='style-icon cl-blue' />
                                <span>Giới tính</span>
                                <button className="edit-icon" onClick={(e) => { e.stopPropagation(); startEdit('gender'); }}>
                                    <Edit size={16} />
                                </button>
                            </div>
                            {(editingSection === 'all' || editingSection === 'gender') ? (
                                <div className="edit-block">

                                    {/* SELECT GIỚI TÍNH */}
                                    <select
                                        value={draft.gender}
                                        onChange={(e) => updateDraft({ gender: e.target.value })}
                                        className="select-gender"
                                    >
                                        <option value="Nam">Nam</option>
                                        <option value="Nữ">Nữ</option>
                                    </select>

                                    {/* 2 NÚT */}
                                    <div className="edit-actions">
                                        <button className="btn-short cl-blue" onClick={saveEdit}>
                                            Xác nhận
                                        </button>
                                        <button className="btn-short" onClick={cancelEdit}>
                                            Hủy
                                        </button>
                                    </div>

                                </div>
                            ) : (
                                <div className="detail-info">{profile.gender}</div>
                            )}

                        </div>
                    </div>
                    <div className="info-profile">
                        <div className="cont-info-user">
                            <div className="title-info">
                                <Sparkles className='style-icon cl-blue' />
                                <span>Về tôi</span>
                                <button
                                    className="edit-icon"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        startEdit('about');
                                    }}
                                >
                                    <Edit size={16} />
                                </button>
                            </div>

                            {(editingSection === 'all' || editingSection === 'about') ? (
                                <>
                                    <textarea
                                        value={draft.about}
                                        onChange={(e) => updateDraft({ about: e.target.value })}
                                        rows={6}
                                    />

                                    <div className="edit-actions">
                                        <button className="btn-short cl-blue" onClick={saveEdit}>
                                            Xác nhận
                                        </button>
                                        <button className="btn-short" onClick={cancelEdit}>
                                            Hủy
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <div className="detail-info">{profile.about}</div>
                            )}
                        </div>
                    </div>

                    <div className="info-profile">
                        <div className="cont-info-user">
                            <div className="title-info">
                                <span>Sở thích</span>

                                {/* Nút Edit */}
                                <button
                                    className="edit-icon"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        startEdit("hobbies");
                                    }}
                                >
                                    <Edit size={16} />
                                </button>
                            </div>

                            <div className="detail-info hobby-info">
                                {/* always show existing hobby tags unchanged */}
                                {profile.hobbies.map((h, idx) => (
                                    <span key={idx} className="btn-hobby">
                                        {h}
                                    </span>
                                ))}

                                {/* when editing hobbies, show inputs + add/confirm/cancel controls (do not replace tags) */}
                                {editingSection === 'hobbies' && (
                                    <div className="edit-block">
                                        {hobbyInputs.map((val, i) => (
                                            <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
                                                <input value={val} onChange={(e) => updateHobbyInput(i, e.target.value)} />
                                                <button className="btn-short" onClick={() => removeHobbyInput(i)} aria-label={`Xóa mục ${i}`}>
                                                    ×
                                                </button>
                                            </div>
                                        ))}

                                        <div style={{ display: 'flex', gap: 8 }}>
                                            <button className="btn-short" onClick={addHobbyInput}>
                                                + Thêm
                                            </button>
                                            <button className="btn-short cl-blue" onClick={confirmHobbies}>
                                                Xác nhận
                                            </button>
                                            <button
                                                className="btn-short"
                                                onClick={() => {
                                                    setHobbyInputs([]);
                                                    cancelEdit();
                                                }}
                                            >
                                                Hủy
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="info-profile">
                        <div className="cont-info-user">
                            <div className="title-info">
                                <span>Ưu tiên tìm kiếm</span>
                                <button
                                    className="edit-icon"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        // Immediately remove the preference while keeping the same styling
                                        setProfile((prev) => ({ ...prev, preference: '' }));
                                        setDraft((prev) => ({ ...prev, preference: '' }));
                                    }}
                                    aria-label="Xóa ưu tiên tìm kiếm"
                                >
                                    <Edit size={16} />
                                </button>
                            </div>
                            <div className="detail-info">{profile.preference}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </div>
    )

}