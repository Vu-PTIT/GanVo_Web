import { HeartHandshake, Search, Bell, UserCircle, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from '../../lib/axios';
import '../../assets/css/asset.css';
import '../../assets/css/index.css';
import './header.css';

export function Header() {
    const [showMenu, setShowMenu] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState<Array<any>>([]);
    const [loadingNotifs, setLoadingNotifs] = useState(false);
    const [notifError, setNotifError] = useState<string | null>(null);
    const navigate = useNavigate();

    const unreadCount = notifications.filter((n) => !n.read).length;
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const handleLogout = () => {
        // Clear auth data
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // Redirect to login
        navigate('/signin');
        setShowMenu(false);
    };

    const fetchNotifications = async () => {
        setNotifError(null);
        setLoadingNotifs(true);
        try {
            const res = await axiosInstance.get('/notifications');
            const data = Array.isArray(res?.data) ? res.data : res?.data?.data || [];
            setNotifications(data);
        } catch (err) {
            console.error('Failed to fetch notifications', err);
            setNotifError('Không thể tải thông báo');
            setNotifications([]);
        } finally {
            setLoadingNotifs(false);
        }
    };

    const markAsRead = async (id: string) => {
        try {
            // try API call, fallback to local update
            await axiosInstance.post(`/notifications/${id}/mark-read`).catch(() => { });
        } catch { }
        setNotifications((prev) => prev.map((n) => (n._id === id || n.id === id ? { ...n, read: true } : n)));
    };

    const markAllRead = async () => {
        try {
            await axiosInstance.post('/notifications/mark-read-all').catch(() => { });
        } catch { }
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    };

    return (
        <header>
            <div className="header">
                <div className="header-left-site">
                    <div className="logo"></div>
                    <p className="name-web">Kết nối vui vẻ</p>
                </div>
                <ul className="header-right-site">
                    <li><HeartHandshake className='style-icon' /></li>
                    <li><Search className='style-icon' /></li>
                    <li className="notifications-container">
                        <button className="bell-button" onClick={async () => { setShowNotifications(!showNotifications); setShowMenu(false); if (!showNotifications) await fetchNotifications(); }} aria-label="Thông báo">
                            <Bell className='style-icon' />
                            {unreadCount > 0 && <span className="bell-dot" aria-hidden />}
                        </button>
                        {showNotifications && (
                            <div className="user-menu-dropdown notifications-dropdown">
                                <div className="notifications-header">
                                    <strong>Thông báo</strong>
                                    <button className="menu-item" onClick={markAllRead} style={{ marginLeft: 8 }}>Đánh dấu đã đọc tất cả</button>
                                </div>
                                <div className="notifications-list">
                                    {loadingNotifs && <div className="notif-empty">Đang tải...</div>}
                                    {!loadingNotifs && notifError && <div className="notif-empty">{notifError}</div>}
                                    {!loadingNotifs && !notifError && notifications.length === 0 && <div className="notif-empty">Không có thông báo</div>}
                                    {!loadingNotifs && notifications.map((n) => (
                                        <div key={n._id || n.id} className={`notification-item ${n.read ? 'read' : 'unread'}`}>
                                            <div className="notification-body">
                                                <div className="notification-text">{n.content || n.message || n.title || 'Thông báo'}</div>
                                                <div className="notification-meta">{n.time || n.createdAt ? new Date(n.time || n.createdAt).toLocaleString() : ''}</div>
                                            </div>
                                            <div className="notification-actions">
                                                {!n.read && <button className="menu-item" onClick={() => markAsRead(n._id || n.id)}>Đã đọc</button>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </li>
                    <li className="user-menu-container">
                        <button className="user-menu-btn" onClick={() => setShowMenu(!showMenu)}>
                            <UserCircle className='style-icon' />
                        </button>
                        {showMenu && (
                            <div className="user-menu-dropdown">
                                <div className="user-info">
                                    <p className="user-name">{user?.name || "Người dùng"}</p>
                                    <p className="user-email">{user?.email || "Chưa có email"}</p>
                                </div>

                                <button className="menu-item logout-btn" onClick={handleLogout}>
                                    <LogOut size={18} />
                                    <span>Đăng xuất</span>
                                </button>
                            </div>
                        )}
                    </li>
                </ul>
            </div>
        </header>
    )
}