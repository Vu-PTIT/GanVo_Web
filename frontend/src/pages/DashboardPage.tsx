import './DashboardPage.css';
import { Header } from "../components/auth/header";
import { Menu } from "../components/auth/menu/menu";
import { DashboardForm } from "../components/auth/dashboard-form/dashboard-form";

export function DashboardPage() {
    return (
        <div className="layout">
            <Header />
            <main>
                <div className="dashboard-layout scoll-auto">
                    <Menu />
                    <div className="dashboard-app-wrapper">
                        <DashboardForm />
                    </div>
                </div>
            </main>
        </div>
    );
}

export default DashboardPage;
