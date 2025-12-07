import './item-chat-box.css'
import ItemFriend from '../item-friend/item-friend'

export interface FriendItem {
  id?: string | number;
  avatar?: string;
  name: string;
  lastMessage?: string;
  time?: string;
  unread?: number;
}

interface ItemChatBoxProps {
  items?: FriendItem[];
  searchQuery?: string;
  onSelectFriend?: (friend: { name: string, avatar?: string }) => void;
}

export default function ItemChatBox({ items, searchQuery = '', onSelectFriend }: ItemChatBoxProps) {
  const sample: FriendItem[] = items ?? [
    { id: 1, name: 'Lâm Anh', lastMessage: 'Xin chào!', time: '5:12', avatar: '/z7162069739961_81cab8e64cc2813944f4900ca14b7c0b.jpg', unread: 2 },
    { id: 2, name: 'Thu Hồng', lastMessage: 'Hẹn mai nhé', time: '02:09', avatar: '/z7162069739961_81cab8e64cc2813944f4900ca14b7c0b.jpg' },
    { id: 3, name: 'Minh', lastMessage: '', time: '', avatar: '/z7162069739961_81cab8e64cc2813944f4900ca14b7c0b.jpg' },
  ]

  const filtered = sample.filter(friend =>
    friend.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectFriend = (friend: FriendItem) => {
    if (onSelectFriend) {
      onSelectFriend({ name: friend.name, avatar: friend.avatar });
    }
  };

  return (
    <div className="item-chat-box">
      {filtered.map((f) => (
        <div key={f.id} onClick={() => handleSelectFriend(f)}>
          <ItemFriend name={f.name} lastMessage={f.lastMessage} time={f.time} avatar={f.avatar} unread={f.unread} />
        </div>
      ))}
    </div>
  )
}
