import './menu.css';
import '../../css/asset.css';

import { Calendar, Users, Box, MessageSquare } from "lucide-react";

export function Menu(){
    return(
        <div className="menu">
            <div className="main-menu">
                <ul>
                    <li>
                        <Calendar className='style-icon'/>
                        <span>Lên Lịch Hẹn</span>
                    </li>
                    <li>
                        <Users className='style-icon'/>
                        <span>Thông Tin Cá Nhân</span>
                    </li>
                    <li>
                        <Box className='style-icon'/>
                        <span>Kết Nối</span>
                    </li>
                    <li>
                        <MessageSquare className='style-icon'/>
                        <span>Nhắn Tin</span>
                    </li>
                </ul>
            </div>
            <div className="other-menu"></div>
        </div>
    )
}