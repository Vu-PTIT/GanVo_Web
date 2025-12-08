import { useEffect, useState } from "react";
import axiosInstance from "../../../lib/axios";
import "./other-appointment-form.css";
import { toast } from "sonner";
import MapPickerLeaflet from "./appointment-form/MapPickerLeaflet";

const OtherAppointmentForm = () => {
    const [appointments, setAppointments] = useState<any[]>([]);
    const [selected, setSelected] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [connectedIds, setConnectedIds] = useState<string[]>([]);
    const [connecting, setConnecting] = useState(false);

    const fetchAppointments = async () => {
        try {
            setLoading(true);
            const res = await axiosInstance.get("/appointments/others");
            setAppointments(res.data);
            // Auto-select first appointment if available
            if (res.data && res.data.length > 0 && !selected) {
                setSelected(res.data[0]);
            }
        } catch (err) {
            toast.error("Không thể tải danh sách lịch hẹn!");
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (iso: string) => {
        const d = new Date(iso);
        return d.toLocaleString("vi-VN");
    };

    useEffect(() => {
        fetchAppointments();
    }, []);

    // Filter appointments based on search term
    const filteredList = appointments.filter((a) => {
        const s = searchTerm.toLowerCase();
        return (
            (a.type || "").toLowerCase().includes(s) ||
            (a.city || "").toLowerCase().includes(s) ||
            (a.reason || "").toLowerCase().includes(s)
        );
    });


    const handleToggleConnect = async () => {
        if (!selected) {
            console.log('No appointment selected');
            return;
        }

        if (!selected.userId || !selected.userId._id) {
            console.log('Missing userId data:', selected.userId);
            toast.error("Không thể kết nối: Thiếu thông tin người dùng!");
            return;
        }

        if (connecting) {
            console.log('Already connecting, please wait');
            return;
        }

        const isConnected = connectedIds.includes(selected._id);
        console.log('Toggle connect - Current state:', isConnected, 'Appointment ID:', selected._id, 'User ID:', selected.userId._id);

        setConnecting(true);
        try {
            if (isConnected) {
                // Disconnect - remove from array
                setConnectedIds(connectedIds.filter(id => id !== selected._id));
                console.log('Disconnected successfully');
                toast.success("Đã hủy kết nối!");
            } else {
                // Connect - call API and add to array
                console.log('Calling API to connect...');
                await axiosInstance.post("/match/swipe", {
                    targetUserId: selected.userId._id,
                    action: "like",
                });
                setConnectedIds([...connectedIds, selected._id]);
                console.log('Connected successfully');
                toast.success(`Đã kết nối với ${selected.userId.displayName || "người này"}!`);
            }
        } catch (error: any) {
            console.error('Connection error:', error);
            toast.error(error.response?.data?.message || "Không thể thực hiện!");
        } finally {
            setConnecting(false);
        }
    };

    return (
        <div className="otherapp-content-wrapper">
            {/* Header + Search */}
            <div className="otherapp-header-row">
                <h1 className="otherapp-title">Lịch Hẹn Cộng Đồng</h1>
                <div className="search-box-wrapper">
                    <input
                        type="text"
                        placeholder="Tìm kiếm..."
                        className="search-input-top"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <span className="search-count">{filteredList.length} kết quả</span>
                </div>
            </div>

            <div className="otherapp-layout">
                {/* LEFT COLUMN: LIST */}
                <div className="left-column">
                    <div className="otherapp-list-scroll">
                        {loading ? (
                            <div className="p-4 text-center text-gray-500">Đang tải...</div>
                        ) : filteredList.length === 0 ? (
                            <div className="p-4 text-center text-gray-500">
                                Không tìm thấy kết quả
                            </div>
                        ) : (
                            filteredList.map((a) => (
                                <div
                                    key={a._id}
                                    className={`otherapp-item ${selected?._id === a._id ? "active" : ""
                                        }`}
                                    onClick={() => setSelected(a)}
                                >
                                    <div className="otherapp-item-header">
                                        <span className="otherapp-item-type">{a.type || "Cuộc hẹn"}</span>
                                        <span style={{ fontSize: "12px", color: "#64748b" }}>
                                            bởi {a.userId?.displayName || a.userId?.username || "Ẩn danh"}
                                        </span>
                                    </div>
                                    <div className="otherapp-item-row">📍 {a.city || "Chưa có địa điểm"}</div>
                                    <div className="otherapp-item-time">{formatDate(a.dateTime)}</div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* RIGHT COLUMN: DETAIL PREVIEW */}
                <div className="otherapp-preview">
                    {selected ? (
                        <div className="preview-content">
                            <div className="preview-header">
                                <h2 className="preview-title">{selected.type}</h2>
                                <button
                                    className={`btn-like-connect ${connectedIds.includes(selected._id) ? 'connected' : ''}`}
                                    onClick={handleToggleConnect}
                                    disabled={connecting}
                                >
                                    {connecting
                                        ? '⏳ Đang xử lý...'
                                        : connectedIds.includes(selected._id)
                                            ? '✓ Đã kết nối'
                                            : '❤️ Kết nối'
                                    }
                                </button>
                            </div>

                            {/* MAP CONTAINER */}
                            <div
                                className="map-force-container">
                                <MapPickerLeaflet
                                    key={selected._id}
                                    lat={selected.latitude || 21.0285}
                                    lng={selected.longitude || 105.8542}
                                    onChange={() => { }} // Read-only
                                />
                            </div>

                            <div className="info-grid">
                                <div className="info-box">
                                    <label>Người tạo</label>
                                    <span>{selected.userId?.displayName || selected.userId?.username || "Ẩn danh"}</span>
                                </div>
                                <div className="info-box">
                                    <label>Email liên hệ</label>
                                    <span>{selected.userId?.email || "Chưa cập nhật"}</span>
                                </div>
                                <div className="info-box">
                                    <label>Thời gian</label>
                                    <span>{formatDate(selected.dateTime)}</span>
                                </div>
                                <div className="info-box">
                                    <label>Địa điểm</label>
                                    <span>{selected.city}</span>
                                </div>
                                <div className="info-box full-width">
                                    <label>Lý do / Ghi chú</label>
                                    <span>{selected.reason || "Không có ghi chú"}</span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="empty-state">Chọn một lịch hẹn để xem chi tiết</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OtherAppointmentForm;
