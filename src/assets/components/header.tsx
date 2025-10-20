import { HeartHandshake, Search, Bell, UserCircle } from "lucide-react";
import '../css/asset.css';
import '../css/index.css';

export function Header(){
    return(
        <header>
            <div className="header">
                <div className="header-left-site">
                    <div className="logo"></div>
                    <p className="name-web">Kết nối vui vẻ</p>    
                </div>
                <ul className="header-right-site">
                    <li><HeartHandshake/></li>
                    <li><Search/></li>    
                    <li><Bell/></li>             
                    <li><UserCircle/></li>
                </ul>
            </div>
        </header>
    )
}