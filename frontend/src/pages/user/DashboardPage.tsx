import './DashboardPage.css';
import { Header } from "../../components/shared/header";
import { Menu } from "../../components/shared/menu/menu";
import { DashboardForm } from "../../components/user/dashboard/dashboard-form";

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
