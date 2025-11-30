import './menu.css';
import '../../../assets/css/asset.css';

import { Calendar, Users, Box, MessageSquare } from "lucide-react";

export function Menu(){
    return(
        <div className="menu">
            <div className="main-menu">
                <ul>
                    <li>
                        <a href='/appointment'>
                            <Calendar className='style-icon'/>
                            Lên Lịch Hẹn
                        </a>
                    </li>
                    <li>
                        <a href='/profile'>
                            <Users className='style-icon'/>
                            Thông Tin Cá Nhân
                        </a>
                    </li>
                    <li>
                        <a href='/connect'>
                            <Box className='style-icon'/>
                            Kết Nối
                        </a>
                    </li>
                    <li>
                        <a href='/chat'>
                            <MessageSquare className='style-icon'/>
                            Nhắn Tin
                        </a>
                    </li>
                </ul>
            </div>
            <div className="other-menu"></div>
        </div>
    )
}