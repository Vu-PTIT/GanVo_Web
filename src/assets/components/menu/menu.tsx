import './menu.css';

export function Menu(){
    return(
        <div className="menu">
            <div className="main-menu">
                <ul>
                    <li>Lên Lịch Hẹn</li>
                    <li>Thông Tin Cá Nhân</li>
                    <li>Kết Nối</li>
                    <li>Nhắn Tin</li>
                </ul>
            </div>
            <div className="other-menu"></div>
        </div>
    )
}