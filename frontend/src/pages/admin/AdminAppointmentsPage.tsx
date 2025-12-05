// GanVo_Web\frontend\src\pages\admin\AdminAppointmentsPage.tsx
import React, { useEffect, useMemo, useState } from "react";
import axiosInstance from "../../lib/axios";
import "../appointment.css";
import MapPickerLeaflet from "../../components/appointment-form/MapPickerLeaflet";
import { toast } from "sonner";

type Appointment = {
  _id: string;
  city: string;
  type: string;
  reason?: string;
  dateTime: string;
  latitude: number;
  longitude: number;
  userId?: {
    _id: string;
    username?: string;
    displayName?: string;
    email?: string;
  };
};

const ITEMS_PER_PAGE = 6;

const AdminAppointmentsPage: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selected, setSelected] = useState<Appointment | null>(null);

  // --- FILTER STATE ---
  const [searchUser, setSearchUser] = useState<string>("");   // tìm theo displayName / username / email
  const [filterType, setFilterType] = useState<string>("");   // lọc theo loại hẹn
  const [filterDate, setFilterDate] = useState<string>("");   // lọc theo ngày (yyyy-mm-dd)

  // --- PAGINATION ---
  const [page, setPage] = useState<number>(1);

  // --------------------------------
  // 1. FETCH DATA
  // --------------------------------
  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get<Appointment[]>("/appointments");
      setAppointments(res.data || []);
      // nếu chưa có selected thì chọn cái đầu cho map
      if (res.data && res.data.length > 0) {
        setSelected(res.data[0]);
      } else {
        setSelected(null);
      }
    } catch (error) {
      console.error(error);
      toast.error("Không thể tải danh sách lịch hẹn!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  // --------------------------------
  // 2. FILTER CLIENT-SIDE
  // --------------------------------
  const filteredAppointments = useMemo(() => {
    let list = [...appointments];

    // lọc theo loại hẹn
    if (filterType) {
      list = list.filter((a) => a.type === filterType);
    }

    // lọc theo ngày (so sánh phần date yyyy-mm-dd)
    if (filterDate) {
      list = list.filter((a) => {
        const d = new Date(a.dateTime);
        const isoDate = d.toISOString().slice(0, 10); // yyyy-mm-dd
        return isoDate === filterDate;
      });
    }

    // search theo user (tên / username / email)
    if (searchUser.trim()) {
      const keyword = searchUser.trim().toLowerCase();
      list = list.filter((a) => {
        const name = a.userId?.displayName || "";
        const username = a.userId?.username || "";
        const email = a.userId?.email || "";
        return (
          name.toLowerCase().includes(keyword) ||
          username.toLowerCase().includes(keyword) ||
          email.toLowerCase().includes(keyword)
        );
      });
    }

    return list;
  }, [appointments, filterType, filterDate, searchUser]);

  // reset trang về 1 khi filter thay đổi
  useEffect(() => {
    setPage(1);
  }, [filterType, filterDate, searchUser]);

  // --------------------------------
  // 3. PAGINATION
  // --------------------------------
  const totalItems = filteredAppointments.length;
  const maxPage = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE));
  const currentPage = Math.min(page, maxPage);

  const pagedAppointments = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAppointments.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredAppointments, currentPage]);

  // --------------------------------
  // 4. ACTIONS
  // --------------------------------
  const deleteAppointment = async (id: string) => {
    if (!window.confirm("Xác nhận xóa lịch hẹn?")) return;
    try {
      await axiosInstance.delete(`/appointments/${id}`);
      toast.success("Đã xóa lịch hẹn");
      await fetchAppointments();
    } catch (error) {
      console.error(error);
      toast.error("Không thể xóa lịch hẹn");
    }
  };

  const handleViewAllOfUser = (userId?: Appointment["userId"]) => {
    if (!userId) return;
    const key =
      userId.displayName || userId.username || userId.email || "";
    if (!key) return;
    setSearchUser(key);
    setPage(1);
  };

  const formatDateTime = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleString("vi-VN");
  };

  // --------------------------------
  // 5. RENDER
  // --------------------------------
  return (
    <div className="app-shell">
      {/* SIDEBAR (giữ giống appointment) */}
      <aside className="app-shell__sidebar">
        <div className="app-shell__logo">
          <div className="app-shell__logo-icon">⚙</div>
          <span className="app-shell__logo-text">Admin Lịch Hẹn</span>
        </div>

        <nav className="sidebar-menu">
          <div className="sidebar-section-title">QUẢN TRỊ</div>
          <button className="sidebar-item sidebar-item--active">
            <span className="sidebar-item__text">Quản lý lịch hẹn</span>
          </button>
          <button className="sidebar-item">
            <span className="sidebar-item__text">Báo cáo (coming soon)</span>
          </button>
        </nav>
      </aside>

      {/* MAIN */}
      <div className="app-shell__main">
        {/* TOP BAR */}
        <header className="topbar">
          <div className="topbar__left">
            <h1 style={{ fontSize: 18, fontWeight: 600 }}>
              Bảng Điều Khiển Lịch Hẹn
            </h1>
          </div>
          <div className="topbar__right">
            <button className="topbar__icon-btn">🔍</button>
            <button className="topbar__icon-btn">⚙</button>
          </div>
        </header>

        {/* CONTENT */}
        <main className="appointment-main">
          {/* HEADER + FILTER */}
          <div className="appointment-header">
            <h2 className="appointment-title">Tất Cả Lịch Hẹn</h2>
            <p className="appointment-subtitle">
              Xem, lọc và quản lý lịch hẹn của tất cả người dùng.
            </p>
          </div>

          {/* FILTER BAR */}
          <div
            style={{
              display: "flex",
              gap: 12,
              marginBottom: 16,
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            {/* search user */}
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <label className="form-label">Tìm theo user</label>
              <input
                className="form-input"
                placeholder="Tên hiển thị / username / email"
                value={searchUser}
                onChange={(e) => setSearchUser(e.target.value)}
                style={{ minWidth: 220 }}
              />
            </div>

            {/* filter date */}
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <label className="form-label">Lọc theo ngày</label>
              <input
                type="date"
                className="form-input"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
              />
            </div>

            {/* filter type */}
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <label className="form-label">Loại cuộc hẹn</label>
              <select
                className="form-input"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="">Tất cả</option>
                <option value="Cà Phê">Cà Phê</option>
                <option value="Ăn trưa">Ăn trưa</option>
                <option value="Ăn tối">Ăn tối</option>
                <option value="Đi dạo">Đi dạo</option>
              </select>
            </div>

            {/* reset filter */}
            <div style={{ marginTop: 20 }}>
              <button
                className="btn btn--ghost"
                type="button"
                onClick={() => {
                  setSearchUser("");
                  setFilterDate("");
                  setFilterType("");
                }}
              >
                Xóa bộ lọc
              </button>
            </div>

            <div style={{ marginLeft: "auto", fontSize: 13, color: "#6b7280" }}>
              Tổng: <b>{totalItems}</b> lịch hẹn
            </div>
          </div>

          {/* LAYOUT LIST + MAP (dùng grid giống appointment) */}
          <div className="appointment-layout">
            {/* LEFT: LIST */}
            <section className="card card--map">
              <div className="card__header">
                <h3 className="card__title">Danh sách lịch hẹn</h3>
                <p className="card__subtitle">
                  Chọn một lịch hẹn để xem vị trí và chi tiết bên phải.
                </p>
              </div>

              {loading ? (
                <p>Đang tải...</p>
              ) : pagedAppointments.length === 0 ? (
                <p>Không có lịch hẹn phù hợp với bộ lọc.</p>
              ) : (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                    overflowY: "auto",
                  }}
                >
                  {pagedAppointments.map((a) => (
                    <div
                      key={a._id}
                      style={{
                        borderRadius: 12,
                        border:
                          selected?._id === a._id
                            ? "1px solid #0ea5e9"
                            : "1px solid #e5e7eb",
                        padding: 10,
                        display: "flex",
                        gap: 8,
                        alignItems: "flex-start",
                        backgroundColor:
                          selected?._id === a._id ? "#eff6ff" : "#ffffff",
                        cursor: "pointer",
                      }}
                      onClick={() => setSelected(a)}
                    >
                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            fontSize: 14,
                            fontWeight: 600,
                            marginBottom: 2,
                          }}
                        >
                          {a.city}
                        </div>
                        <div
                          style={{
                            fontSize: 12,
                            color: "#6b7280",
                            marginBottom: 4,
                          }}
                        >
                          {formatDateTime(a.dateTime)} • {a.type}
                        </div>
                        <div style={{ fontSize: 12, color: "#4b5563" }}>
                          👤{" "}
                          {a.userId?.displayName ||
                            a.userId?.username ||
                            "(Không rõ user)"}
                        </div>
                        {a.reason && (
                          <div
                            style={{
                              marginTop: 3,
                              fontSize: 12,
                              color: "#6b7280",
                            }}
                          >
                            💬 {a.reason}
                          </div>
                        )}
                      </div>

                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 4,
                          alignItems: "flex-end",
                        }}
                      >
                        <button
                          className="btn btn--ghost"
                          type="button"
                          style={{ fontSize: 11, padding: "4px 8px" }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewAllOfUser(a.userId);
                          }}
                        >
                          Xem tất cả của user
                        </button>

                        <button
                          className="btn btn--primary"
                          type="button"
                          style={{
                            fontSize: 11,
                            padding: "4px 10px",
                            backgroundColor: "#ef4444",
                            boxShadow: "none",
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteAppointment(a._id);
                          }}
                        >
                          Xóa
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* PAGINATION */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: 10,
                  fontSize: 12,
                }}
              >
                <div>
                  Trang {currentPage}/{maxPage}
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    className="btn btn--ghost"
                    type="button"
                    disabled={currentPage <= 1}
                    onClick={() =>
                      setPage((p) => (p > 1 ? p - 1 : p))
                    }
                  >
                    ◀
                  </button>
                  <button
                    className="btn btn--ghost"
                    type="button"
                    disabled={currentPage >= maxPage}
                    onClick={() =>
                      setPage((p) => (p < maxPage ? p + 1 : p))
                    }
                  >
                    ▶
                  </button>
                </div>
              </div>
            </section>

            {/* RIGHT: MAP PREVIEW */}
            <section className="card card--detail">
              <div className="card__header">
                <h3 className="card__title">Vị trí trên bản đồ</h3>
                <p className="card__subtitle">
                  Bản đồ hiển thị vị trí chi tiết của lịch hẹn đang chọn.
                </p>
              </div>

              {selected ? (
                <>
                  <div className="map-wrapper">
                    <MapPickerLeaflet
                      lat={selected.latitude}
                      lng={selected.longitude}
                      onChange={() => {}}
                    />
                  </div>

                  <div style={{ marginTop: 10, fontSize: 13 }}>
                    <div>
                      <b>Địa điểm:</b> {selected.city}
                    </div>
                    <div>
                      <b>Thời gian:</b>{" "}
                      {formatDateTime(selected.dateTime)}
                    </div>
                    <div>
                      <b>Loại cuộc hẹn:</b> {selected.type}
                    </div>
                    <div>
                      <b>Người tạo:</b>{" "}
                      {selected.userId?.displayName ||
                        selected.userId?.username ||
                        "(Không rõ)"}
                    </div>
                    {selected.reason && (
                      <div style={{ marginTop: 4 }}>
                        <b>Lý do:</b> {selected.reason}
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <p>Chọn một lịch hẹn ở danh sách bên trái để xem chi tiết...</p>
              )}
            </section>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminAppointmentsPage;
