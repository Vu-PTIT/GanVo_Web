import React, { useEffect, useState } from "react";
import axiosInstance from "../../lib/axios";
import "./admin-appointments.css";
import MapPickerLeaflet from "../../components/appointment-form/MapPickerLeaflet";
import { Header } from "../../components/auth/header";
import { AdminSidebar } from "../../components/admin/AdminSidebar";

const AdminAppointmentsPage: React.FC = () => {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(""); // State tìm kiếm

  // --- LẤY DỮ LIỆU ---
  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/appointments");
      setAppointments(res.data);
      // Mặc định chọn cái đầu tiên nếu có
      if (res.data && res.data.length > 0 && !selected) {
        setSelected(res.data[0]);
      }
    } catch (error) {
      console.error("Lỗi lấy lịch hẹn:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  // --- XÓA LỊCH HẸN ---
  const deleteAppointment = async (id: string) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa?")) return;
    try {
      await axiosInstance.delete(`/appointments/${id}`);
      const newList = appointments.filter((a) => a._id !== id);
      setAppointments(newList);
      if (selected?._id === id) {
        setSelected(newList.length > 0 ? newList[0] : null);
      }
    } catch (error) {
      alert("Xóa thất bại");
    }
  };

  // --- LỌC TÌM KIẾM ---
  const filteredList = appointments.filter((a) => {
    const s = searchTerm.toLowerCase();
    return (
      (a.type || "").toLowerCase().includes(s) ||
      (a.city || "").toLowerCase().includes(s) ||
      (a.userId?.displayName || "").toLowerCase().includes(s) ||
      (a.description || "").toLowerCase().includes(s)
    );
  });

  return (
    <div className="layout h-screen flex flex-col">
      <Header />
      <main id="admin-appointments" className="flex-1 overflow-hidden">
        <div className="chat-layout flex h-full">
          <AdminSidebar />

          <div className="flex-1 bg-white flex flex-col h-full overflow-hidden">
            <div className="admin-content-wrapper">
              
              {/* Header + Search */}
              <div className="admin-header-row">
                <h1 className="admin-title">Quản Lý Lịch Hẹn</h1>
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

              <div className="admin-layout">
                {/* --- CỘT TRÁI: DANH SÁCH --- */}
                <div className="left-column">
                  <div className="admin-list-scroll">
                    {loading ? (
                      <div className="p-4 text-center text-gray-500">Đang tải...</div>
                    ) : filteredList.length === 0 ? (
                      <div className="p-4 text-center text-gray-500">Không tìm thấy kết quả</div>
                    ) : (
                      filteredList.map((a) => (
                        <div
                          key={a._id}
                          className={`admin-item ${selected?._id === a._id ? "active" : ""}`}
                          onClick={() => setSelected(a)}
                        >
                          <div className="admin-item-header">
                            <span className="admin-item-type">{a.type || "Cuộc hẹn"}</span>
                            <button
                              className="btn-delete-mini"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteAppointment(a._id);
                              }}
                            >
                              ✕
                            </button>
                          </div>
                          <div className="admin-item-row">📍 {a.city || "Chưa có địa điểm"}</div>
                          <div className="admin-item-row">👤 {a.userId?.displayName || "Ẩn danh"}</div>
                          <div className="admin-item-time">
                            {new Date(a.dateTime).toLocaleString("vi-VN")}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* --- CỘT PHẢI: CHI TIẾT & MAP --- */}
                <div className="admin-preview">
                  {selected ? (
                    <div className="preview-content">
                      <h2 className="preview-title">{selected.type}</h2>
                      
                      {/* --- MAP CONTAINER (Đã fix cứng chiều cao) --- */}
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
                          marginBottom: "20px"
                        }}
                      >
                         {/* Key quan trọng để map vẽ lại khi đổi item */}
                        <MapPickerLeaflet
                          key={selected._id} 
                          lat={selected.latitude || 21.0285}
                          lng={selected.longitude || 105.8542}
                          onChange={() => {}} // Chỉ xem
                        />
                      </div>

                      <div className="info-grid">
                        <div className="info-box">
                          <label>Người tạo</label>
                          <span>{selected.userId?.displayName}</span>
                        </div>
                        <div className="info-box">
                          <label>Thời gian</label>
                          <span>{new Date(selected.dateTime).toLocaleString("vi-VN")}</span>
                        </div>
                        <div className="info-box">
                          <label>Địa điểm</label>
                          <span>{selected.city}</span>
                        </div>
                        <div className="info-box full-width">
                          <label>Ghi chú</label>
                          <span>{selected.description || "Không có ghi chú"}</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="empty-state">Chọn một lịch hẹn để xem chi tiết</div>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminAppointmentsPage;