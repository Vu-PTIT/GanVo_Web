import './assets/css/index.css';
import './assets/css/asset.css';
import './assets/css/asset-sm.css';

export function Sign_in(){
    return (
        <>
        <h1 className='txt-ct fs-35 mt-100 mb-50'>Đăng nhập</h1>
        <div id="sign-in">
            <div className='box-input-form'>
                <input className='input-form' type="email" name="email" placeholder='Email'></input>
                <input className='input-form' type="password" name="password" placeholder='Mật khẩu'></input>
                <button className='btn-long mt-20'>Đăng nhập</button>
                <p className='mt-15'>Quên mật khẩu</p>
                <p className='mt-15'>Đăng kí tải khảu mới</p>
            </div>
        </div>
        </>
    )
}

export function Sign_up(){
    return (
        <>
        <h1 className='txt-ct fs-35 mt-100 mb-50'>Đăng ký</h1>
        <div id="sign-up">
            <div className='box-input-form'>
                <input className='input-form' type="email" name="email" placeholder='Email'></input>
                <input className='input-form' type="password" name="password" placeholder='Mật khẩu'></input>
                <input className='input-form' type="password" name="password" placeholder='Nhập lại mật khẩu'></input>
                <button className='btn-long mt-20'>Đăng nhập</button>
                <p className='mt-15'>Đã có tài khoản</p>
            </div>
        </div>
        </>
    )
}
