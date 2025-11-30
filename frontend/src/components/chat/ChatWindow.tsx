import { useEffect, useRef } from "react";
import { useChatStore } from "@/stores/useChatStore";
import { useAuthStore } from "@/stores/useAuthStore";
import { useConversationStore } from "@/stores/useConversationStore";
import MessageInput from "./MessageInput";
import { Loader2, MessageSquare } from "lucide-react";

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
            <div className="flex-1 flex flex-col items-center justify-center bg-base-100 text-base-content/50 p-8">
                <div className="size-24 rounded-full bg-base-200 flex items-center justify-center mb-4">
                    <MessageSquare className="size-12 text-primary" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Welcome to GanVo Chat</h2>
                <p>Select a conversation from the sidebar to start chatting</p>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col h-full bg-base-100">
            {/* Header */}
            <div className="p-4 border-b border-base-300 flex items-center gap-3 shadow-sm z-10">
                {otherParticipant && (
                    <>
                        <img
                            src={otherParticipant.avatarUrl || "/avatar.png"}
                            alt={otherParticipant.username}
                            className="size-10 rounded-full object-cover border border-base-300"
                        />
                        <div>
                            <h3 className="font-bold">{otherParticipant.displayName}</h3>
                            <span className="text-xs text-base-content/60">@{otherParticipant.username}</span>
                        </div>
                    </>
                )}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-base-100">
                {isMessagesLoading ? (
                    <div className="flex justify-center py-8">
                        <Loader2 className="size-8 animate-spin text-primary" />
                    </div>
                ) : messages.length === 0 ? (
                    <div className="text-center py-8 text-base-content/50">
                        No messages yet. Say hello! 👋
                    </div>
                ) : (
                    messages.map((message) => {
                        const isMyMessage = message.senderId._id === currentUser?._id;

                        return (
                            <div
                                key={message._id}
                                className={`chat ${isMyMessage ? "chat-end" : "chat-start"}`}
                            >
                                <div className="chat-image avatar">
                                    <div className="w-10 rounded-full border border-base-300">
                                        <img
                                            src={message.senderId.avatarUrl || "/avatar.png"}
                                            alt={message.senderId.username}
                                        />
                                    </div>
                                </div>
                                <div className="chat-header mb-1">
                                    <span className="text-xs opacity-50 mr-1">{message.senderId.displayName}</span>
                                    <time className="text-xs opacity-50">
                                        {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </time>
                                </div>
                                <div
                                    className={`chat-bubble ${isMyMessage ? "chat-bubble-primary" : "chat-bubble-secondary"
                                        }`}
                                >
                                    {message.imgUrl && (
                                        <img
                                            src={message.imgUrl}
                                            alt="Attachment"
                                            className="max-w-[200px] rounded-md mb-2"
                                        />
                                    )}
                                    {message.content}
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
