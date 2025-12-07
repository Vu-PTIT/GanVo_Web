import { useEffect, useState } from "react";
import { useFriendStore } from "@/stores/useFriendStore";
import { useAuthStore } from "@/stores/useAuthStore";
import { useConversationStore } from "@/stores/useConversationStore";
import { useChatStore } from "@/stores/useChatStore";
import { UserPlus, LogOut, MessageSquare } from "lucide-react";
import "./Sidebar.css";

const Sidebar = () => {
    const {
        friends,
        fetchFriends,
        subscribeToFriendUpdates,
        unsubscribeFromFriendUpdates
    } = useFriendStore();

    const { user: currentUser, signOut } = useAuthStore();
    const { getOrCreateDirectConversation } = useConversationStore();
    const { setSelectedConversationId } = useChatStore();

    const [showAddFriend, setShowAddFriend] = useState(false);

    useEffect(() => {
        fetchFriends();
        subscribeToFriendUpdates();
        return () => unsubscribeFromFriendUpdates();
    }, [fetchFriends, subscribeToFriendUpdates, unsubscribeFromFriendUpdates]);

    const handleStartChat = async (friendId: string) => {
        const conversationId = await getOrCreateDirectConversation(friendId);
        if (conversationId) {
            setSelectedConversationId(conversationId);
        }
    };

    return (
        <div className="sidebar">
            {/* User Header */}
            <div className="sidebar-header">
                <div className="user-profile">
                    <img
                        src={currentUser?.avatarUrl || "/avatar.png"}
                        alt="Avatar"
                        className="user-avatar"
                    />
                    <span className="user-name">{currentUser?.displayName}</span>
                </div>
                <div className="sidebar-actions">
                    <button
                        onClick={() => setShowAddFriend(true)}
                        className="sidebar-button add-friend-button"
                        title="Add Friend"
                    >
                        <UserPlus className="button-icon" />
                    </button>
                    <button
                        onClick={signOut}
                        className="sidebar-button logout-button"
                        title="Logout"
                    >
                        <LogOut className="button-icon" />
                    </button>
                </div>
            </div>

            {/* Friends List */}
            <div className="sidebar-content">
                {friends.length === 0 ? (
                    <div className="empty-friends">
                        No friends yet.
                        <br />
                        Click <UserPlus className="inline-icon" /> to add someone!
                    </div>
                ) : (
                    <div className="friends-list">
                        {friends.map(friend => (
                            <div key={friend._id} className="friend-item">
                                <div className="friend-info">
                                    <img
                                        src={friend.avatarUrl || "/avatar.png"}
                                        alt={friend.username}
                                        className="friend-avatar"
                                    />
                                    <div className="friend-details">
                                        <span className="friend-name">{friend.displayName}</span>
                                        <span className="friend-username">@{friend.username}</span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleStartChat(friend._id)}
                                    className="friend-action-button"
                                    title="Message"
                                >
                                    <MessageSquare className="button-icon" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

        </div>
    );
};

export default Sidebar;
