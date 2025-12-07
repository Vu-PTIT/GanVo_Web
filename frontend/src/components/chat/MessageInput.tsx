import { useState } from "react";
import { useChatStore } from "@/stores/useChatStore";
import { Send, Image as ImageIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";
import "./MessageInput.css";

const MessageInput = () => {
    const [text, setText] = useState("");
    const [isSending, setIsSending] = useState(false);
    const { sendMessage, selectedConversationId } = useChatStore();

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!text.trim() || !selectedConversationId) return;

        setIsSending(true);
        try {
            await sendMessage(selectedConversationId, text.trim());
            setText("");
        } catch (error) {
            console.error("Failed to send message:", error);
            toast.error("Failed to send message");
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="message-input-container">
            <form onSubmit={handleSend} className="message-input-form">
                <button
                    type="button"
                    className="message-input-button image-button"
                    onClick={() => toast.info("Image upload coming soon!")}
                    title="Attach image"
                >
                    <ImageIcon className="button-icon" />
                </button>

                <input
                    type="text"
                    className="message-input-field"
                    placeholder="Type a message..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    disabled={isSending}
                />

                <button
                    type="submit"
                    className="message-input-button send-button"
                    disabled={!text.trim() || isSending}
                    title="Send message"
                >
                    {isSending ? (
                        <Loader2 className="button-icon loading" />
                    ) : (
                        <Send className="button-icon" />
                    )}
                </button>
            </form>
        </div>
    );
};

export default MessageInput;
