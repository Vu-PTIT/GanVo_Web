import './appointment-form.css';
import '../../css/asset.css';
import '../../css/index.css';

export function AppointmentForm(){ 
    return(
        <div className="appointment-form">
            <div className="cont-title-appointment">
                <h1 className='txt-ct fs-35 mt-10 mb-10'>Lên Lịch Hẹn Mới</h1>
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
                    <div className="input-form-box">
                    <label>Thời gian</label>
                    <input className='input-form' type="datetime-local" name="appointment-time" placeholder='Thời gian'></input>
                </div>
                <div className="input-form-box">
                    <label>Địa điểm</label>
                    <select className='input-form' name="appointment-place">
                        <option value="" disabled selected hidden>-- Chọn địa điểm --</option>
                        <option value="">Hà Nội</option>
                        <option value="">TP HCM</option>
                        <option value="">Huế</option>
                    </select>
                </div>
                <div className="input-form-box">
                    <label>Loại cuộc hẹn</label>
                    <select className='input-form' name="appointment-type">
                        <option value="" disabled selected hidden>-- Chọn thể loại --</option>
                        <option value="">1</option>
                        <option value="">2</option>
                        <option value="">3</option>
                    </select>
                </div>
                <div className="input-form-box">
                    <label>Yêu cầu với người hẹn</label>
                    <input className='input-form' type="text" name="appointment-order" placeholder='Yêu cầu với người hẹn'></input>
                </div>
                <div className="input-form-box">
                    <label>Lý Do Kết Nối / Tin Nhắn</label>
                    <textarea className='input-form' name="appointment-reason" placeholder='Bạn muốn kết nối vì lý do gì?'></textarea>
                </div>
                <div className="btn-cont-2 mt-15">
                    <button className='btn-short cl-white-for-btn'>Huỷ</button>
                    <button className='btn-short cl-blue-for-btn'>Kết nối</button>
                </div>    
                </div>
            </div>
                    
        </div>
    )

}