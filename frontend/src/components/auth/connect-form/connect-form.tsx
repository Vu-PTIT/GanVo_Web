import './connect-form.css';
import '../../../assets/css/asset.css';
import { useState, useEffect } from 'react';
import axiosInstance from '../../../lib/axios';
import ItemConnectPerson from '../../ui/item-connect-person/item-connect-person';
import type { FriendItem } from '../../ui/item-connect-person/item-connect-person';

export function ConnectForm(){
    const [people, setPeople] = useState<(FriendItem & { suggested?: boolean })[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all'|'suggested'>('all');
    const [query, setQuery] = useState('');

    // Fetch people data on component mount
    useEffect(() => {
        const fetchPeople = async () => {
            try {
                        // Use match explore endpoint
                        const response = await axiosInstance.get('/match/explore');
                        const raw = response.data;
                        const data = Array.isArray(raw) ? raw : raw.data || raw.items || [];

                        // map various possible shapes returned by /match/explore
                        const mappedPeople = data.map((item: any) => {
                            // API shape example (provided): {
                            //   _id, displayName, avatarUrl, bio, gender, age, location, interests, photos, matchScore
                            // }
                            const person = item.person || item.user || item.recipient || item.requester || item;
                            // prefer direct fields (_id, displayName, avatarUrl, bio)
                            const id = person._id || person.id || item._id || item.id;
                            const name = person.displayName || person.name || person.username || '';
                            const avatar = person.avatarUrl || person.avatar || person.photo || '/img/default-avatar.jpg';
                            const about = person.bio || person.about || item.note || '';
                            const age = person.age ?? person.matchScore ?? 0;
                            const location = person.location || person.city || '';
                            const suggested = !!item.suggested || !!person.suggested;

                            return {
                                id,
                                name,
                                avatar,
                                age,
                                location,
                                about,
                                suggested,
                            } as FriendItem & { suggested?: boolean };
                        });
                setPeople(mappedPeople);
            } catch (error) {
                console.error('Failed to fetch people:', error);
                setPeople([]);
            } finally {
                setLoading(false);
            }
        };
        fetchPeople();
    }, []);

    const handleWatch = (name: string) => {
        console.log('Watch profile', name);
    }
    const handleAdd = (name: string) => {
        console.log('Send add request to', name);
    }

    const itemsToShow = people
        .filter((s) => filter === 'all' ? true : !!s.suggested)
        .filter((s) => !query ? true : s.name.toLowerCase().includes(query.trim().toLowerCase()))

    if (loading) {
        return (
            <div className="container container-1200">
                <div className="connect-form">
                    <div style={{ textAlign: 'center', padding: '40px' }}>
                        <p>Đang tải dữ liệu...</p>
                    </div>
                </div>
            </div>
        );
    }

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
                            key={f.id ?? f.name}
                            id={f.id}
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