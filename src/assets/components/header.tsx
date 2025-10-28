import { HeartHandshake, Search, Bell, UserCircle } from "lucide-react";
import '../css/asset.css';
import '../css/index.css';
import { Link } from "react-router-dom";

export function Header(){
    return(
        <header>
            <div className="header">
                <div className="header-left-site">
                    <div className="logo"></div>
                    <p className="name-web">Kết nối vui vẻ</p>    
                </div>
                <ul className="header-right-site">
                    <li><HeartHandshake className='style-icon'/></li>
                    <li><Search className='style-icon'/></li>    
                    <li><Bell className='style-icon'/></li>             
                    <li><UserCircle className='style-icon'/></li>
                </ul>
            </div>
        </header>
    )
}