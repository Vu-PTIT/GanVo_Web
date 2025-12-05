// @ts-nocheck
import React, { useEffect, useState } from "react";
import axiosInstance from "../lib/axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

// leaflet
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";

import "./appointment.css"; // dùng lại UI đồng bộ

const markerIcon = new L.Icon({
  iconUrl: "/marker-icon.png",
  iconRetinaUrl: "/marker-icon-2x.png",
  iconAnchor: [12, 41],
});

const ITEMS_PER_PAGE = 5;

const MyAppointmentsPage = () => {
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  // filter
  const [filterType, setFilterType] = useState("");
  const [filterDate, setFilterDate] = useState("");

  // pagination
  const [page, setPage] = useState(1);

  // edit popup
  const [editing, setEditing] = useState(null);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/appointments/me");
      setAppointments(res.data);

      // nếu không có lịch → quay về trang tạo lịch
      if (res.data.length === 0) {
        toast.info("Bạn chưa có lịch hẹn. Hãy tạo mới!");
        setTimeout(() => navigate("/appointment"), 500);
      }

    } catch (err) {
      toast.error("Không thể tải lịch hẹn!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  // FILTER
  const applyFilter = () => {
    let output = [...appointments];

    if (filterType) {
      output = output.filter((a) => a.type === filterType);
    }

    if (filterDate) {
      const f = new Date(filterDate).toDateString();
      output = output.filter(
        (a) => new Date(a.dateTime).toDateString() === f
      );
    }

    return output;
  };

  const filtered = applyFilter();
  const total = filtered.length;
  const maxPage = Math.max(1, Math.ceil(total / ITEMS_PER_PAGE));
  const currentPageData = filtered.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  // DELETE
  const deleteItem = async (id: string) => {
    if (!confirm("Bạn chắc chắn muốn hủy lịch hẹn này?")) return;

    try {
      await axiosInstance.delete(`/appointments/${id}`);
      toast.success("Đã hủy lịch hẹn!");
      fetchAppointments();
    } catch {
      toast.error("Không thể hủy!");
    }
  };

  // SAVE EDIT
  const saveEdit = async () => {
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

  return (
    <div className="app-shell">

      {/* SIDEBAR */}
      <aside className="app-shell__sidebar">
        <div className="app-shell__logo">
          <div className="app-shell__logo-icon">❤</div>
          <span className="app-shell__logo-text">Kết Nối Hẹn Hò</span>
        </div>

        <nav className="sidebar-menu">
          <div className="sidebar-section-title">CHÍNH</div>

          <button
            className="sidebar-item"
            onClick={() => navigate("/appointment")}
          >
            Lên Lịch Hẹn
          </button>

          <button className="sidebar-item sidebar-item--active">
            Lịch Hẹn Của Tôi
          </button>

          <button className="sidebar-item">Thông Tin Cá Nhân</button>
          <button className="sidebar-item">Nhắn Tin</button>
          <button className="sidebar-item">Kết Nối</button>

          <div className="sidebar-section-title sidebar-section-title--mt">
            KHÁC
          </div>

          <button className="sidebar-item">Bảng Điểm</button>
        </nav>
      </aside>

      {/* MAIN */}
      <div className="app-shell__main">

        {/* TOPBAR */}
        <header className="topbar">
          <div></div>
          <div className="topbar__right">
            <button className="topbar__icon-btn">🔔</button>
            <button className="topbar__icon-btn">⚙</button>
            <div className="topbar__avatar">U</div>
          </div>
        </header>

        {/* CONTENT */}
        <main className="appointment-main">

          <h1 className="appointment-title">Lịch Hẹn Của Tôi</h1>

          {/* FILTER */}
          <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
            <input
              type="date"
              className="form-input"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
            />

            <select
              className="form-input"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="">Tất cả loại</option>
              <option value="Cà Phê">Cà Phê</option>
              <option value="Ăn trưa">Ăn trưa</option>
              <option value="Ăn tối">Ăn tối</option>
              <option value="Đi dạo">Đi dạo</option>
            </select>

            <button className="btn btn--primary" onClick={() => setPage(1)}>
              Lọc
            </button>
          </div>

          {/* LIST */}
          {loading ? (
            <p>Đang tải...</p>
          ) : currentPageData.length === 0 ? (
            <p>Không có lịch hẹn</p>
          ) : (
            <div className="myapp-list">
              {currentPageData.map((a) => (
                <div className="myapp-card" key={a._id}>
                  <div className="myapp-info">
                    <div>⏰ {formatDate(a.dateTime)}</div>
                    <div>📍 {a.city}</div>
                    <div>📌 {a.type}</div>
                    <div>💬 {a.reason || "(Không có)"}</div>

                    <button
                      className="btn btn--ghost"
                      onClick={() => setEditing({ ...a })}
                    >
                      Sửa
                    </button>

                    <button
                      className="btn btn--primary"
                      onClick={() => deleteItem(a._id)}
                    >
                      Xóa
                    </button>
                  </div>

                  <div className="myapp-map">
                    <MapContainer
                      center={[a.latitude, a.longitude]}
                      zoom={13}
                      scrollWheelZoom={false}
                      style={{ height: 160, width: "100%", borderRadius: 12 }}
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
            <button
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
              className="btn btn--ghost"
            >
              ◀
            </button>

            <span style={{ padding: "0 10px" }}>
              Trang {page}/{maxPage}
            </span>

            <button
              disabled={page >= maxPage}
              onClick={() => setPage(page + 1)}
              className="btn btn--ghost"
            >
              ▶
            </button>
          </div>
        </main>
      </div>

      {/* POPUP EDIT */}
      {editing && (
        <div className="popup-overlay">
          <div className="popup">
            <h2>Sửa Lịch Hẹn</h2>

            <label>Ngày giờ</label>
            <input
              type="datetime-local"
              className="form-input"
              value={editing.dateTime.slice(0, 16)}
              onChange={(e) =>
                setEditing({ ...editing, dateTime: e.target.value })
              }
            />

            <label>Địa điểm</label>
            <input
              className="form-input"
              value={editing.city}
              onChange={(e) =>
                setEditing({ ...editing, city: e.target.value })
              }
            />

            <label>Loại hẹn</label>
            <select
              className="form-input"
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
              className="form-input"
              value={editing.reason}
              onChange={(e) =>
                setEditing({ ...editing, reason: e.target.value })
              }
            />

            <div className="popup-actions">
              <button className="btn btn--ghost" onClick={() => setEditing(null)}>
                Hủy
              </button>

              <button className="btn btn--primary" onClick={saveEdit}>
                Lưu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyAppointmentsPage;
