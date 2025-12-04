import { useEffect } from "react";
import { useChatStore } from "@/stores/useChatStore";
import ConversationList from "@/components/chat/ConversationList";
import ChatWindow from "@/components/chat/ChatWindow";
import { Menu } from '../components/auth/menu/menu';
import { Header } from '../components/auth/header';

const ChatAppPage = () => {
  const { connectSocket, disconnectSocket } = useChatStore();

  useEffect(() => {
    connectSocket();
    return () => disconnectSocket();
  }, [connectSocket, disconnectSocket]);

  return (
    <div className="layout">
      <Header />
      <main id="chat-app" className="h-[calc(100vh-80px)] w-full flex justify-center p-4">
        <div className="flex w-full max-w-[1400px] gap-4 h-full">
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
    </div>
  );
};

export default ChatAppPage;
