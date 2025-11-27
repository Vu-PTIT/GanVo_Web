import '../assets/css/index.css';
import '../assets/css/asset.css';
import InputForm from '../components/ui/input-form/input-form';
import Button from '../components/ui/button/button';

export function Sign_up(){
    return(
        <div id='sign-up'>
            <div className="cont-sign-up">
                <div className="content-sign-up">
                    <h1 className="title-text mb-15">Đăng ký tài khoản</h1>
                    <p className='title-text-under mb-25'>Tạo tài khoản mới để bắt đầu trải nghiệm dịch vụ của chúng tôi.</p>
                    <InputForm
                        label="Họ và tên"
                        type="text"
                        placeholder='Nhập họ và tên của bạn'
                    />
                    <InputForm
                        label="Địa chỉ email"
                        type="email"
                        placeholder='your@example.com'
                    />
                    <InputForm
                        label="Mật khẩu"
                        type="password"
                        placeholder='Nhập mật khẩu'
                    />
                    <InputForm
                        label="Xác nhận mật khẩu"
                        type="password"
                        placeholder='Xác nhận mật khẩu'
                    />
                    <Button className='mb-45'>Đăng kí</Button>
                    <p className='title-text-under m-0'>Đã có tài khoản?<a href="/sign-in" className='cl-blue'> Đăng nhập</a></p>
                </div>
            </div>
        </div>
    )
}