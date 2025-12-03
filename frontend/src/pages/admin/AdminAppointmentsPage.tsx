import React, { useEffect, useState } from "react";
import axiosInstance from "../../lib/axios";
import "./admin-appointments.css";
import MapPickerLeaflet from "../../components/appointment-form/MapPickerLeaflet";

const AdminAppointmentsPage: React.FC = () => {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);

  const fetchAppointments = async () => {
    const res = await axiosInstance.get("/appointments");
    setAppointments(res.data);
  };

  const deleteAppointment = async (id: string) => {
    if (!confirm("Xác nhận xóa lịch hẹn?")) return;
    await axiosInstance.delete(`/appointments/${id}`);
    fetchAppointments();
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  return (
    <div className="admin-page">
      <h1 className="admin-title">Quản Lý Lịch Hẹn</h1>

      <div className="admin-layout">
        {/* DANH SÁCH */}
        <div className="admin-list">
          {appointments.map((a) => (
            <div
              key={a._id}
              className={`admin-item ${
                selected?._id === a._id ? "active" : ""
              }`}
              onClick={() => setSelected(a)}
            >
              <div className="admin-item-title">{a.city}</div>
              <div className="admin-item-sub">
                {new Date(a.dateTime).toLocaleString("vi-VN")}
              </div>
              <div className="admin-item-user">{a.userId?.displayName}</div>

              <button
                className="btn delete"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteAppointment(a._id);
                }}
              >
                Xóa
              </button>
            </div>
          ))}
        </div>

        {/* PREVIEW MAP */}
        <div className="admin-preview">
          {selected ? (
            <>
              <h2>Vị trí lịch hẹn</h2>
              <MapPickerLeaflet
                lat={selected.latitude}
                lng={selected.longitude}
                onChange={() => {}}
              />

              <p className="preview-info">
                <b>Địa điểm:</b> {selected.city}
                <br />
                <b>Loại:</b> {selected.type}
                <br />
                <b>Thời gian:</b>{" "}
                {new Date(selected.dateTime).toLocaleString("vi-VN")}
                <br />
                <b>Người tạo:</b> {selected.userId?.displayName}
              </p>
            </>
          ) : (
            <p>Chọn lịch hẹn để xem chi tiết...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminAppointmentsPage;
