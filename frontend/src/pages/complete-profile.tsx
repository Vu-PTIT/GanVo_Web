import '../assets/css/index.css';
import '../assets/css/asset.css';
import avatar from '../assets/img/avatar.jpg';
import InputForm from '../components/ui/input-form/input-form';
import AvatarUploader from '../components/ui/avatar-uploader/avatar-uploader';
import Button from '../components/ui/button/button'

export function Complete_profile(){
    return(
        <div id='complete-profile'>
            <div className="cont-complete-profile">
                <h1 className="title-text mb-30">Hoàn thiện Hồ sơ của bạn</h1>
                <InputForm
                    label="Ngày sinh"
                    type="date"
                    placeholder='Chọn ngày sinh'
                />
                <InputForm
                    label="Giới tính"
                    as="select"
                    options={[
                        { value: 'male', label: 'Nam' },
                        { value: 'female', label: 'Nữ' },
                        { value: 'other', label: 'Khác' }
                    ]}
                />
                <InputForm
                    as="textarea"
                    label="Tiểu sử"
                    placeholder='Nhập tiểu sử'
                    rows={5}
                />
                <div className="input-form-box mb-50">
                    <label>Ảnh đại diện</label>
                    <AvatarUploader initialSrc={avatar} onChange={(f) => console.log('avatar file', f)} />
                </div>
                <Button className='mb-35'>Cập nhật Hồ sơ</Button>
            </div>
        </div>
    )
}