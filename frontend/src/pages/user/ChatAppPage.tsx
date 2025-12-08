import '../../assets/css/index.css';
import '../../assets/css/asset.css';
import './ChatAppPage.css';
import { useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { useChatStore } from "@/stores/useChatStore";
import { useConversationStore } from '@/stores/useConversationStore';
import ConversationList from "@/components/user/chat/ConversationList";
import ChatWindow from "@/components/user/chat/ChatWindow";
import { Menu } from '../../components/shared/menu/menu';
import { Header } from '../../components/shared/header';

const ChatAppPage = () => {
  const { connectSocket, disconnectSocket } = useChatStore();

  const { getOrCreateDirectConversation } = useConversationStore();
  const { setSelectedConversationId } = useChatStore();
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    connectSocket();
    return () => disconnectSocket();
  }, [connectSocket, disconnectSocket]);

  // Ref to prevent double-invocation in StrictMode
  const isInitializingRef = useRef(false);

  useEffect(() => {
    const userId = searchParams.get("userId");

    // Only proceed if userId exists and we aren't already initializing for this user
    if (userId && !isInitializingRef.current) {
      isInitializingRef.current = true;

      const initChat = async () => {
        try {
          const conversationId = await getOrCreateDirectConversation(userId);
          if (conversationId) {
            setSelectedConversationId(conversationId);
            // Clear param
            setSearchParams({});
          }
        } finally {
          // Optional: reset ref if needed, but since we clear param, we might not want to.
          // keeping it true prevents re-entry until component unmounts or param changes significantly.
          setTimeout(() => { isInitializingRef.current = false; }, 1000);
        }
      };
      initChat();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.get("userId")]); // Only re-run when userId changes

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
