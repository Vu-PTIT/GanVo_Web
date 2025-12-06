<<<<<<< HEAD
import Logout from "@/components/auth/Logout";
import { useAuthStore } from "@/stores/useAuthStore";
=======
import '../assets/css/index.css';
import '../assets/css/asset.css';
import { useEffect } from "react";
import { useChatStore } from "@/stores/useChatStore";
import ConversationList from "@/components/chat/ConversationList";
import ChatWindow from "@/components/chat/ChatWindow";
import { Menu } from '../components/auth/menu/menu';
import { Header } from '../components/auth/header';
>>>>>>> 10a06118c329e643235fe68c33998675f34f1d3b

const ChatAppPage = () => {
  const user = useAuthStore((s) => s.user);

  return (
<<<<<<< HEAD
    <div>
      {user?.username}
      <Logout />
=======
    <div className="layout">
      <Header />
      <main id="chat">
        <div className="chat-layout scoll-auto">
          <Menu />
          <div className="flex-1 bg-base-100 rounded-lg shadow-xl overflow-hidden flex border border-base-300 h-full">
            <div className="flex w-80 flex-col border-r border-base-300 h-full">
              <ConversationList />
            </div>

            {/* Right Side - Chat Window */}
            <ChatWindow />
          </div>
        </div>
      </main>
>>>>>>> 10a06118c329e643235fe68c33998675f34f1d3b
    </div>
  );
};

export default ChatAppPage;
