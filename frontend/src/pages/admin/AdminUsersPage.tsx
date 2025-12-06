import React, { useEffect, useState } from "react";
import axiosInstance from "../../lib/axios";
import type { User } from "../../types/user";
import "./admin-users.css";
import { Header } from "../../components/auth/header";
import { AdminSidebar } from "../../components/admin/AdminSidebar";

interface UserFormData {
    username: string;
    email: string;
    displayName: string;
    password?: string;
}

const AdminUsersPage: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [formData, setFormData] = useState<UserFormData>({
        username: "",
        email: "",
        displayName: "",
        password: "",
    });
    const [error, setError] = useState("");

    const fetchUsers = async () => {
        try {
            const res = await axiosInstance.get("/users/admin/users");
            setUsers(res.data);
        } catch (err) {
            console.error("Failed to fetch users", err);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

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
            password: "", // Don't show password
        });
        setError("");
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        try {
            if (editingUser) {
                // Update
                await axiosInstance.put(`/users/admin/users/${editingUser._id}`, formData);
            } else {
                // Create
                await axiosInstance.post("/users/admin/users", formData);
            }
            setIsModalOpen(false);
            fetchUsers();
        } catch (err: any) {
            setError(err.response?.data?.message || "Có lỗi xảy ra");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Bạn có chắc chắn muốn xóa user này?")) return;
        try {
            await axiosInstance.delete(`/users/admin/users/${id}`);
            fetchUsers();
        } catch (err) {
            console.error("Failed to delete user", err);
            alert("Không thể xóa user");
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
                        <div className="admin-content-wrapper">
                            <div className="admin-header">
                                <h1 className="admin-page-title">Quản lý User</h1>
                                <button className="btn-add-user" onClick={openAddModal}>
                                    + Thêm User
                                </button>
                            </div>

                            <div className="table-container">
                                <table className="users-table">
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
                                                    <div className="action-buttons">
                                                        <button
                                                            className="btn-edit"
                                                            onClick={() => openEditModal(user)}
                                                        >
                                                            Sửa
                                                        </button>
                                                        <button
                                                            className="btn-delete"
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
                                                <td colSpan={4} style={{ textAlign: "center" }}>
                                                    Chưa có user nào
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

            {/* MODAL */}
            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2 className="modal-title">
                            {editingUser ? "Sửa User" : "Thêm User Mới"}
                        </h2>
                        {error && <p style={{ color: "red", marginBottom: "10px" }}>{error}</p>}
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Username</label>
                                <input
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleInputChange}
                                    disabled={!!editingUser} // Cannot change username when editing
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Tên hiển thị</label>
                                <input
                                    type="text"
                                    name="displayName"
                                    value={formData.displayName}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Password {editingUser && "(Để trống nếu không đổi)"}</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    required={!editingUser} // Required when creating
                                />
                            </div>
                            <div className="modal-actions">
                                <button
                                    type="button"
                                    className="btn-cancel"
                                    onClick={() => setIsModalOpen(false)}
                                >
                                    Hủy
                                </button>
                                <button type="submit" className="btn-submit">
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
