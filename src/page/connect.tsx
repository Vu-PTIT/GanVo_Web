import '../assets/css/index.css';
import '../assets/css/asset.css';
import {Menu} from '../assets/components/menu/menu';
import { Header } from '../assets/components/header';
import { Footer } from '../assets/components/footer';   
import { ConnectForm } from '../assets/components/connect-form/connect-form';

export function Connect(){
    return(
        <div className="layout">
            <Header />
            <main id="connect">
                <div className="connect">
                    <Menu />
                    <ConnectForm />
                </div>
            </main>
            <Footer />
        </div>
    )
}