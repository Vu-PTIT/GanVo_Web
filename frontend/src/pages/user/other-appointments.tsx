import React from "react";
import "./other-appointments.css";
import "../../assets/css/index.css";
import "../../assets/css/asset.css";
import { Menu } from "../../components/shared/menu/menu";
import { Header } from "../../components/shared/header";
import OtherAppointmentForm from "../../components/user/appointments/other-appointment-form";

const OtherAppointmentsPage: React.FC = () => {
    return (
        <div className="layout">
            <Header />
            <main id="other-appointments">
                <div className="other-appointments scoll-auto">
                    <Menu />
                    <div className="other-appointments-right-site">
                        <OtherAppointmentForm />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default OtherAppointmentsPage;
