// src/pages/admin/AdminUsersPage.tsx
import React, { useEffect, useState } from "react";
import { adminService, UserFormData } from "../../services/adminService"; // Import service
import type { User } from "../../types/user";
import { Header } from "../../components/auth/header";
import { AdminSidebar } from "../../components/admin/AdminSidebar";
import "./admin-users.css";

const AdminUsersPage: React.FC = () => {
    // State quản lý dữ liệu và UI
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    
    // State quản lý Modal và Form
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [formData, setFormData] = useState<UserFormData>({
        username: "",
        email: "",
        displayName: "",
        password: "",
    });
    const [error, setError] = useState("");

    // Hàm load danh sách user
    const fetchUsers = async () => {
        try {
            setLoading(true);
            const data = await adminService.getAllUsers();
            setUsers(data);
        } catch (err) {
            console.error("Failed to fetch users", err);
        } finally {
            setLoading(false);
        }
    };

    // Gọi API khi component được mount
    useEffect(() => {
        fetchUsers();
    }, []);

    // Xử lý thay đổi input form
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Mở modal thêm mới
    const openAddModal = () => {
        setEditingUser(null);
        setFormData({ username: "", email: "", displayName: "", password: "" });
        setError("");
        setIsModalOpen(true);
    };

    // Mở modal sửa
    const openEditModal = (user: User) => {
        setEditingUser(user);
        setFormData({
            username: user.username,
            email: user.email,
            displayName: user.displayName,
            password: "", // Không hiển thị password cũ
        });
        setError("");
        setIsModalOpen(true);
    };

    // Xử lý Submit Form (Tạo hoặc Cập nhật)
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        try {
            if (editingUser) {
                // Update logic gọi qua Service
                await adminService.updateUser(editingUser._id, formData);
            } else {
                // Create logic gọi qua Service
                await adminService.createUser(formData);
            }
            // Thành công thì đóng modal và load lại danh sách
            setIsModalOpen(false);
            fetchUsers();
        } catch (err: any) {
            // Xử lý lỗi từ Backend trả về
            const message = err.response?.data?.message || "Có lỗi xảy ra";
            setError(message);
        }
    };

    // Xử lý Xóa User
    const handleDelete = async (id: string) => {
        if (!window.confirm("Bạn có chắc chắn muốn xóa user này? Hành động này không thể hoàn tác.")) return;
        try {
            await adminService.deleteUser(id);
            // Cập nhật UI ngay lập tức bằng cách lọc bỏ user đã xóa (nhanh hơn gọi lại API)
            setUsers((prev) => prev.filter((u) => u._id !== id));
        } catch (err) {
            console.error("Failed to delete user", err);
            alert("Không thể xóa user. Vui lòng thử lại.");
        }
    };

    return (
        <div className="layout">
            <Header />
            <main id="admin-users">
                <div className="chat-layout scoll-auto">
                    <AdminSidebar />

                    <div className="flex-1 bg-base-100 rounded-lg shadow-xl overflow-hidden flex flex-col border border-base-300 h-full">
                        {/* Admin Content Area */}
                        <div className="admin-content-wrapper p-6 h-full overflow-y-auto">
                            <div className="admin-header flex justify-between items-center mb-6">
                                <h1 className="text-2xl font-bold">Quản lý User</h1>
                                <button className="btn btn-primary btn-sm" onClick={openAddModal}>
                                    + Thêm User
                                </button>
                            </div>

                            <div className="table-container overflow-x-auto">
                                {loading ? (
                                    <div className="flex justify-center p-10">Đang tải dữ liệu...</div>
                                ) : (
                                    <table className="table w-full">
                                        <thead>
                                            <tr>
                                                <th>Tên hiển thị</th>
                                                <th>Username</th>
                                                <th>Email</th>
                                                <th>Vai trò</th>
                                                <th>Hành động</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {users.map((user) => (
                                                <tr key={user._id} className="hover">
                                                    <td>
                                                        <div className="flex items-center gap-3">
                                                            {user.avatarUrl && (
                                                                <div className="avatar">
                                                                    <div className="mask mask-squircle w-8 h-8">
                                                                        <img src={user.avatarUrl} alt="Avatar" />
                                                                    </div>
                                                                </div>
                                                            )}
                                                            <div className="font-bold">{user.displayName}</div>
                                                        </div>
                                                    </td>
                                                    <td>{user.username}</td>
                                                    <td>{user.email}</td>
                                                    <td>
                                                        <span className={`badge ${user.role === 'admin' ? 'badge-secondary' : 'badge-ghost'}`}>
                                                            {user.role}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <div className="flex gap-2">
                                                            <button
                                                                className="btn btn-xs btn-info"
                                                                onClick={() => openEditModal(user)}
                                                            >
                                                                Sửa
                                                            </button>
                                                            <button
                                                                className="btn btn-xs btn-error"
                                                                onClick={() => handleDelete(user._id)}
                                                            >
                                                                Xóa
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                            {users.length === 0 && (
                                                <tr>
                                                    <td colSpan={5} className="text-center py-4">
                                                        Chưa có user nào
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* MODAL */}
            {isModalOpen && (
                <div className="modal modal-open">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg mb-4">
                            {editingUser ? "Sửa User" : "Thêm User Mới"}
                        </h3>
                        
                        {error && <div className="alert alert-error mb-4 text-sm py-2">{error}</div>}
                        
                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            <div className="form-control">
                                <label className="label cursor-pointer justify-start gap-2">Username</label>
                                <input
                                    type="text"
                                    name="username"
                                    className="input input-bordered w-full"
                                    value={formData.username}
                                    onChange={handleInputChange}
                                    disabled={!!editingUser} // Không cho sửa username
                                    required
                                />
                            </div>
                            
                            <div className="form-control">
                                <label className="label cursor-pointer justify-start gap-2">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    className="input input-bordered w-full"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            
                            <div className="form-control">
                                <label className="label cursor-pointer justify-start gap-2">Tên hiển thị</label>
                                <input
                                    type="text"
                                    name="displayName"
                                    className="input input-bordered w-full"
                                    value={formData.displayName}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            
                            <div className="form-control">
                                <label className="label cursor-pointer justify-start gap-2">
                                    Password <span className="text-xs text-gray-500 font-normal ml-1">{editingUser && "(Để trống nếu không đổi)"}</span>
                                </label>
                                <input
                                    type="password"
                                    name="password"
                                    className="input input-bordered w-full"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    required={!editingUser} // Bắt buộc khi tạo mới
                                />
                            </div>
                            
                            <div className="modal-action mt-6">
                                <button
                                    type="button"
                                    className="btn"
                                    onClick={() => setIsModalOpen(false)}
                                >
                                    Hủy
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    {editingUser ? "Cập nhật" : "Tạo mới"}
                                </button>
                            </div>
                        </form>
                    </div>
                    {/* Click ra ngoài để đóng modal */}
                    <div className="modal-backdrop" onClick={() => setIsModalOpen(false)}></div>
                </div>
            )}
        </div>
    );
};

export default AdminUsersPage;