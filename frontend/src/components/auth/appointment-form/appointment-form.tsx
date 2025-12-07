import './appointment-form.css';
import '../../../assets/css/asset.css';
import '../../../assets/css/index.css';
import InputForm from '../../ui/input-form/input-form';
import Button from '../../ui/button/button';

export function AppointmentForm(){ 
    return(
        <div className="appointment-form">
            <div className="cont-title-appointment">
                <h1 className='txt-ct fs-35 mt-10 mb-25'>Lên Lịch Hẹn Mới</h1>
                <p className='title-text-under mb-25'>Chọn vị trí và điền thông tin chi tiết cuộc hẹn của bạn.</p>
            </div>
            <div className="cont-content-appointment">
                <div className='map-appointment'>
                    <div className='title-2 mb-5'>Lên Lịch Hẹn Mới</div>
                    <p className='title-text-under-2 mb-25'>Kéo thả ghim để chọn địa điểm phù hợp.</p>
                </div>
                <div className="input-appointment box-input-form">
                    <div className='title-2 mb-5'>Chi Tiết Cuộc Hẹn</div>
                    <p className='title-text-under-2 mb-30'>Điền thông tin cuộc hẹn của bạn.</p>
                    <InputForm
                    label="Thời gian hẹn"
                    type="datetime-local"
                    placeholder='Chọn ngày và giờ'
                    />
                    <InputForm
                    label="Địa điểm"
                    as="select"
                    options={[
                        { value: '0', label: '-- Chọn địa điểm --' },
                        { value: '1', label: 'Hà Nội' },
                        { value: '2', label: 'TP HCM' },
                        { value: '3', label: 'Huế' }
                    ]}
                    />
                    <InputForm
                    label="Loại cuộc hẹn"
                    as="select"
                    options={[
                        { value: '0', label: '-- Chọn thể loại --' },
                        { value: '1', label: 'abc' },
                        { value: '2', label: 'xyz' },
                        { value: '3', label: 'aaa' }
                    ]}
                    />
                    <InputForm
                    label="Yêu cầu với người hẹn"
                    type="text"
                    placeholder='Yêu cầu với người hẹn'
                    />
                    <InputForm
                    as="textarea"
                    label="Lý Do Kết Nối / Tin Nhắn"
                    placeholder='Bạn muốn kết nối vì lý do gì?'
                    rows={3}
                    />
                    <div className="btn-cont-2 mt-15">
                        <Button className='btn-short cl-white-for-btn'>Huỷ</Button>
                        <Button className='btn-short cl-blue-for-btn'>Kết nối</Button>
                    </div>    
                </div>
            </div>    
        </div>
    )

}