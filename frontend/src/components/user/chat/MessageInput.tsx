import { useState, useRef } from "react";
import { useChatStore } from "@/stores/useChatStore";
import { Send, Image as ImageIcon, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import "./MessageInput.css";
import axiosInstance from "@/lib/axios";

const MessageInput = () => {
    const [text, setText] = useState("");
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isSending, setIsSending] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const { sendMessage, selectedConversationId } = useChatStore();

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            toast.error("Vui lòng chọn file ảnh");
            return;
        }

        if (file.size > 5 * 1024 * 1024) { // 5MB
            toast.error("Ảnh không được quá 5MB");
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result as string);
            setSelectedFile(file);
        };
        reader.readAsDataURL(file);
    };

    const removeImage = () => {
        setImagePreview(null);
        setSelectedFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if ((!text.trim() && !selectedFile) || !selectedConversationId) return;

        setIsSending(true);
        try {
            let imgUrl = undefined;

            if (selectedFile) {
                const formData = new FormData();
                formData.append("file", selectedFile);

                try {
                    const uploadRes = await axiosInstance.post("/upload", formData, {
                        headers: { "Content-Type": "multipart/form-data" },
                    });
                    imgUrl = uploadRes.data.url;
                } catch (uploadError) {
                    console.error("Upload failed", uploadError);
                    toast.error("Lỗi khi tải ảnh lên");
                    setIsSending(false);
                    return;
                }
            }

            await sendMessage(selectedConversationId, text.trim(), imgUrl);

            // Clear state on success
            setText("");
            removeImage();

        } catch (error) {
            console.error("Failed to send message:", error);
            toast.error("Gửi tin nhắn thất bại");
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="message-input-wrapper">
            {/* Image Preview Area */}
            {imagePreview && (
                <div className="image-preview-container">
                    <div className="preview-image-wrapper">
                        <img src={imagePreview} alt="Preview" className="preview-image" />
                        <button
                            className="remove-preview-btn"
                            type="button"
                            onClick={removeImage}
                        >
                            <X size={14} />
                        </button>
                    </div>
                </div>
            )}

            <div className="message-input-container">
                <form onSubmit={handleSend} className="message-input-form">
                    <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        ref={fileInputRef}
                        onChange={handleImageSelect}
                        style={{ display: "none" }}
                    />

                    <button
                        type="button"
                        className={`message-input-button image-button ${selectedFile ? 'active' : ''}`}
                        onClick={() => fileInputRef.current?.click()}
                        title="Gửi hình ảnh"
                        disabled={isSending}
                    >
                        <ImageIcon className="button-icon" />
                    </button>

                    <input
                        type="text"
                        className="message-input-field"
                        placeholder="Nhập tin nhắn..."
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        disabled={isSending}
                    />

                    <button
                        type="submit"
                        className="message-input-button send-button"
                        disabled={(!text.trim() && !selectedFile) || isSending}
                        title="Gửi"
                    >
                        {isSending ? (
                            <Loader2 className="button-icon loading" />
                        ) : (
                            <Send className="button-icon" />
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default MessageInput;
