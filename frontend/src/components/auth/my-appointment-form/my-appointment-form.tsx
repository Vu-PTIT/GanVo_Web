import { useEffect, useState } from "react";
import axiosInstance from "../../../lib/axios";
import "./my-appointment-form.css";
import { toast } from "sonner";
import MapPickerLeaflet from "../../appointment-form/MapPickerLeaflet";

const MyAppointmentForm = () => {
    const [appointments, setAppointments] = useState<any[]>([]);
    const [selected, setSelected] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [editing, setEditing] = useState<any | null>(null);

    const fetchAppointments = async () => {
        try {
            setLoading(true);
            const res = await axiosInstance.get("/appointments/me");
            setAppointments(res.data);
            // Auto-select first appointment if available
            if (res.data && res.data.length > 0 && !selected) {
                setSelected(res.data[0]);
            }
        } catch (err) {
            toast.error("Không thể tải lịch hẹn!");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("Bạn chắc chắn muốn hủy lịch hẹn này?")) return;
        try {
            await axiosInstance.delete(`/appointments/${id}`);
            toast.success("Đã hủy lịch hẹn!");
            const newList = appointments.filter((a) => a._id !== id);
            setAppointments(newList);
            if (selected?._id === id) {
                setSelected(newList.length > 0 ? newList[0] : null);
            }
        } catch {
            toast.error("Không thể hủy!");
        }
    };

    const handleUpdate = async () => {
        try {
            await axiosInstance.put(`/appointments/${editing._id}`, editing);
            toast.success("Đã cập nhật lịch hẹn!");
            setEditing(null);
            fetchAppointments();
        } catch {
            toast.error("Không thể cập nhật!");
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

    return (
        <div className="myapp-content-wrapper">
            {/* Header + Search */}
            <div className="myapp-header-row">
                <h1 className="myapp-title">Lịch Hẹn Của Tôi</h1>
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

            <div className="myapp-layout">
                {/* LEFT COLUMN: LIST */}
                <div className="left-column">
                    <div className="myapp-list-scroll">
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
                                    className={`myapp-item ${selected?._id === a._id ? "active" : ""
                                        }`}
                                    onClick={() => setSelected(a)}
                                >
                                    <div className="myapp-item-header">
                                        <span className="myapp-item-type">{a.type || "Cuộc hẹn"}</span>
                                        <button
                                            className="btn-delete-mini"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDelete(a._id);
                                            }}
                                        >
                                            ✕
                                        </button>
                                    </div>
                                    <div className="myapp-item-row">📍 {a.city || "Chưa có địa điểm"}</div>
                                    <div className="myapp-item-time">{formatDate(a.dateTime)}</div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* RIGHT COLUMN: DETAIL PREVIEW */}
                <div className="myapp-preview">
                    {selected ? (
                        <div className="preview-content">
                            <div className="preview-header">
                                <h2 className="preview-title">{selected.type}</h2>
                                <button
                                    className="btn-edit"
                                    onClick={() => setEditing({ ...selected })}
                                >
                                    ✏️ Sửa
                                </button>
                            </div>

                            {/* MAP CONTAINER */}
                            <div
                                className="map-force-container"
                                style={{
                                    height: "500px",
                                    width: "100%",
                                    position: "relative",
                                    zIndex: 1,
                                    border: "2px solid #e2e8f0",
                                    borderRadius: "12px",
                                    overflow: "hidden",
                                    marginBottom: "20px",
                                }}
                            >
                                <MapPickerLeaflet
                                    key={selected._id}
                                    lat={selected.latitude || 21.0285}
                                    lng={selected.longitude || 105.8542}
                                    onChange={() => { }} // Read-only
                                />
                            </div>

                            <div className="info-grid">
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

            {/* EDIT POPUP */}
            {editing && (
                <div className="popup-overlay">
                    <div className="popup">
                        <h2>Sửa Lịch Hẹn</h2>

                        <label>Ngày giờ</label>
                        <input
                            type="datetime-local"
                            value={editing.dateTime.slice(0, 16)}
                            onChange={(e) =>
                                setEditing({ ...editing, dateTime: e.target.value })
                            }
                        />

                        <label>Địa điểm</label>
                        <input
                            value={editing.city}
                            onChange={(e) => setEditing({ ...editing, city: e.target.value })}
                        />

                        <label>Loại hẹn</label>
                        <select
                            value={editing.type}
                            onChange={(e) => setEditing({ ...editing, type: e.target.value })}
                        >
                            <option value="Cà Phê">Cà Phê</option>
                            <option value="Ăn trưa">Ăn trưa</option>
                            <option value="Ăn tối">Ăn tối</option>
                            <option value="Đi dạo">Đi dạo</option>
                        </select>

                        <label>Lý do</label>
                        <textarea
                            value={editing.reason}
                            onChange={(e) =>
                                setEditing({ ...editing, reason: e.target.value })
                            }
                        />

                        <div className="popup-actions">
                            <button onClick={() => setEditing(null)}>Hủy</button>
                            <button className="save-btn" onClick={handleUpdate}>
                                Lưu
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyAppointmentForm;
