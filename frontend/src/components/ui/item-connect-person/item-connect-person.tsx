import './item-connect-person.css';

export type FriendItem = {
	id?: string;
	avatar?: string;
	name: string;
	age?: number | string;
	location?: string;
	about?: string;
}


export interface ItemConnectPersonProps {
	avatar?: string;
	name: string;
	age?: number | string;
	location?: string;
	about?: string;
	onClick?: () => void;
	onWatchProfile?: () => void;
	onAdd?: () => void;
	active?: boolean;
}

export default function ItemConnectPerson({ avatar, name, age, location, about, onClick, onWatchProfile, onAdd, active = false }: ItemConnectPersonProps) {
	const avatarSrc = avatar || '/z7162069739961_81cab8e64cc2813944f4900ca14b7c0b.jpg'

	return (
		<div className="large-3 col-6">
			<div className="col-inner">
				<div className={`item-friend-connect ${active ? 'active' : ''}`} onClick={onClick} role="button" tabIndex={0} data-age={age ?? ''} data-location={location ?? ''} data-about={about ?? ''} aria-label={`${name} ${age ? `${age} tuổi` : ''} ${location ?? ''}`}>
					<div className="item-friend-connect-left">
						<div className="avatar-small">
							<img src={avatarSrc} alt={`${name} avatar`} />
						</div>
						<div className="info">
							<div className="name">{name}</div>
							<div className="meta">
								{age !== undefined && <span className="age">{age} tuổi</span>}
								{location && <span className="location">{location}</span>}
							</div>
							{about && <div className="about">{about}</div>}
						</div>
					</div>
					<div className="item-friend-connect-right">
						<div className="action-buttons">
							<button className="btn btn-watch" onClick={(e) => { e.stopPropagation(); onWatchProfile?.(); }}>Watch profile</button>
							<button className="btn btn-add" onClick={(e) => { e.stopPropagation(); onAdd?.(); }}>Add</button>
						</div>
					</div>
				</div>
			</div>
		</div>

	)
}