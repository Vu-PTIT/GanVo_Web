import '../assets/css/index.css';
import '../assets/css/asset.css';

export function Sign_up(){
    return(
        <div className='sign-up'>
            <div className="cont-sign-up">
                <div className="content-sign-up">
                    <h1 className="title-text mb-15">Đăng ký tài khoản</h1>
                    <p className='title-text-under mb-25'>Tạo tài khoản mới để bắt đầu trải nghiệm dịch vụ của chúng tôi.</p>
                    <div className="input-form-box">
                        <label>Họ và tên</label>
                        <input type='text' placeholder='Nhập họ và tên của bạn'></input>
                    </div>
                    <div className="input-form-box">
                        <label>Địa chỉ email</label>
                        <input type='email' placeholder='your@example.com'></input>
                    </div>
                    <div className="input-form-box">
                        <label>Mật khẩu</label>
                        <input type='password' placeholder='Nhập mật khẩu'></input>
                    </div>
                    <div className="input-form-box mb-35">
                        <label>Xác nhận mật khẩu</label>
                        <input type='password' placeholder='Xác nhận mật khẩu'></input>
                    </div>
                    <button className='btn-sign-in-up mb-45'>Đăng kí</button>
                    <p className='title-text-under m-0'>Đã có tài khoản?<span className='cl-blue'> Đăng nhập</span></p>
                </div>
            </div>
        </div>
    )
}