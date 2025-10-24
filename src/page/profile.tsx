import '../assets/css/index.css';
import '../assets/css/asset.css';
import {Menu} from '../assets/components/menu/menu';
import { Header } from '../assets/components/header';
import { Footer } from '../assets/components/footer';   
import { ProfileForm } from '../assets/components/profile-form/profile-form';

export function Profile(){
    return(
        <div className="layout">
            <Header />
            <main id="connect">
                <div className="connect">
                    <Menu />
                    <ProfileForm />
                </div>
            </main>
            <Footer />
        </div>
    )
}