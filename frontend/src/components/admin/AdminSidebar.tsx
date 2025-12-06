import { Users, Calendar, BarChart2 } from "lucide-react";
import '../auth/menu/menu.css'; // Reuse menu styles
import '../../assets/css/asset.css';

export function AdminSidebar() {
    return (
        <div className="menu">
            <div className="main-menu">
                <ul>
                    <li>
                        <a href='/admin/dashboard'>
                            <BarChart2 className='style-icon' />
                            Dashboard
                        </a>
                    </li>
                    <li>
                        <a href='/admin/users'>
                            <Users className='style-icon' />
                            Quản lý User
                        </a>
                    </li>
                    <li>
                        <a href='/admin/appointments'>
                            <Calendar className='style-icon' />
                            Quản lý Lịch Hẹn
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    );
}
