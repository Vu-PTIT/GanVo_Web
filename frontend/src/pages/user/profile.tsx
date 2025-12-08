import '../../assets/css/index.css';
import '../../assets/css/asset.css';
import { Menu } from '../../components/shared/menu/menu';
import { Header } from '../../components/shared/header';
import { ProfileForm } from '../../components/user/profile/profile-form';

export function Profile() {
    return (
        <div className="layout">
            <Header />
            <main id="profile">
                <div className="profile profile-page-correction">
                    <Menu />
                    <div className="profile-scroll-container">
                        <ProfileForm />
                    </div>
                </div>
            </main>
        </div>
    )
}