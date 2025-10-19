import '../assets/css/index.css';
import '../assets/css/asset.css';
import avatar from '../assets/img/avatar.jpg';

export function Complete_profile(){
    return(
        <div id='complete-profile'>
            <div className="cont-complete-profile">
                <h1 className="title-text mb-30">Hoàn thiện Hồ sơ của bạn</h1>
                <div className="input-form-box">
                    <label>Ngày sinh</label>
                    <input type='email' placeholder='your@example.com'></input>
                </div>
                <div className="input-form-box">
                    <label>Giới tính</label>
                    <input type='password' placeholder='Nhập mật khẩu'></input>
                </div>
                <div className="input-form-box">
                    <label>Tiểu sử</label>
                    <textarea rows={5} placeholder='Nhập mật khẩu'></textarea>
                </div>
                <div className="input-form-box mb-50">
                    <label>Ảnh đại diện</label>
                    <div className="cont-avt">
                        <img src={avatar} alt="Avatar"/>
                    </div>
                </div>
                <button className='btn-sign-in-up mb-35'>Cập nhật Hồ sơ</button>
            </div>
        </div>
    )
}