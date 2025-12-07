import './dashboard-form.css';
import '../../css/asset.css';
import '../../css/index.css';
import { useEffect, useState } from 'react';

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


const SAMPLE_DATA: DashboardData = {
    stats: [
        { key: 'monthly_matches', title: 'Lượt match tháng này', value: '1,873' },
        { key: 'yearly_matches', title: 'Lượt match năm nay', value: '12,430' },
        { key: 'appointments', title: 'Lịch hẹn đã tạo', value: 398 },
        { key: 'messages_sent', title: 'Tin nhắn đã gửi', value: 8432 },
    ],
    history: [
        { id: 1, content: 'Người dùng mới An Bình đã match với Khải Hoàn.', time: '2 phút trước' },
        { id: 2, content: 'Lâm Anh đã tạo một lịch hẹn vào 10/12.', time: '1 giờ trước' },
        { id: 3, content: 'Thu Hồng đã gửi 3 tin nhắn mới.', time: '3 giờ trước' },
        { id: 3, content: 'Thu Hồng đã gửi 3 tin nhắn mới.', time: '3 giờ trước' },
        { id: 3, content: 'Thu Hồng đã gửi 3 tin nhắn mới.', time: '3 giờ trước' },
        { id: 3, content: 'Thu Hồng đã gửi 3 tin nhắn mới.', time: '3 giờ trước' },
    ],
};


const chartData = [
    { name: "Th1", value: 1400 },
    { name: "Th2", value: 1800 },
    { name: "Th3", value: 2400 },
    { name: "Th4", value: 3100 },
    { name: "Th5", value: 2800 },
    { name: "Th6", value: 3500 },
    { name: "Th7", value: 3900 },
    { name: "Th8", value: 4200 },
    { name: "Th9", value: 4600 },
    { name: "Th10", value: 5000 },
];

export function DashboardForm() {
    const [data, setData] = useState<DashboardData>(SAMPLE_DATA);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;
        async function fetchData() {
            try {
                const res = await fetch('/api/dashboard');
                if (!res.ok) throw new Error('Network response not ok');
                const json = await res.json();
                if (mounted && json && (json.stats || json.history)) {
                    setData(json as DashboardData);
                }
            } catch (err) {
                // fallback sample
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
                                            <AreaChart data={chartData}>
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
