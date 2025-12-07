import React, { useEffect, useState } from "react";
import { adminService } from "../../services/adminService";
import type { AdminStats } from "../../services/adminService";
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
                        <div style={{ 
                            flex: 1, 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            height: '100%',
                            background: 'white',
                            borderRadius: '12px'
                        }}>
                            <div style={{ 
                                fontSize: '18px', 
                                color: '#666',
                                animation: 'pulse 1.5s ease-in-out infinite'
                            }}>
                                Đang tải dữ liệu...
                            </div>
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

                    <div style={{
                        flex: 1,
                        background: 'white',
                        borderRadius: '12px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                        border: '1px solid #DEE1E6',
                        height: '100%',
                        padding: '24px'
                    }}>
                        <div style={{
                            width: '100%',
                            height: '100%',
                            overflowY: 'auto'
                        }}>
                            <h1 style={{
                                fontSize: '24px',
                                fontWeight: 'bold',
                                marginBottom: '24px',
                                color: '#171A1F'
                            }}>
                                Dashboard Thống Kê
                            </h1>

                            {/* Stats Cards */}
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                                gap: '20px',
                                marginBottom: '32px'
                            }}>
                                <div style={{
                                    background: '#f8fafc',
                                    padding: '24px',
                                    borderRadius: '12px',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                                    border: '1px solid #e2e8f0'
                                }}>
                                    <div style={{
                                        fontSize: '14px',
                                        color: '#64748b',
                                        fontWeight: '500',
                                        marginBottom: '8px'
                                    }}>
                                        Tổng số User
                                    </div>
                                    <div style={{
                                        fontSize: '32px',
                                        fontWeight: '700',
                                        color: '#0ea5e9'
                                    }}>
                                        {stats.totalUsers}
                                    </div>
                                </div>

                                <div style={{
                                    background: '#f8fafc',
                                    padding: '24px',
                                    borderRadius: '12px',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                                    border: '1px solid #e2e8f0'
                                }}>
                                    <div style={{
                                        fontSize: '14px',
                                        color: '#64748b',
                                        fontWeight: '500',
                                        marginBottom: '8px'
                                    }}>
                                        Tổng số Lịch Hẹn
                                    </div>
                                    <div style={{
                                        fontSize: '32px',
                                        fontWeight: '700',
                                        color: '#10b981'
                                    }}>
                                        {stats.totalAppointments}
                                    </div>
                                </div>
                            </div>

                            {/* Charts */}
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
                                gap: '24px'
                            }}>
                                {/* User Chart */}
                                <div style={{
                                    background: 'white',
                                    padding: '24px',
                                    borderRadius: '12px',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                                    border: '1px solid #e2e8f0'
                                }}>
                                    <h3 style={{
                                        fontSize: '18px',
                                        fontWeight: '600',
                                        marginBottom: '24px',
                                        textAlign: 'center',
                                        color: '#171A1F'
                                    }}>
                                        Người dùng mới (12 tháng qua)
                                    </h3>
                                    <div style={{ width: "100%", height: 300 }}>
                                        <ResponsiveContainer>
                                            <BarChart data={stats.usersByMonth}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="name" />
                                                <YAxis allowDecimals={false} />
                                                <Tooltip />
                                                <Legend />
                                                <Bar dataKey="count" name="User mới" fill="#0ea5e9" />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>

                                {/* Appointment Chart */}
                                <div style={{
                                    background: 'white',
                                    padding: '24px',
                                    borderRadius: '12px',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                                    border: '1px solid #e2e8f0'
                                }}>
                                    <h3 style={{
                                        fontSize: '18px',
                                        fontWeight: '600',
                                        marginBottom: '24px',
                                        textAlign: 'center',
                                        color: '#171A1F'
                                    }}>
                                        Lịch hẹn mới (12 tháng qua)
                                    </h3>
                                    <div style={{ width: "100%", height: 300 }}>
                                        <ResponsiveContainer>
                                            <BarChart data={stats.appointmentsByMonth}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="name" />
                                                <YAxis allowDecimals={false} />
                                                <Tooltip />
                                                <Legend />
                                                <Bar dataKey="count" name="Lịch hẹn" fill="#10b981" />
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