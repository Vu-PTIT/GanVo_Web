import '../assets/css/index.css';
import '../assets/css/asset.css';
import {Menu} from '../assets/components/menu/menu';
import React from 'react';
import { Header } from '../assets/components/header';
import { Footer } from '../assets/components/footer';   
import { AppointmentForm } from '../assets/components/appointment-form/appointment-form';
 
export function Appointment(){
    return(
        <div className="layout">
            <Header />
            <main id="appointment">
                <div className="appointment">
                    <Menu />
                    <AppointmentForm />
                </div>
            </main>
            <Footer />
        </div>
    )
}