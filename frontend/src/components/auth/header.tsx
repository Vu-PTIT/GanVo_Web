import { Bell, UserCircle, LogOut, Check, Trash2, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from '../../lib/axios';
import { useChatStore } from "../../stores/useChatStore";
import '../../assets/css/asset.css';
import '../../assets/css/index.css';
import './header.css';

interface NotificationSender {
    _id: string;
    displayName: string;
    avatarUrl: string;
    username: string;
}

interface NotificationItem {
    _id: string;
    title: string;
    message: string;
    type: string;
    isRead: boolean;
    createdAt: string;
    senderId?: NotificationSender | null; // Cho phép null
    relatedId?: string;
}

export function Header() {
    const [showMenu, setShowMenu] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState<NotificationItem[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loadingNotifs, setLoadingNotifs] = useState(false);
    const [user, setUser] = useState<any>(null);

    const navigate = useNavigate();
    const { socket } = useChatStore();

    // FIX: Đổi kiểu ref thành HTMLLIElement vì gắn vào thẻ <li>
    const notifMenuRef = useRef<HTMLLIElement>(null);
    const userMenuRef = useRef<HTMLLIElement>(null);

    // Fetch user info from API
    const fetchUserInfo = async () => {
        try {
            const res = await axiosInstance.get('/users/me');
            console.log('✅ User data from API:', res.data);
            const userData = res.data?.user || res.data;
            setUser(userData);
            // Update localStorage with fresh data
            localStorage.setItem('user', JSON.stringify(userData));
        } catch (error) {
            console.error('❌ Failed to fetch user info', error);
            // Fallback to localStorage
            const localUser = JSON.parse(localStorage.getItem("user") || "{}");
            console.log('📦 Fallback user from localStorage:', localUser);
            setUser(localUser);
        }
    };

    useEffect(() => {
        fetchUserInfo();
    }, []);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (notifMenuRef.current && !notifMenuRef.current.contains(event.target as Node)) {
                setShowNotifications(false);
            }
            if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
                setShowMenu(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const fetchNotifications = async () => {
        try {
            setLoadingNotifs(true);
            const res = await axiosInstance.get('/notifications?limit=20');
            setNotifications(res.data.notifications || []);
            setUnreadCount(res.data.unreadCount || 0);
        } catch (err) {
            console.error('Failed to fetch notifications', err);
        } finally {
            setLoadingNotifs(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    useEffect(() => {
        if (!socket) return;
        const handleNewNotification = (newNotif: NotificationItem) => {
            setNotifications((prev) => [newNotif, ...prev]);
            setUnreadCount((prev) => prev + 1);
        };
        socket.on("new_notification", handleNewNotification);
        return () => {
            socket.off("new_notification", handleNewNotification);
        };
    }, [socket]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/signin');
        setShowMenu(false);
    };

    const markAsRead = async (id: string, e?: React.MouseEvent) => {
        e?.stopPropagation();
        try {
            await axiosInstance.put(`/notifications/${id}/read`);
            setNotifications((prev) =>
                prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
            );
            setUnreadCount((prev) => {
                const isCurrentlyUnread = notifications.find(n => n._id === id)?.isRead === false;
                return isCurrentlyUnread ? Math.max(0, prev - 1) : prev;
            });
        } catch (error) {
            console.error("Lỗi markAsRead", error);
        }
    };

    const markAllRead = async () => {
        try {
            await axiosInstance.put('/notifications/read-all');
            setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
            setUnreadCount(0);
        } catch (error) {
            console.error("Lỗi markAllRead", error);
        }
    };

    const deleteNotification = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            await axiosInstance.delete(`/notifications/${id}`);
            const notifToDelete = notifications.find(n => n._id === id);
            setNotifications((prev) => prev.filter((n) => n._id !== id));
            if (notifToDelete && !notifToDelete.isRead) {
                setUnreadCount((prev) => Math.max(0, prev - 1));
            }
        } catch (error) {
            console.error("Lỗi deleteNotification", error);
        }
    };

    const deleteAllNotifications = async () => {
        if (!window.confirm("Bạn có chắc chắn muốn xóa tất cả thông báo?")) return;
        try {
            await axiosInstance.delete('/notifications');
            setNotifications([]);
            setUnreadCount(0);
        } catch (error) {
            console.error("Lỗi deleteAllNotifications", error);
        }
    };

    const handleNotificationClick = (notif: NotificationItem) => {
        if (!notif.isRead) {
            markAsRead(notif._id);
        }
        setShowNotifications(false);
        // Logic điều hướng
        if (notif.type === 'message' && notif.relatedId) {
            // navigate(`/messages/${notif.relatedId}`);
        } else if (notif.type === 'like') {
            navigate('/connect', { state: { tab: 'likes' } });
        } else if (notif.type === 'match') {
            navigate('/connect', { state: { tab: 'matches' } });
        }
    };

    console.log('👤 Current user state:', user);

    return (
        <header>
            <div className="header">
                <div className="header-left-site" onClick={() => navigate('/appointment')} style={{ cursor: 'pointer' }}>
                    <div className="logo"></div>
                    <p className="name-web">Kết nối vui vẻ</p>
                </div>
                <ul className="header-right-site">
                    {/* Notification Bell */}
                    <li className="notifications-container" ref={notifMenuRef}>
                        <button
                            className="bell-button"
                            onClick={() => {
                                setShowNotifications(!showNotifications);
                                setShowMenu(false);
                            }}
                            aria-label="Thông báo"
                        >
                            <Bell className='style-icon' />
                            {unreadCount > 0 && (
                                <span className="bell-dot">{unreadCount > 99 ? '99+' : unreadCount}</span>
                            )}
                        </button>

                        {showNotifications && (
                            <div className="user-menu-dropdown notifications-dropdown">
                                <div className="notifications-header">
                                    <h3 style={{ margin: 0, fontSize: '16px' }}>Thông báo</h3>
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <button
                                            className="action-btn text-blue"
                                            onClick={markAllRead}
                                            title="Đánh dấu tất cả đã đọc"
                                            disabled={notifications.length === 0}
                                        >
                                            <Check size={16} />
                                        </button>
                                        <button
                                            className="action-btn text-red"
                                            onClick={deleteAllNotifications}
                                            title="Xóa tất cả"
                                            disabled={notifications.length === 0}
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>

                                <div className="notifications-list">
                                    {loadingNotifs && <div className="notif-empty">Đang tải...</div>}

                                    {!loadingNotifs && notifications.length === 0 && (
                                        <div className="notif-empty">
                                            <p style={{ textAlign: 'center', color: '#888', padding: '20px' }}>Không có thông báo nào</p>
                                        </div>
                                    )}

                                    {!loadingNotifs && notifications.map((n) => (
                                        <div
                                            key={n._id}
                                            className={`notification-item ${n.isRead ? 'read' : 'unread'}`}
                                            onClick={() => handleNotificationClick(n)}
                                        >
                                            {/* FIX: Thêm ? vào senderId để tránh lỗi type null */}
                                            <img
                                                src={n.senderId?.avatarUrl || "/placeholder.png"}
                                                alt="Avatar"
                                                className="notif-avatar"
                                            />
                                            <div className="notification-body">
                                                <div className="notification-text">
                                                    <strong>{n.title}</strong>
                                                    <span style={{ fontSize: '13px' }}>{n.senderId?.displayName} {n.message}</span>
                                                </div>
                                                <div className="notification-meta">
                                                    {new Date(n.createdAt).toLocaleString('vi-VN', {
                                                        hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit'
                                                    })}
                                                </div>
                                            </div>

                                            <div className="notification-actions-hover">
                                                {!n.isRead && (
                                                    <button
                                                        className="icon-btn blue"
                                                        title="Đánh dấu đã đọc"
                                                        onClick={(e) => markAsRead(n._id, e)}
                                                    >
                                                        <div className="dot-unread-indicator"></div>
                                                    </button>
                                                )}
                                                <button
                                                    className="icon-btn red"
                                                    title="Xóa"
                                                    onClick={(e) => deleteNotification(n._id, e)}
                                                >
                                                    <X size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </li>

                    {/* User Menu */}
                    <li className="user-menu-container" ref={userMenuRef}>
                        <button className="user-menu-btn" onClick={() => { setShowMenu(!showMenu); setShowNotifications(false); }}>
                            {/* FIX: Thêm ? vào user để tránh lỗi type null */}
                            {user?.avatarUrl ? (
                                <img src={user.avatarUrl} alt="User" className="header-avatar" />
                            ) : (
                                <UserCircle className='style-icon' />
                            )}
                        </button>
                        {showMenu && (
                            <div className="user-menu-dropdown">
                                <div className="user-info">
                                    <p className="user-name">{user?.displayName || user?.username || "Người dùng"}</p>
                                    <p className="user-email">{user?.email || "Chưa có email"}</p>
                                </div>
                                <div className="menu-divider" style={{ height: '1px', background: '#eee', margin: '5px 0' }}></div>
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