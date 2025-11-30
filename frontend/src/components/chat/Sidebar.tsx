import { useEffect, useState } from "react";
import { useFriendStore } from "@/stores/useFriendStore";
import { useAuthStore } from "@/stores/useAuthStore";
import { useConversationStore } from "@/stores/useConversationStore";
import { useChatStore } from "@/stores/useChatStore";
import { UserPlus, LogOut, MessageSquare, Check, X } from "lucide-react";
import AddFriendModal from "./AddFriendModal";

const Sidebar = () => {
    const {
        friends,
        friendRequests,
        fetchFriends,
        fetchFriendRequests,
        acceptFriendRequest,
        declineFriendRequest,
        subscribeToFriendUpdates,
        unsubscribeFromFriendUpdates
    } = useFriendStore();

    const { user: currentUser, signOut } = useAuthStore();
    const { getOrCreateDirectConversation } = useConversationStore();
    const { setSelectedConversationId } = useChatStore();

    const [showAddFriend, setShowAddFriend] = useState(false);
    const [activeTab, setActiveTab] = useState<"friends" | "requests">("friends");

    useEffect(() => {
        fetchFriends();
        fetchFriendRequests();
        subscribeToFriendUpdates();
        return () => unsubscribeFromFriendUpdates();
    }, [fetchFriends, fetchFriendRequests, subscribeToFriendUpdates, unsubscribeFromFriendUpdates]);

    const handleStartChat = async (friendId: string) => {
        const conversationId = await getOrCreateDirectConversation(friendId);
        if (conversationId) {
            setSelectedConversationId(conversationId);
        }
    };

    return (
        <div className="flex flex-col h-full bg-base-200 w-full">
            {/* User Header */}
            <div className="p-4 border-b border-base-300 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <img
                        src={currentUser?.avatarUrl || "/avatar.png"}
                        alt="Avatar"
                        className="size-8 rounded-full object-cover border border-base-300"
                    />
                    <span className="font-bold text-sm truncate max-w-[120px]">{currentUser?.displayName}</span>
                </div>
                <div className="flex gap-1">
                    <button
                        onClick={() => setShowAddFriend(true)}
                        className="btn btn-ghost btn-sm btn-circle"
                        title="Add Friend"
                    >
                        <UserPlus className="size-5" />
                    </button>
                    <button
                        onClick={signOut}
                        className="btn btn-ghost btn-sm btn-circle text-error"
                        title="Logout"
                    >
                        <LogOut className="size-5" />
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-base-300">
                <button
                    onClick={() => setActiveTab("friends")}
                    className={`flex-1 py-3 text-sm font-medium transition-colors relative ${activeTab === "friends" ? "text-primary" : "text-base-content/60 hover:text-base-content"
                        }`}
                >
                    Friends
                    {activeTab === "friends" && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                    )}
                </button>
                <button
                    onClick={() => setActiveTab("requests")}
                    className={`flex-1 py-3 text-sm font-medium transition-colors relative ${activeTab === "requests" ? "text-primary" : "text-base-content/60 hover:text-base-content"
                        }`}
                >
                    Requests
                    {friendRequests.length > 0 && (
                        <span className="ml-1 badge badge-sm badge-primary">{friendRequests.length}</span>
                    )}
                    {activeTab === "requests" && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                    )}
                </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
                {activeTab === "friends" ? (
                    friends.length === 0 ? (
                        <div className="text-center py-8 text-base-content/50 text-sm">
                            No friends yet.
                            <br />
                            Click <UserPlus className="inline size-4" /> to add someone!
                        </div>
                    ) : (
                        <div className="space-y-1">
                            {friends.map(friend => (
                                <div key={friend._id} className="flex items-center justify-between p-2 hover:bg-base-300 rounded-lg group">
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={friend.avatarUrl || "/avatar.png"}
                                            alt={friend.username}
                                            className="size-10 rounded-full object-cover border border-base-300"
                                        />
                                        <div className="flex flex-col">
                                            <span className="font-medium text-sm">{friend.displayName}</span>
                                            <span className="text-xs text-base-content/50">@{friend.username}</span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleStartChat(friend._id)}
                                        className="btn btn-ghost btn-sm btn-circle opacity-0 group-hover:opacity-100 transition-opacity"
                                        title="Message"
                                    >
                                        <MessageSquare className="size-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )
                ) : (
                    friendRequests.length === 0 ? (
                        <div className="text-center py-8 text-base-content/50 text-sm">
                            No pending requests.
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {friendRequests.map(req => (
                                <div key={req._id} className="p-3 bg-base-100 rounded-lg border border-base-300 shadow-sm">
                                    <div className="flex items-center gap-3 mb-3">
                                        <img
                                            src={req.from.avatarUrl || "/avatar.png"}
                                            alt={req.from.username}
                                            className="size-10 rounded-full object-cover border border-base-300"
                                        />
                                        <div>
                                            <span className="font-medium text-sm block">{req.from.displayName}</span>
                                            <span className="text-xs text-base-content/50">sent you a request</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => acceptFriendRequest(req._id)}
                                            className="btn btn-primary btn-sm flex-1 gap-1"
                                        >
                                            <Check className="size-4" /> Accept
                                        </button>
                                        <button
                                            onClick={() => declineFriendRequest(req._id)}
                                            className="btn btn-ghost btn-sm flex-1 gap-1"
                                        >
                                            <X className="size-4" /> Decline
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )
                )}
            </div>

            <AddFriendModal isOpen={showAddFriend} onClose={() => setShowAddFriend(false)} />
        </div>
    );
};

export default Sidebar;
