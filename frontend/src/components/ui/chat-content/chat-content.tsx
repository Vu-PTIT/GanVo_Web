import './chat-content.css';
import { useState } from 'react';
import { Send } from 'lucide-react';
import InputForm from '../input-form/input-form';

export interface Message {
  id: string | number;
  sender: 'user' | 'friend';
  text: string;
  time?: string;
}

export interface ChatContentProps {
  friendName?: string;
  friendAvatar?: string;
  messages?: Message[];
}

export default function ChatContent({ friendName = 'Bạn', friendAvatar, messages = [] }: ChatContentProps) {
  const [inputValue, setInputValue] = useState('');

  const handleSend = () => {
    if (inputValue.trim()) {
      console.log('Send message:', inputValue);
      setInputValue('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="chat-content">
      <div className="chat-header">
        <div className="chat-header-left">
          <div className="friend-avatar-small">
            <img src={friendAvatar || '/z7162069739961_81cab8e64cc2813944f4900ca14b7c0b.jpg'} alt={friendName} />
          </div>
          <div className="friend-info">
            <div className="friend-name">{friendName}</div>
            <div className="friend-status">Hoạt động 5 phút trước</div>
          </div>
        </div>
      </div>

      <div className="messages-container">
        {messages.length === 0 ? (
          <div className="no-messages">
            <p>Không có tin nhắn. Hãy bắt đầu cuộc trò chuyện!</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className={`message ${msg.sender}`}>
              <div className="message-bubble">{msg.text}</div>
              {msg.time && <div className="message-time">{msg.time}</div>}
            </div>
          ))
        )}
      </div>

      <div className="message-input-container">
        <div className="input-wrapper">
          <InputForm
            placeholder="Nhập tin nhắn..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            className="message-input"
          />
          <button className="btn-send" onClick={handleSend}>
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}