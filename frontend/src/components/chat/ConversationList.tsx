import { useEffect } from "react";
import { useConversationStore } from "@/stores/useConversationStore";
import { useChatStore } from "@/stores/useChatStore";
import { useAuthStore } from "@/stores/useAuthStore";
import { Loader2 } from "lucide-react";

const ConversationList = () => {
    const { conversations, fetchConversations, isLoading } = useConversationStore();
    const { selectedConversationId, setSelectedConversationId } = useChatStore();
    const { user: currentUser } = useAuthStore();

    useEffect(() => {
        fetchConversations();
    }, [fetchConversations]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="size-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-base-200 border-r border-base-300 w-80">
            <div className="p-4 border-b border-base-300">
                <h2 className="font-bold text-lg">Messages</h2>
            </div>

            <div className="overflow-y-auto flex-1 custom-scrollbar">
                {conversations.length === 0 ? (
                    <div className="p-4 text-center text-base-content/50">
                        No conversations yet. Start chatting with your friends!
                    </div>
                ) : (
                    conversations.map((conversation) => {
                        // Find the other participant
                        const otherParticipant = conversation.participants.find(
                            (p) => p.userId._id !== currentUser?._id
                        )?.userId;

                        if (!otherParticipant) return null;

                        const isSelected = selectedConversationId === conversation._id;

                        return (
                            <div
                                key={conversation._id}
                                onClick={() => setSelectedConversationId(conversation._id)}
                                className={`flex items-center gap-3 p-4 cursor-pointer transition-colors hover:bg-base-300 ${isSelected ? "bg-base-300 border-l-4 border-primary" : ""
                                    }`}
                            >
                                <div className="relative">
                                    <img
                                        src={otherParticipant.avatarUrl || "/avatar.png"}
                                        alt={otherParticipant.username}
                                        className="size-12 rounded-full object-cover border border-base-300"
                                    />
                                    {/* Online status indicator could go here */}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-baseline">
                                        <h3 className="font-semibold truncate">
                                            {otherParticipant.displayName || otherParticipant.username}
                                        </h3>
                                        {conversation.lastMessageAt && (
                                            <span className="text-xs text-base-content/50">
                                                {new Date(conversation.lastMessageAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm text-base-content/60 truncate">
                                        {conversation.lastMessage?.senderId === currentUser?._id ? "You: " : ""}
                                        {conversation.lastMessage?.content || "Started a conversation"}
                                    </p>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default ConversationList;
