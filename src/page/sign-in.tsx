import '../assets/css/index.css';
import '../assets/css/asset.css';

export function Sign_in(){
    return(
        <div id='sign-in'>
            <div className="cont-sign-in">
                <div className="content-sign-in">
                    <h1 className="title-text mb-15">Đăng ký tài khoản</h1>
                    <p className='title-text-under mb-25'>Tạo tài khoản mới để bắt đầu trải nghiệm dịch vụ của chúng tôi.</p>
                    <div className="input-form-box">
                        <label>Email</label>
                        <input type='email' placeholder='your@example.com'></input>
                    </div>
                    <div className="input-form-box">
                        <label>Mật khẩu</label>
                        <input type='password' placeholder='Nhập mật khẩu'></input>
                    </div>
                    <p className='title-text-under mb-10'><span className='cl-blue'>Quên mật khẩu ?</span></p>
                    <button className='btn-sign-in-up mb-35'>Đăng nhập</button>
                    <p className='title-text-under m-0'>Chưa có tài khoản?<span className='cl-blue'> Đăng kí</span></p>
                </div>
            </div>
        </div>
    )
}