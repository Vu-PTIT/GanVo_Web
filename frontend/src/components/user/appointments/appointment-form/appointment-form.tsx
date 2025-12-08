import "./appointment-form.css";
import "@/assets/css/asset.css";
import "@/assets/css/index.css";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function AppointmentForm() {
  return (
    <div className="appointment-form">
      <div className="cont-title-appointment">
        <h1 className="txt-ct fs-35 mt-10 mb-25">Lên Lịch Hẹn Mới</h1>
        <p className="title-text-under mb-25">
          Chọn vị trí và điền thông tin chi tiết cuộc hẹn của bạn.
        </p>
      </div>

      <div className="cont-content-appointment">
        {/* LEFT SIDE - MAP */}
        <div className="map-appointment">
          <div className="title-2 mb-5">Lên Lịch Hẹn Mới</div>
          <p className="title-text-under-2 mb-25">
            Kéo thả ghim để chọn địa điểm phù hợp.
          </p>
        </div>

        {/* RIGHT SIDE - FORM */}
        <div className="input-appointment box-input-form">
          <div className="title-2 mb-5">Chi Tiết Cuộc Hẹn</div>
          <p className="title-text-under-2 mb-30">
            Điền thông tin cuộc hẹn của bạn.
          </p>

          {/* ----- TIME ----- */}
          <label className="label-text mb-3">Thời gian hẹn</label>
          <Input
            type="datetime-local"
            placeholder="Chọn ngày và giờ"
            className="mb-20"
          />

          {/* ----- LOCATION ----- */}
          <label className="label-text mb-3">Địa điểm</label>
          <select className="input mb-20">
            <option value="0">-- Chọn địa điểm --</option>
            <option value="1">Hà Nội</option>
            <option value="2">TP HCM</option>
            <option value="3">Huế</option>
          </select>

          {/* ----- TYPE ----- */}
          <label className="label-text mb-3">Loại cuộc hẹn</label>
          <select className="input mb-20">
            <option value="0">-- Chọn thể loại --</option>
            <option value="1">abc</option>
            <option value="2">xyz</option>
            <option value="3">aaa</option>
          </select>

          {/* ----- REQUEST ----- */}
          <label className="label-text mb-3">Yêu cầu với người hẹn</label>
          <Input
            type="text"
            placeholder="Yêu cầu với người hẹn"
            className="mb-20"
          />

          {/* ----- MESSAGE ----- */}
          <label className="label-text mb-3">Lý Do Kết Nối / Tin Nhắn</label>
          <textarea
            className="input mb-25"
            placeholder="Bạn muốn kết nối vì lý do gì?"
            rows={3}
          ></textarea>

          {/* ----- BUTTONS ----- */}
          <div className="btn-cont-2 mt-15 flex gap-3">
            <Button variant="outline" className="btn-short">
              Hủy
            </Button>
            <Button className="btn-short">Kết nối</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
