import './item-friend.css'

// React import not required for new JSX transform

export interface ItemFriendProps {
	avatar?: string;
	name: string;
	lastMessage?: string;
	time?: string;
	unread?: number;
	onClick?: () => void;
	active?: boolean;
}

export default function ItemFriend({ avatar, name, lastMessage = '', time = '', unread = 0, onClick, active = false }: ItemFriendProps) {
	return (
		<div className={`item-friend ${active ? 'active' : ''}`} onClick={onClick} role="button" tabIndex={0}>
			<div className="item-friend-left">
				<div className="avatar-small">
					<img src={avatar || '/z7162069739961_81cab8e64cc2813944f4900ca14b7c0b.jpg'} alt={`${name} avatar`} />
				</div>
				<div className="info">
					<div className="name">{name}</div>
					<div className="last-message">{lastMessage}</div>
				</div>
			</div>
			<div className="item-friend-right">
				<div className="time">{time}</div>
				{unread > 0 && <div className="badge">{unread}</div>}
			</div>
		</div>
	)
}