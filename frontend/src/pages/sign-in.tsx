import '../assets/css/index.css';
import '../assets/css/asset.css';
import InputForm from '../components/ui/input-form/input-form';
import Button from '../components/ui/button/button';

export function Sign_in(){
    return(
        <div id='sign-in'>
            <div className="cont-sign-in">
                <div className="content-sign-in">
                    <h1 className="title-text mb-15">Đăng ký tài khoản</h1>
                    <p className='title-text-under mb-25'>Tạo tài khoản mới để bắt đầu trải nghiệm dịch vụ của chúng tôi.</p>
                    <InputForm
                        label="Email"
                        type="email"
                        placeholder='your@example.com'
                    />
                    <InputForm
                        label="Mật khẩu"
                        type="password"
                        placeholder='Nhập mật khẩu'
                    />
                    <p className='title-text-under mb-10'><span className='cl-blue'>Quên mật khẩu ?</span></p>
                    <Button className='mb-35'>Đăng nhập</Button>
                    <p className='title-text-under m-0'>Chưa có tài khoản?<a href="/sign-up" className='cl-blue'> Đăng ký</a></p>
                </div>
            </div>
        </div>
    )
}