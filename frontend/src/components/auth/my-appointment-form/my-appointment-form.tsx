import React, { useEffect, useState } from "react";
import axiosInstance from "../../../lib/axios";
import "./my-appointment-form.css";
import { toast } from "sonner";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";

// icon leaflet fix
const markerIcon = new L.Icon({
    iconUrl: "/marker-icon.png",
    iconRetinaUrl: "/marker-icon-2x.png",
    iconAnchor: [12, 41],
});

const ITEMS_PER_PAGE = 5;

const MyAppointmentForm = () => {
    const [appointments, setAppointments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // filter
    const [filterType, setFilterType] = useState("");
    const [filterDate, setFilterDate] = useState("");

    // pagination
    const [page, setPage] = useState(1);

    // popup edit
    const [editing, setEditing] = useState<any | null>(null);

    const fetchAppointments = async () => {
        try {
            setLoading(true);
            const res = await axiosInstance.get("/appointments/me");
            setAppointments(res.data);
        } catch (err) {
            toast.error("Không thể tải lịch hẹn!");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Bạn chắc chắn muốn hủy lịch hẹn này?")) return;
        try {
            await axiosInstance.delete(`/appointments/${id}`);
            toast.success("Đã hủy lịch hẹn!");
            fetchAppointments();
        } catch {
            toast.error("Không thể hủy!");
        }
    };

    const applyFilter = () => {
        let filtered = [...appointments];

        if (filterType) {
            filtered = filtered.filter((a) => a.type === filterType);
        }

        if (filterDate) {
            const f = new Date(filterDate).toDateString();
            filtered = filtered.filter(
                (a) => new Date(a.dateTime).toDateString() === f
            );
        }

        return filtered;
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

    const filtered = applyFilter();
    const total = filtered.length;
    const maxPage = Math.ceil(total / ITEMS_PER_PAGE);
    const show = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

    return (
        <div className="myapp-shell">
            <h1 className="myapp-title">Lịch Hẹn Của Tôi</h1>

            {/* FILTER */}
            <div className="myapp-filter">
                <input
                    type="date"
                    value={filterDate}
                    onChange={(e) => setFilterDate(e.target.value)}
                />

                <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                >
                    <option value="">Tất cả loại</option>
                    <option value="Cà Phê">Cà Phê</option>
                    <option value="Ăn trưa">Ăn trưa</option>
                    <option value="Ăn tối">Ăn tối</option>
                    <option value="Đi dạo">Đi dạo</option>
                </select>

                <button onClick={() => setPage(1)}>Lọc</button>
            </div>

            {/* LIST */}
            {loading ? (
                <p>Đang tải...</p>
            ) : show.length === 0 ? (
                <p>Không có lịch hẹn</p>
            ) : (
                <div className="myapp-list">
                    {show.map((a) => (
                        <div className="myapp-card" key={a._id}>
                            <div className="myapp-info">
                                <div>⏰ {formatDate(a.dateTime)}</div>
                                <div>📍 {a.city}</div>
                                <div>📌 {a.type}</div>
                                <div>💬 {a.reason || "(Không có)"}</div>

                                <button
                                    className="edit-btn"
                                    onClick={() => setEditing({ ...a })}
                                >
                                    Sửa
                                </button>

                                <button
                                    className="delete-btn"
                                    onClick={() => handleDelete(a._id)}
                                >
                                    Xóa
                                </button>
                            </div>

                            {/* mini map */}
                            <div className="myapp-map">
                                <MapContainer
                                    center={[a.latitude, a.longitude]}
                                    zoom={13}
                                    scrollWheelZoom={false}
                                >
                                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                    <Marker
                                        position={[a.latitude, a.longitude]}
                                        icon={markerIcon}
                                    />
                                </MapContainer>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* PAGINATION */}
            <div className="myapp-pagination">
                <button disabled={page <= 1} onClick={() => setPage(page - 1)}>
                    ◀
                </button>
                <span>
                    Trang {page}/{maxPage}
                </span>
                <button disabled={page >= maxPage} onClick={() => setPage(page + 1)}>
                    ▶
                </button>
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
                            onChange={(e) =>
                                setEditing({ ...editing, city: e.target.value })
                            }
                        />

                        <label>Loại hẹn</label>
                        <select
                            value={editing.type}
                            onChange={(e) =>
                                setEditing({ ...editing, type: e.target.value })
                            }
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
