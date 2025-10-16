import './assets/css/index.css';
import './assets/css/asset.css';
import './assets/css/asset-sm.css';

export function Appointment(){
    return(
        <>
            <div className="appointment">
                <div className="appointment-left-site"></div>
                <div className="appointment-right-site">
                    <h1 className='txt-ct fs-35 mt-100 mb-50'>Đăng nhập</h1>
                    <div id="create-appointment">
                    <div className='box-input-form'>
                    <input className='input-form' type="datetime-local" placeholder=''></input>
                    <input className='input-form' type="password" name="password" placeholder='Mật khẩu'></input>
                    <input className='input-form' type="password" name="password" placeholder='Mật khẩu'></input>
                    <input className='input-form' type="password" name="password" placeholder='Mật khẩu'></input>
                    <input className='input-form' type="password" name="password" placeholder='Mật khẩu'></input>
                    <button className='btn-blue mt-20'>Đăng nhập</button>
                    </div>
                </div>
                </div>
            </div>
        </>
    )
}