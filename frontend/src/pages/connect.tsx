import '../assets/css/index.css';
import '../assets/css/asset.css';
import {Menu} from '../components/auth/menu/menu';
import { Header } from '../components/auth/header';  
import { ConnectForm } from '../components/auth/connect-form/connect-form';

export function Connect(){
    return(
        <div className="layout">
            <Header />
            <main id="connect">
                <div className="connect scoll-auto">
                    <Menu />
                    <ConnectForm />
                </div>
            </main>
        </div>
    )
}