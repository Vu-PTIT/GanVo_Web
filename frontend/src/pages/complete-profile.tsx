import '../assets/css/index.css';
import '../assets/css/asset.css';
import './complete-profile.css';
import avatarPlaceholder from '../assets/img/avatar.jpg';
import InputForm from '../components/ui/input-form/input-form';
import AvatarUploader from '../components/ui/avatar-uploader/avatar-uploader';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../lib/axios';
import { toast } from 'sonner';

export function Complete_profile() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        dateOfBirth: '',
        gender: 'male',
        bio: '',
        avatarUrl: '',
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await axiosInstance.get('/users/me');
                if (res.data.user) {
                    const u = res.data.user;
                    setFormData({
                        dateOfBirth: u.dateOfBirth ? new Date(u.dateOfBirth).toISOString().split('T')[0] : '',
                        gender: u.gender || 'male',
                        bio: u.bio || '',
                        avatarUrl: u.avatarUrl || ''
                    });
                }
            } catch (error) {
                console.error('Error fetching profile:', error);
            }
        };
        fetchProfile();
    }, []);

    const handleChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleAvatarChange = async (file: File | null) => {
        if (!file) {
            handleChange('avatarUrl', '');
            return;
        }

        const data = new FormData();
        data.append('file', file);

        try {
            const res = await axiosInstance.post('/upload', data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            handleChange('avatarUrl', res.data.url);
            toast.success('Ảnh đại diện đã được tải lên');
        } catch (error) {
            console.error('Upload error:', error);
            toast.error('Lỗi khi tải ảnh lên');
        }
    };

    const handleSubmit = async () => {
        if (!formData.dateOfBirth || !formData.bio) {
            toast.error('Vui lòng điền đầy đủ thông tin bắt buộc');
            return;
        }

        try {
            setLoading(true);
            await axiosInstance.put('/users/profile', {
                dateOfBirth: formData.dateOfBirth,
                gender: formData.gender,
                bio: formData.bio,
                avatarUrl: formData.avatarUrl
            });
            toast.success('Cập nhật hồ sơ thành công!');
            navigate('/dashboard');
        } catch (error: any) {
            console.error('Error updating profile:', error);
            const errorMsg = error?.response?.data?.message || 'Có lỗi xảy ra khi cập nhật hồ sơ';
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div id='complete-profile'>
            <div className="cont-complete-profile">
                <h1 className="title-text mb-30">Hoàn thiện Hồ sơ của bạn</h1>
                <InputForm
                    label="Ngày sinh"
                    type="date"
                    placeholder='Chọn ngày sinh'
                    value={formData.dateOfBirth}
                    onChange={(e) => handleChange('dateOfBirth', e.target.value)}
                />
                <InputForm
                    label="Giới tính"
                    as="select"
                    options={[
                        { value: 'male', label: 'Nam' },
                        { value: 'female', label: 'Nữ' },
                        { value: 'other', label: 'Khác' }
                    ]}
                    value={formData.gender}
                    onChange={(e) => handleChange('gender', e.target.value)}
                />
                <InputForm
                    as="textarea"
                    label="Tiểu sử"
                    placeholder='Nhập tiểu sử (Cần thiết để gợi ý kết bạn)'
                    rows={5}
                    value={formData.bio}
                    onChange={(e) => handleChange('bio', e.target.value)}
                />
                <div className="input-form-box mb-50">
                    <label>Ảnh đại diện</label>
                    <AvatarUploader
                        initialSrc={formData.avatarUrl || avatarPlaceholder}
                        onChange={handleAvatarChange}
                    />
                </div>
                <button
                    type="button"
                    className='complete-profile-btn'
                    onClick={handleSubmit}
                    disabled={loading}
                >
                    {loading ? 'Đang cập nhật...' : 'Cập nhật Hồ sơ'}
                </button>
            </div>
        </div>
    )
}