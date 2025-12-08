import '../assets/css/index.css';
import '../assets/css/asset.css';
import './ChatAppPage.css';
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useChatStore } from "@/stores/useChatStore";
import { useConversationStore } from '@/stores/useConversationStore';
import ConversationList from "@/components/chat/ConversationList";
import ChatWindow from "@/components/chat/ChatWindow";
import { Menu } from '../components/auth/menu/menu';
import { Header } from '../components/auth/header';

const ChatAppPage = () => {
  const { connectSocket, disconnectSocket } = useChatStore();

  const { getOrCreateDirectConversation } = useConversationStore();
  const { setSelectedConversationId } = useChatStore();
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    connectSocket();
    return () => disconnectSocket();
  }, [connectSocket, disconnectSocket]);

  useEffect(() => {
    const userId = searchParams.get("userId");
    if (userId) {
      const initChat = async () => {
        const conversationId = await getOrCreateDirectConversation(userId);
        if (conversationId) {
          setSelectedConversationId(conversationId);
          // Clear param
          setSearchParams({});
        }
      };
      initChat();
    }
  }, [searchParams, getOrCreateDirectConversation, setSelectedConversationId, setSearchParams]);

  return (
    <div className="layout">
      <Header />
      <main id="chat">
        <div className="chat-layout scoll-auto">
          <Menu />
          <div className="chat-app-wrapper">
            <div className="chat-sidebar-container">
              <ConversationList />
            </div>
            <ChatWindow />
          </div>
        </div>
      </main>
    </div>
  );
};

export default ChatAppPage;
