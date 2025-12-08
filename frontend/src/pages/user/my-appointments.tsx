import React from "react";
import "./my-appointments.css";
import "../../assets/css/index.css";
import "../../assets/css/asset.css";
import { Menu } from "../../components/shared/menu/menu";
import { Header } from "../../components/shared/header";
import MyAppointmentForm from "../../components/user/appointments/my-appointment-form";

const MyAppointmentsPage: React.FC = () => {
  return (
    <div className="layout">
      <Header />
      <main id="my-appointments">
        <div className="my-appointments scoll-auto">
          <Menu />
          <div className="my-appointments-right-site">
            <MyAppointmentForm />
          </div>
        </div>
      </main>
    </div>
  );
};

export default MyAppointmentsPage;
