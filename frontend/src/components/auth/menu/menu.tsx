import './menu.css';
import '../../../assets/css/asset.css';
import { useEffect, useState } from 'react';

import { Calendar, Users, Box, MessageSquare, NotepadText } from 'lucide-react';

const MENU_ITEMS = [
    { path: '/appointment', label: 'Lên Lịch Hẹn', Icon: Calendar },
    { path: '/profile', label: 'Thông Tin Cá Nhân', Icon: Users },
    { path: '/connect', label: 'Kết Nối', Icon: Box },
    { path: '/chat', label: 'Nhắn Tin', Icon: MessageSquare },
    { path: '/dashboard', label: 'Thông Tin', Icon: NotepadText },
];

export function Menu() {
    const [activePath, setActivePath] = useState<string>((typeof window !== 'undefined' && window.location && window.location.pathname) || '');

    useEffect(() => {
        const onPop = () => setActivePath(window.location.pathname);
        window.addEventListener('popstate', onPop);
        return () => window.removeEventListener('popstate', onPop);
    }, []);

    return (
        <div className="menu">
            <div className="main-menu">
                <ul>
                    {MENU_ITEMS.map((item) => {
                        const Icon = item.Icon;
                        const isActive = activePath === item.path;
                        return (
                            <li key={item.path}>
                                <a
                                    href={item.path}
                                    className={`menu-link ${isActive ? 'active' : ''}`}
                                    onClick={() => setActivePath(item.path)}
                                    aria-current={isActive ? 'page' : undefined}
                                >
                                    <Icon className="style-icon" />
                                    {item.label}
                                </a>
                            </li>
                        );
                    })}
                </ul>
            </div>
            <div className="other-menu"></div>
        </div>
    );
}