import './dashboard-form.css';
import '../../../assets/css/asset.css';
import '../../../assets/css/index.css';
import { useEffect, useState } from 'react';
import { dashboardService, type DashboardOverviewResponse } from '../../../services/dashboardService';

// === BIỂU ĐỒ ===
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

type StatItem = { key: string; title: string; value: number | string };
type HistoryItem = { id: string | number; content: string; time: string };

type DashboardData = {
    stats: StatItem[];
    history: HistoryItem[];
};



export function DashboardForm() {
    const [data, setData] = useState<DashboardData>({ stats: [], history: [] });
    const [chartDataState, setChartDataState] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let mounted = true;

        async function fetchData() {
            try {
                setLoading(true);
                setError(null);

                // Gọi API để lấy dữ liệu
                const res: DashboardOverviewResponse = await dashboardService.getOverview();

                if (mounted) {
                    // Map stats từ API response
                    const newStats: StatItem[] = [
                        { key: 'monthly_matches', title: 'Lượt match tháng này', value: res.stats.matchesThisMonth },
                        { key: 'yearly_matches', title: 'Lượt match năm nay', value: res.stats.matchesThisYear },
                        { key: 'appointments', title: 'Lịch hẹn đã tạo', value: res.stats.appointmentsCreated },
                        { key: 'messages_sent', title: 'Tin nhắn đã gửi', value: res.stats.messagesSent },
                    ];

                    // Map history (activities) từ API response
                    const newHistory: HistoryItem[] = res.activities.map((act, index) => ({
                        id: act.id || index,
                        content: `${act.user} ${act.action}`,
                        time: act.time
                    }));

                    setData({
                        stats: newStats,
                        history: newHistory
                    });

                    // Map chart data - hiển thị số lượng matches
                    const newChartData = res.chartData.map(c => ({
                        name: c.name,
                        value: c.matches,
                        appointments: c.appointments
                    }));
                    setChartDataState(newChartData);
                }
            } catch (err) {
                console.error("Failed to fetch dashboard data:", err);
                if (mounted) {
                    setError("Không thể tải dữ liệu dashboard");
                }
            } finally {
                if (mounted) setLoading(false);
            }
        }

        fetchData();
        return () => {
            mounted = false;
        };
    }, []);

    return (
        <div className="container container-1000">
            <div className="dashboard-form">
                <div className="cont-title-dashboard">
                    <h1>Tổng quan Dashboard</h1>
                </div>

                {error && (
                    <div style={{
                        padding: '12px 20px',
                        background: '#fee',
                        color: '#c33',
                        borderRadius: '8px',
                        marginBottom: '20px',
                        textAlign: 'center'
                    }}>
                        {error}
                    </div>
                )}

                <div className="cont-content-dashboard">
                    <div className="dashboard-content-01">
                        <div className="row">
                            {data.stats.map((s) => (
                                <div className="large-3" key={s.key}>
                                    <div className="col-inner">
                                        <div className="title">{s.title}</div>
                                        <div className="number">{loading ? '—' : s.value}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="dashboard-content-02">
                        <div className="row">
                            <div className="large-6">
                                <div className="col-inner item-01">
                                    <div className="title">Xu hướng Lượt match & Lịch hẹn</div>

                                    <div style={{ width: "100%", height: 280 }}>
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart data={chartDataState}>
                                                <defs>
                                                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="30%" stopColor="#4A90E2" stopOpacity={0.5} />
                                                        <stop offset="90%" stopColor="#4A90E2" stopOpacity={0} />
                                                    </linearGradient>
                                                </defs>

                                                <XAxis dataKey="name" />
                                                <YAxis />
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <Tooltip />

                                                <Area
                                                    type="monotone"
                                                    dataKey="value"
                                                    stroke="#4A90E2"
                                                    fill="url(#colorValue)"
                                                    name="Lượt match"
                                                />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </div>
                            <div className="large-6">
                                <div className="col-inner item-01">
                                    <div className="title">Hoạt động gần đây</div>
                                    <div className="history-cont">
                                        {data.history.length === 0 ? (
                                            <div className="history-empty">Không có hoạt động</div>
                                        ) : (
                                            data.history.map((h) => (
                                                <div className="history-item" key={h.id}>
                                                    <div className="content">{h.content}</div>
                                                    <div className="time">{h.time}</div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </div>



                        </div>
                    </div>


                </div>
            </div>
        </div>
    );
}
