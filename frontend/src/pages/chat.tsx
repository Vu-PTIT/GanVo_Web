import '../assets/css/index.css';
import '../assets/css/asset.css';
import {Menu} from '../components/auth/menu/menu';
import { Header } from '../components/auth/header';  
import { ChatForm } from '../components/auth/chat-form/chat-form';

export function Chat(){
    return(
        <div className="layout">
            <Header />
            <main id="chat">
                <div className="chat scoll-auto">
                    <Menu />
                    <ChatForm />
                </div>
            </main>
        </div>
    )
}