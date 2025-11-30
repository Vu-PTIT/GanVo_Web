import { useEffect } from "react";
import { useChatStore } from "@/stores/useChatStore";
import Sidebar from "@/components/chat/Sidebar";
import ConversationList from "@/components/chat/ConversationList";
import ChatWindow from "@/components/chat/ChatWindow";

const ChatAppPage = () => {
  const { connectSocket, disconnectSocket } = useChatStore();

  useEffect(() => {
    connectSocket();
    return () => disconnectSocket();
  }, [connectSocket, disconnectSocket]);

  return (
    <div className="h-screen bg-base-200 flex items-center justify-center pt-16 px-4 pb-4">
      <div className="bg-base-100 rounded-lg shadow-xl w-full max-w-6xl h-full overflow-hidden flex border border-base-300">
        {/* Left Sidebar - Friends & Conversations */}
        <div className="flex w-80 flex-col border-r border-base-300 h-full">
          <Sidebar /> {/* Friend list / Requests */}
          <div className="divider my-0"></div>
          <ConversationList />
        </div>

        {/* Right Side - Chat Window */}
        <ChatWindow />
      </div>
    </div>
  );
};

export default ChatAppPage;


