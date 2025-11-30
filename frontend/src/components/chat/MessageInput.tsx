import { useState } from "react";
import { useChatStore } from "@/stores/useChatStore";
import { Send, Image as ImageIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";

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
        <div className="p-4 border-t border-base-300 bg-base-100">
            <form onSubmit={handleSend} className="flex items-center gap-2">
                {/* Image upload button (placeholder for now) */}
                <button
                    type="button"
                    className="btn btn-circle btn-ghost btn-sm text-base-content/60"
                    onClick={() => toast.info("Image upload coming soon!")}
                >
                    <ImageIcon className="size-5" />
                </button>

                <input
                    type="text"
                    className="input input-bordered flex-1 bg-base-200 focus:outline-none"
                    placeholder="Type a message..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    disabled={isSending}
                />

                <button
                    type="submit"
                    className="btn btn-primary btn-circle btn-sm"
                    disabled={!text.trim() || isSending}
                >
                    {isSending ? (
                        <Loader2 className="size-4 animate-spin" />
                    ) : (
                        <Send className="size-4" />
                    )}
                </button>
            </form>
        </div>
    );
};

export default MessageInput;
