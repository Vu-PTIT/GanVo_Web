import '../../assets/css/index.css';
import '../../assets/css/asset.css';
import { Menu } from '../../components/shared/menu/menu';
import { Header } from '../../components/shared/header';
import { ConnectForm } from '../../components/user/connect/connect-form';

export function Connect() {
    return (
        <div className="layout">
            <Header />
            <main id="connect">
                <div className="connect">
                    <Menu />
                    <ConnectForm />
                </div>
            </main>
        </div>
    )
}