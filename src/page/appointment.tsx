import './assets/css/index.css';
import './assets/css/asset.css';

export function Appointment(){
    return(
        <>
            <div className="appointment">
                <div className="appointment-left-site"></div>
                <div className="appointment-right-site">
                    <h1 className='txt-ct fs-35 mt-100 mb-50'>Đặt lịch hẹn</h1>
                    <div id="create-appointment">
                        <div className='box-input-form'>
                            <input className='input-form' type="datetime-local" name="appointment-time" placeholder='Thời gian'></input>
                            <select className='input-form' name="appointment-place">
                                <option value="" disabled selected hidden>-- Chọn địa điểm --</option>
                                <option value="">Hà Nội</option>
                                <option value="">TP HCM</option>
                                <option value="">Huế</option>
                            </select>
                            <select className='input-form' name="appointment-type">
                                <option value="" disabled selected hidden>-- Chọn thể loại --</option>
                                <option value="">1</option>
                                <option value="">2</option>
                                <option value="">3</option>
                            </select>
                            <input className='input-form' type="text" name="appointment-order" placeholder='Yêu cầu với người hẹn'></input>
                            <input className='input-form' type="text" name="appointment-reason" placeholder='LÍ do muốn kết nối'></input>
                        </div>
                    </div>
                    <div className="btn-cont-2 mt-20">
                        <button className='btn-short cl-gray'>Huỷ</button>
                        <button className='btn-short cl-blue'>Kết nối</button>
                    </div>
                </div>
            </div>
        </>
    )
}