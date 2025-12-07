import React, { useEffect, useState } from "react";
import { adminService, AdminStats } from "../../services/adminService";
import { Header } from "../../components/auth/header";
import { AdminSidebar } from "../../components/admin/AdminSidebar";
import "./admin-dashboard.css";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend
} from "recharts";

const AdminDashboardPage: React.FC = () => {
    const [stats, setStats] = useState<AdminStats | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Use the service instead of direct axios call
                const data = await adminService.getStats();
                setStats(data);
            } catch (error) {
                console.error("Failed to fetch stats", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading || !stats) {
        return (
            <div className="layout">
                <Header />
                <main id="admin-dashboard">
                    <div className="chat-layout scoll-auto">
                        <AdminSidebar />
                        <div className="flex-1 flex items-center justify-center h-full">
                            <div className="loading loading-spinner loading-lg"></div>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="layout">
            <Header />
            <main id="admin-dashboard">
                <div className="chat-layout scoll-auto">
                    <AdminSidebar />

                    <div className="flex-1 bg-base-100 rounded-lg shadow-xl overflow-hidden flex flex-col border border-base-300 h-full p-6">
                        <div className="admin-content-wrapper w-full h-full overflow-y-auto">
                            <h1 className="text-2xl font-bold mb-6 text-base-content">Dashboard Thống Kê</h1>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                <div className="stat bg-base-200 rounded-box shadow">
                                    <div className="stat-title">Tổng số User</div>
                                    <div className="stat-value text-primary">{stats.totalUsers}</div>
                                </div>
                                <div className="stat bg-base-200 rounded-box shadow">
                                    <div className="stat-title">Tổng số Lịch Hẹn</div>
                                    <div className="stat-value text-secondary">{stats.totalAppointments}</div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <div className="bg-base-100 p-4 rounded-box shadow border border-base-200">
                                    <h3 className="text-lg font-semibold mb-4 text-center">Người dùng mới (12 tháng qua)</h3>
                                    <div style={{ width: "100%", height: 300 }}>
                                        <ResponsiveContainer>
                                            <BarChart data={stats.usersByMonth}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="name" />
                                                <YAxis allowDecimals={false} />
                                                <Tooltip />
                                                <Legend />
                                                <Bar dataKey="count" name="User mới" fill="#8884d8" />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>

                                <div className="bg-base-100 p-4 rounded-box shadow border border-base-200">
                                    <h3 className="text-lg font-semibold mb-4 text-center">Lịch hẹn mới (12 tháng qua)</h3>
                                    <div style={{ width: "100%", height: 300 }}>
                                        <ResponsiveContainer>
                                            <BarChart data={stats.appointmentsByMonth}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="name" />
                                                <YAxis allowDecimals={false} />
                                                <Tooltip />
                                                <Legend />
                                                <Bar dataKey="count" name="Lịch hẹn" fill="#82ca9d" />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboardPage;