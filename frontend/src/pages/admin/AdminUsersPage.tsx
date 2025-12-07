// frontend/src/pages/admin/AdminUsersPage.tsx
import React, { useEffect, useState } from "react";
import { adminService } from "../../services/adminService";
import type { UserFormData } from "../../services/adminService";
import type { User } from "../../types/user";
import { Header } from "../../components/auth/header";
import { AdminSidebar } from "../../components/admin/AdminSidebar";
import "./admin-users.css"; // Giữ lại import CSS gốc của bạn

const AdminUsersPage: React.FC = () => {
    // --- STATE QUẢN LÝ DỮ LIỆU ---
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    // --- STATE MODAL & FORM ---
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [formData, setFormData] = useState<UserFormData>({
        username: "",
        email: "",
        displayName: "",
        password: "",
    });
    const [error, setError] = useState("");

    // --- HÀM LOAD DỮ LIỆU ---
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

    useEffect(() => {
        fetchUsers();
    }, []);

    // --- HÀM XỬ LÝ FORM ---
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const openAddModal = () => {
        setEditingUser(null);
        setFormData({ username: "", email: "", displayName: "", password: "" });
        setError("");
        setIsModalOpen(true);
    };

    const openEditModal = (user: User) => {
        setEditingUser(user);
        setFormData({
            username: user.username,
            email: user.email,
            displayName: user.displayName,
            password: "",
        });
        setError("");
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        try {
            if (editingUser) {
                await adminService.updateUser(editingUser._id, formData);
            } else {
                await adminService.createUser(formData);
            }
            setIsModalOpen(false);
            fetchUsers();
        } catch (err: any) {
            const message = err.response?.data?.message || "Có lỗi xảy ra";
            setError(message);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("Bạn có chắc chắn muốn xóa user này?")) return;
        try {
            await adminService.deleteUser(id);
            setUsers((prev) => prev.filter((u) => u._id !== id));
        } catch (err) {
            alert("Không thể xóa user.");
        }
    };

    return (
        // Thêm h-screen flex flex-col để layout chiếm toàn màn hình
        <div className="layout h-screen flex flex-col">
            <Header />
            
            {/* main: overflow-hidden để chặn cuộn toàn trang */}
            <main id="admin-users" className="flex-1 overflow-hidden">
                <div className="chat-layout flex h-full">
                    <AdminSidebar />

                    {/* Container chính: Đảm bảo chiều cao full và chặn tràn */}
                    <div className="flex-1 bg-base-100 rounded-lg shadow-xl overflow-hidden flex flex-col border border-base-300 h-full m-2">
                        
                        {/* Wrapper nội dung: ĐÂY LÀ CHỖ SỬA LỖI CUỘN */}
                        {/* Thêm overflow-y-auto để chỉ vùng này cuộn được */}
                        <div className="admin-content-wrapper flex-1 overflow-y-auto p-4">
                            
                            <div className="admin-header flex justify-between items-center mb-4">
                                <h1 className="admin-page-title text-2xl font-bold">Quản lý User</h1>
                                <button className="btn-add-user bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" onClick={openAddModal}>
                                    + Thêm User
                                </button>
                            </div>

                            <div className="table-container">
                                {/* Giữ nguyên class users-table để ăn CSS cũ của bạn */}
                                <table className="users-table w-full">
                                    <thead>
                                        <tr>
                                            <th>Tên hiển thị</th>
                                            <th>Username</th>
                                            <th>Email</th>
                                            <th>Hành động</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.map((user) => (
                                            <tr key={user._id}>
                                                <td>{user.displayName}</td>
                                                <td>{user.username}</td>
                                                <td>{user.email}</td>
                                                <td>
                                                    <div className="action-buttons flex gap-2">
                                                        {/* Giữ nguyên class btn-edit, btn-delete */}
                                                        <button
                                                            className="btn-edit px-3 py-1 bg-yellow-400 text-white rounded mr-2"
                                                            onClick={() => openEditModal(user)}
                                                        >
                                                            Sửa
                                                        </button>
                                                        <button
                                                            className="btn-delete px-3 py-1 bg-red-500 text-white rounded"
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
                                                <td colSpan={4} style={{ textAlign: "center", padding: "20px" }}>
                                                    {loading ? "Đang tải..." : "Chưa có user nào"}
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* MODAL GIỮ NGUYÊN */}
            {isModalOpen && (
                <div className="modal-overlay fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="modal-content bg-white p-6 rounded-lg shadow-lg w-96">
                        <h2 className="modal-title text-xl font-bold mb-4">
                            {editingUser ? "Sửa User" : "Thêm User Mới"}
                        </h2>
                        {error && <p style={{ color: "red", marginBottom: "10px" }}>{error}</p>}
                        <form onSubmit={handleSubmit}>
                            <div className="form-group mb-3">
                                <label className="block mb-1 font-medium">Username</label>
                                <input
                                    type="text"
                                    name="username"
                                    className="w-full border p-2 rounded"
                                    value={formData.username}
                                    onChange={handleInputChange}
                                    disabled={!!editingUser}
                                    required
                                />
                            </div>
                            <div className="form-group mb-3">
                                <label className="block mb-1 font-medium">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    className="w-full border p-2 rounded"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group mb-3">
                                <label className="block mb-1 font-medium">Tên hiển thị</label>
                                <input
                                    type="text"
                                    name="displayName"
                                    className="w-full border p-2 rounded"
                                    value={formData.displayName}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group mb-4">
                                <label className="block mb-1 font-medium">
                                    Password {editingUser && <span className="text-sm text-gray-500">(Để trống nếu không đổi)</span>}
                                </label>
                                <input
                                    type="password"
                                    name="password"
                                    className="w-full border p-2 rounded"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    required={!editingUser}
                                />
                            </div>
                            <div className="modal-actions flex justify-end gap-2">
                                <button
                                    type="button"
                                    className="btn-cancel px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                                    onClick={() => setIsModalOpen(false)}
                                >
                                    Hủy
                                </button>
                                <button type="submit" className="btn-submit px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                                    Lưu
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminUsersPage;