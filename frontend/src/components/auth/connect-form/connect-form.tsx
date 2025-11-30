import './connect-form.css';
import '../../../assets/css/asset.css';
import { useState } from 'react';
import ItemConnectPerson from '../../ui/item-connect-person/item-connect-person';
import type { FriendItem } from '../../ui/item-connect-person/item-connect-person';

export function ConnectForm(){
    const sample: (FriendItem & { suggested?: boolean })[] = [
        { id: '1', name: 'Alice', avatar: '/img/avatar-alice.jpg', age: 28, location: 'Hanoi', about: 'Designer, loves coffee and traveling.', suggested: true },
        { id: '2', name: 'Bob', avatar: '/img/avatar-bob.jpg', age: 32, location: 'Ho Chi Minh', about: 'Frontend dev, football fan.' , suggested: false},
        { id: '3', name: 'Charlie', avatar: '/img/avatar-charlie.jpg', age: 25, location: 'Da Nang', about: 'Student, photography hobby.' , suggested: true},
        { id: '4', name: 'Diana', avatar: '/img/avatar-diana.jpg', age: 30, location: 'Hue', about: 'Product manager, foodie.' , suggested: false},
    ]

    const [filter, setFilter] = useState<'all'|'suggested'>('all')
    const [query, setQuery] = useState('')

    const handleWatch = (name: string) => {
        console.log('Watch profile', name);
    }
    const handleAdd = (name: string) => {
        console.log('Send add request to', name);
    }

    const itemsToShow = sample
        .filter(s => filter === 'all' ? true : !!s.suggested)
        .filter(s => !query ? true : s.name.toLowerCase().includes(query.trim().toLowerCase()))

    return(
        <div className="container container-1200">
            <div className="connect-form">
                <div className="connect-filters">
                    <input
                        className="search-input"
                        placeholder="Search by name..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        aria-label="Search people by name"
                    />
                    <button className={`filter-btn ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>All</button>
                    <button className={`filter-btn ${filter === 'suggested' ? 'active' : ''}`} onClick={() => setFilter('suggested')}>Suggested</button>
                </div>
                <div className="row row-collapse">
                    {itemsToShow.map((f) => (
                        <ItemConnectPerson
                            key={f.id}
                            avatar={f.avatar}
                            name={f.name}
                            location={f.location}
                            age={f.age}
                            about={f.about}
                            onWatchProfile={() => handleWatch(f.name)}
                            onAdd={() => handleAdd(f.name)}
                        />
                    ))}
                </div>
            </div>
        </div>
    )

}