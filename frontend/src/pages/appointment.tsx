import '../assets/css/index.css';
import '../assets/css/asset.css';
import {Menu} from '../components/auth/menu/menu';
import { Header } from '../components/auth/header'; 
import { AppointmentForm } from '../components/auth/appointment-form/appointment-form';
 
export function Appointment(){
    return(
        <div className="layout">
            <Header />
            <main id="appointment">
                <div className="appointment scoll-auto">
                    <Menu />
                    <AppointmentForm />
                </div>
            </main>
        </div>
    )
}