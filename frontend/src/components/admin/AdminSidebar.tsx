import { useEffect, useState } from 'react';
import { Users, Calendar, BarChart2 } from "lucide-react";
import '../auth/menu/menu.css'; // Tái sử dụng file CSS mới sửa
import '../../assets/css/asset.css';

export function AdminSidebar() {
    // Logic xác định menu nào đang được chọn (Active State)
    const [activePath, setActivePath] = useState<string>(
        (typeof window !== 'undefined' && window.location && window.location.pathname) || ''
    );

    // Lắng nghe sự thay đổi URL để cập nhật menu active
    useEffect(() => {
        const onPop = () => setActivePath(window.location.pathname);
        window.addEventListener('popstate', onPop);
        return () => window.removeEventListener('popstate', onPop);
    }, []);

    // Hàm kiểm tra đường dẫn active (kể cả trang con)
    const checkActive = (path: string) => {
        return activePath === path || activePath.startsWith(path);
    };

    return (
        <aside className="menu">
            <nav className="main-menu">
                <ul>
                    {/* --- DASHBOARD --- */}
                    <li>
                        <a 
                            href='/admin/dashboard' 
                            className={`menu-link ${checkActive('/admin/dashboard') ? 'active' : ''}`}
                            onClick={() => setActivePath('/admin/dashboard')}
                        >
                            <BarChart2 className='style-icon' />
                            <span>Dashboard</span>
                        </a>
                    </li>

                    {/* --- QUẢN LÝ USER --- */}
                    <li>
                        <a 
                            href='/admin/users' 
                            className={`menu-link ${checkActive('/admin/users') ? 'active' : ''}`}
                            onClick={() => setActivePath('/admin/users')}
                        >
                            <Users className='style-icon' />
                            <span>Quản lý User</span>
                        </a>
                    </li>

                    {/* --- QUẢN LÝ LỊCH HẸN --- */}
                    <li>
                        <a 
                            href='/admin/appointments' 
                            className={`menu-link ${checkActive('/admin/appointments') ? 'active' : ''}`}
                            onClick={() => setActivePath('/admin/appointments')}
                        >
                            <Calendar className='style-icon' />
                            <span>Quản lý Lịch Hẹn</span>
                        </a>
                    </li>
                </ul>
            </nav>
        </aside>
    );
}
