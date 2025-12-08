import '../assets/css/index.css';
import '../assets/css/asset.css';
import avatar from '../assets/img/avatar.jpg';
import InputForm from '../components/ui/input-form/input-form';
import AvatarUploader from '../components/ui/avatar-uploader/avatar-uploader';
import Button from '../components/ui/button/button'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../lib/axios';

export function Complete_profile() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        dateOfBirth: '',
        gender: 'male',
        bio: '',
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async () => {
        if (!formData.dateOfBirth || !formData.bio) {
            alert('Vui lòng điền đầy đủ thông tin bắt buộc');
            return;
        }

        try {
            setLoading(true);
            await axiosInstance.put('/users/profile', {
                dateOfBirth: formData.dateOfBirth,
                gender: formData.gender,
                bio: formData.bio,
                // Note: Avatar upload logic pending backend support
            });
            // Redirect to connect page after successful profile completion
            navigate('/connect');
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Có lỗi xảy ra khi cập nhật hồ sơ');
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
                        initialSrc={avatar}
                        onChange={(f) => console.log('avatar file selected (upload pending)', f)}
                    />
                </div>
                <Button
                    className='mb-35'
                    onClick={handleSubmit}
                    disabled={loading}
                >
                    {loading ? 'Đang cập nhật...' : 'Cập nhật Hồ sơ'}
                </Button>
            </div>
        </div>
    )
}