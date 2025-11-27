import React, { useState } from "react";
import "./appointment.css";
import MapPickerLeaflet from "../components/appointment-form/MapPickerLeaflet";
import axiosClient from "../api/axiosClient"; // đường dẫn từ /page tới /api

const AppointmentPage: React.FC = () => {
  const [dateTime, setDateTime] = useState("2025-10-17T10:00");
  const [city, setCity] = useState("Thành phố Hồ Chí Minh, Việt Nam");
  const [type, setType] = useState("Cà Phê");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [latitude, setLatitude] = useState(16.047); // gần Đà Nẵng
  const [longitude, setLongitude] = useState(108.206);

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setLoading(true);
  //   setMessage(null);

  //   try {
  //     const payload = {
  //       dateTime,
  //       city,
  //       type,
  //       reason,
  //       // tạm thời fix toạ độ, sau này lấy từ map
  //       latitude: 10.77,
  //       longitude: 106.7,
  //     };

  //     const res = await axiosClient.post("/appointments", payload);

  //     setMessage(res.data.message || "Tạo lịch hẹn thành công!");
  //   } catch (err: any) {
  //     console.error(err);
  //     setMessage(err?.response?.data?.message || "Tạo lịch hẹn thất bại");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(">>> handleSubmit được gọi");
    alert("Đã bấm Kết Nối"); // thêm tạm để test

    setLoading(true);
    setMessage(null);

    try {
      const payload = {
        dateTime,
        city,
        type,
        reason,
        latitude,
        longitude,
      };

      const res = await axiosClient.post("/appointments", payload);
      setMessage(res.data.message || "Tạo lịch hẹn thành công!");
    } catch (err: any) {
      console.error(err);
      setMessage(err?.response?.data?.message || "Tạo lịch hẹn thất bại");
    } finally {
      setLoading(false);
    }
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
          <button className="sidebar-item sidebar-item--active">
            <span className="sidebar-item__text">Lên Lịch Hẹn</span>
          </button>
          <button className="sidebar-item">
            <span className="sidebar-item__text">Thông Tin Cá Nhân</span>
          </button>
          <button className="sidebar-item">
            <span className="sidebar-item__text">Kết Nối</span>
          </button>
          <button className="sidebar-item">
            <span className="sidebar-item__text">Nhắn Tin</span>
          </button>

          <div className="sidebar-section-title sidebar-section-title--mt">
            KHÁC
          </div>
          <button className="sidebar-item">
            <span className="sidebar-item__text">Chọn Vị Trí</span>
          </button>
          <button className="sidebar-item">
            <span className="sidebar-item__text">Bảng Điểm</span>
          </button>
        </nav>
      </aside>

      {/* MAIN */}
      <div className="app-shell__main">
        {/* TOP BAR */}
        <header className="topbar">
          <div className="topbar__left" />
          <div className="topbar__right">
            <button className="topbar__icon-btn">🔔</button>
            <button className="topbar__icon-btn">⚙</button>
            <div className="topbar__avatar">U</div>
          </div>
        </header>

        {/* CONTENT */}
        <main className="appointment-main">
          <div className="appointment-header">
            <h1 className="appointment-title">Lên Lịch Hẹn Mới</h1>
            <p className="appointment-subtitle">
              Chọn vị trí và điền thông tin chi tiết cuộc hẹn của bạn.
            </p>
          </div>

          <div className="appointment-layout">
            {/* LEFT CARD – MAP */}
            <section className="card card--map">
              <div className="card__header">
                <h2 className="card__title">Chọn Vị Trí Cuộc Hẹn</h2>
                <p className="card__subtitle">
                  Bấm vào bản đồ để chọn địa điểm phù hợp.
                </p>
              </div>

              <MapPickerLeaflet
                lat={latitude}
                lng={longitude}
                onChange={(lat, lng) => {
                  setLatitude(lat);
                  setLongitude(lng);
                }}
              />

              <div className="map-footer">
                <button type="button" className="btn btn--primary">
                  Xác nhận vị trí
                </button>
                <span className="map-coords">
                  Lat: {latitude.toFixed(4)} – Lng: {longitude.toFixed(4)}
                </span>
              </div>
            </section>

            {/* RIGHT CARD – FORM */}
            <section className="card card--detail">
              <div className="card__header">
                <h2 className="card__title">Chi Tiết Cuộc Hẹn</h2>
                <p className="card__subtitle">
                  Điền thông tin cuộc hẹn của bạn.
                </p>
              </div>

              <form className="detail-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">Ngày &amp; Giờ</label>
                  <input
                    type="datetime-local"
                    className="form-input"
                    value={dateTime}
                    onChange={(e) => setDateTime(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Địa Điểm</label>
                  <input
                    className="form-input"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Loại Cuộc Hẹn</label>
                  <select
                    className="form-input"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                  >
                    <option value="Cà Phê">Cà Phê</option>
                    <option value="Ăn trưa">Ăn trưa</option>
                    <option value="Ăn tối">Ăn tối</option>
                    <option value="Đi dạo">Đi dạo</option>
                  </select>
                </div>

                <div className="form-group form-group--grow">
                  <label className="form-label">Lý Do Kết Nối / Tin Nhắn</label>
                  <textarea
                    className="form-input form-input--textarea"
                    placeholder="Bạn muốn kết nối vì lý do gì?"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                  />
                </div>

                {/* <div className="detail-actions">
                  <button type="button" className="btn btn--ghost">
                    Hủy
                  </button>
                  <button type="submit" className="btn btn--primary">
                    Kết Nối
                  </button>
                </div> */}
                <form className="detail-form" onSubmit={handleSubmit}>
                  {/* ... các input ... */}

                  <div className="detail-actions">
                    <button type="button" className="btn btn--ghost">
                      Hủy
                    </button>
                    <button
                      type="submit"
                      className="btn btn--primary"
                      disabled={loading}
                    >
                      {loading ? "Đang tạo..." : "Kết Nối"}
                    </button>
                  </div>

                  {message && (
                    <p style={{ marginTop: 8, fontSize: 12, color: "#0369a1" }}>
                      {message}
                    </p>
                  )}
                </form>
              </form>
            </section>
          </div>

          {/* FOOTER */}
          <footer className="app-footer">
            <button className="app-footer__link">Khám Phá</button>
            <button className="app-footer__link">Hỗ Trợ</button>
            <button className="app-footer__link">Pháp Lý</button>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default AppointmentPage;
