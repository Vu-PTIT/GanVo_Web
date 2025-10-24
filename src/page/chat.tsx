import '../assets/css/index.css';
import '../assets/css/asset.css';
import {Menu} from '../assets/components/menu/menu';
import { Header } from '../assets/components/header';
import { Footer } from '../assets/components/footer';   
import { ChatForm } from '../assets/components/chat-form/chat-form';

export function Chat(){
    return(
        <div className="layout">
            <Header />
            <main id="chat">
                <div className="chat">
                    <Menu />
                    <ChatForm />
                </div>
            </main>
            <Footer />
        </div>
    )
}