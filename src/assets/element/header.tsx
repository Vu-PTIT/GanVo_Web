import '../css/asset.css'
import '../css/index.css'
import '../css/asset-sm.css'

export function Header(){
    return(
        <>
            <div className="header">
                <div className="header-left-site">
                    <div className="logo"></div>
                    <input className="input-search"></input>    
                </div>
                <div className="header-right-site">
                    <ul className="main-menu">
                        <li>Trang lịch hẹn</li>
                        <li>Trang nhắn tin</li>
                        <li>Thông báo</li>
                        <li>Trang thông tin cá nhân</li>
                    </ul>
                </div>
            </div>
        </>
    )
}