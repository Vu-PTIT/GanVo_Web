import './chat-form.css';
import { useState } from 'react';
import InputForm from '../../ui/input-form/input-form';
import ItemChatBox from '../../ui/item-chat-box/item-chat-box';
import ChatContent from '../../ui/chat-content/chat-content';
import '../../../assets/css/asset.css';

export function ChatForm() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedFriend, setSelectedFriend] = useState<{ name: string, avatar?: string } | null>(null);

    return (
        <div className="container container-1200">
            <div className="chat-form">
                <div className="chat-list-friend">
                    <div className="title">Tin nhắn</div>
                    <InputForm placeholder="Tìm kiếm..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                    <ItemChatBox searchQuery={searchQuery} onSelectFriend={setSelectedFriend} />
                </div>
                {selectedFriend ? (
                    <ChatContent friendName={selectedFriend.name} friendAvatar={selectedFriend.avatar} messages={[]} />
                ) : (
                    <div className="chat-empty">Chọn một cuộc trò chuyện để bắt đầu</div>
                )}
            </div>
        </div>

    )

}