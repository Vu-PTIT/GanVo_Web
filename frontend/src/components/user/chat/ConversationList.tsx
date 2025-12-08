import { useEffect } from "react";
import { useConversationStore } from "@/stores/useConversationStore";
import { useChatStore } from "@/stores/useChatStore";
import { useAuthStore } from "@/stores/useAuthStore";
import { Loader2 } from "lucide-react";
import "./ConversationList.css";

const ConversationList = () => {
    const { conversations, fetchConversations, isLoading } = useConversationStore();
    const { selectedConversationId, setSelectedConversationId } = useChatStore();
    const { user: currentUser } = useAuthStore();

    useEffect(() => {
        fetchConversations();
    }, [fetchConversations]);

    if (isLoading) {
        return (
            <div className="conversation-list-loading">
                <Loader2 className="loading-spinner" />
            </div>
        );
    }

    return (
        <div className="conversation-list">
            <div className="conversation-list-header">
                <h2 className="list-title">Messages</h2>
            </div>

            <div className="conversation-items">
                {conversations.length === 0 ? (
                    <div className="empty-conversations">
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
                                className={`conversation-item ${isSelected ? "active" : ""}`}
                            >
                                <div className="conversation-avatar">
                                    <img
                                        src={otherParticipant.avatarUrl || "/avatar.png"}
                                        alt={otherParticipant.username}
                                    />
                                </div>

                                <div className="conversation-content">
                                    <div className="conversation-header">
                                        <h3 className="conversation-name">
                                            {otherParticipant.displayName || otherParticipant.username}
                                        </h3>
                                        {conversation.lastMessageAt && (
                                            <span className="conversation-time">
                                                {new Date(conversation.lastMessageAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        )}
                                    </div>
                                    <p className="conversation-message">
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
