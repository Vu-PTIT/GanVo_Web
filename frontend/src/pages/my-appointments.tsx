import React from "react";
import "./my-appointments.css";
import "../assets/css/index.css";
import "../assets/css/asset.css";
import { Menu } from "../components/auth/menu/menu";
import { Header } from "../components/auth/header";
import MyAppointmentForm from "../components/auth/my-appointment-form/my-appointment-form";

const MyAppointmentsPage: React.FC = () => {
  return (
    <div className="layout">
      <Header />
      <main id="my-appointments">
        <div className="my-appointments scoll-auto">
          <Menu />
          <div className="my-appointments-right-site">
            <MyAppointmentForm />

            {/* FOOTER */}
            <footer className="app-footer">
              <button className="app-footer__link">Khám Phá</button>
              <button className="app-footer__link">Hỗ Trợ</button>
              <button className="app-footer__link">Pháp Lý</button>
            </footer>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MyAppointmentsPage;
