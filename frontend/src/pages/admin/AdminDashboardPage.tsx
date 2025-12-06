import React, { useEffect, useState } from "react";
import axiosInstance from "../../lib/axios";
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

interface MonthlyStat {
    name: string;
    month: number;
    year: number;
    count: number;
}

interface AdminStats {
    totalUsers: number;
    totalAppointments: number;
    usersByMonth: MonthlyStat[];
    appointmentsByMonth: MonthlyStat[];
}

const AdminDashboardPage: React.FC = () => {
    const [stats, setStats] = useState<AdminStats | null>(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await axiosInstance.get("/users/admin/stats");
                setStats(res.data);
            } catch (error) {
                console.error("Failed to fetch stats", error);
            }
        };
        fetchStats();
    }, []);

    if (!stats) {
        return (
            <div className="layout">
                <Header />
                <main id="admin-dashboard">
                    <div className="chat-layout scoll-auto">
                        <AdminSidebar />
                        <div className="flex-1 flex items-center justify-center">
                            Loading...
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

                    <div className="flex-1 bg-base-100 rounded-lg shadow-xl overflow-hidden flex flex-col border border-base-300 h-full">
                        <div className="admin-content-wrapper">
                            <h1 className="admin-title">Dashboard Thống Kê</h1>

                            <div className="dashboard-stats-grid">
                                <div className="stat-card">
                                    <div className="stat-title">Tổng số User</div>
                                    <div className="stat-value">{stats.totalUsers}</div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-title">Tổng số Lịch Hẹn</div>
                                    <div className="stat-value">{stats.totalAppointments}</div>
                                </div>
                            </div>

                            <div className="charts-grid">
                                <div className="chart-container">
                                    <h3 className="chart-title">Người dùng mới (12 tháng qua)</h3>
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

                                <div className="chart-container">
                                    <h3 className="chart-title">Lịch hẹn mới (12 tháng qua)</h3>
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
