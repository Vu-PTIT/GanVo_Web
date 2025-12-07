import { useEffect, useRef } from "react";
import { useChatStore } from "@/stores/useChatStore";
import { useAuthStore } from "@/stores/useAuthStore";
import { useConversationStore } from "@/stores/useConversationStore";
import MessageInput from "./MessageInput";
import { Loader2, MessageSquare } from "lucide-react";
import "./ChatWindow.css";

const ChatWindow = () => {
    const {
        messages,
        selectedConversationId,
        fetchMessages,
        isMessagesLoading,
        joinConversation,
    } = useChatStore();
    const { user: currentUser } = useAuthStore();
    const { conversations } = useConversationStore();
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const selectedConversation = conversations.find(
        (c) => c._id === selectedConversationId
    );

    const otherParticipant = selectedConversation?.participants.find(
        (p) => p.userId._id !== currentUser?._id
    )?.userId;

    useEffect(() => {
        if (selectedConversationId) {
            joinConversation(selectedConversationId);
            fetchMessages(selectedConversationId);
        }
    }, [selectedConversationId, joinConversation, fetchMessages]);

    useEffect(() => {
        if (messagesEndRef.current && messages) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    if (!selectedConversationId) {
        return (
            <div className="chat-empty-state">
                <div className="empty-icon">
                    <MessageSquare size={48} />
                </div>
                <h3 className="empty-title">Welcome to GanVo Chat</h3>
                <p className="empty-text">Select a conversation from the sidebar to start chatting</p>
            </div>
        );
    }

    return (
        <div className="chat-window">
            {/* Header */}
            <div className="chat-header">
                {otherParticipant && (
                    <div className="chat-header-left">
                        <div className="friend-avatar-small">
                            <img
                                src={otherParticipant.avatarUrl || "/avatar.png"}
                                alt={otherParticipant.username}
                            />
                        </div>
                        <div className="friend-info">
                            <div className="friend-name">{otherParticipant.displayName}</div>
                            <span className="friend-status">@{otherParticipant.username}</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Messages */}
            <div className="messages-container">
                {isMessagesLoading ? (
                    <div className="loading-spinner">
                        <Loader2 className="spinner-icon" />
                    </div>
                ) : messages.length === 0 ? (
                    <div className="no-messages">
                        <p>No messages yet. Say hello! 👋</p>
                    </div>
                ) : (
                    messages.map((message) => {
                        const isMyMessage = message.senderId._id === currentUser?._id;

                        return (
                            <div
                                key={message._id}
                                className={`message ${isMyMessage ? "user" : "friend"}`}
                            >
                                <div className="message-avatar">
                                    <img
                                        src={message.senderId.avatarUrl || "/avatar.png"}
                                        alt={message.senderId.username}
                                    />
                                </div>
                                <div className="message-content">
                                    <div className="message-header">
                                        <span className="message-sender">{message.senderId.displayName}</span>
                                        <time className="message-time">
                                            {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </time>
                                    </div>
                                    <div className="message-bubble">
                                        {message.imgUrl && (
                                            <img
                                                src={message.imgUrl}
                                                alt="Attachment"
                                                className="message-image"
                                            />
                                        )}
                                        {message.content}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <MessageInput />
        </div>
    );
};

export default ChatWindow;
