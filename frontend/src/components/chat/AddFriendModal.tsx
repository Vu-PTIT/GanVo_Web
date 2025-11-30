import { useState } from "react";
import { useFriendStore } from "@/stores/useFriendStore";
import { useAuthStore } from "@/stores/useAuthStore";
import { Search, UserPlus, X, Loader2, User } from "lucide-react";
import axiosInstance from "@/lib/axios";
import { toast } from "sonner";

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

interface SearchUser {
    _id: string;
    username: string;
    displayName: string;
    avatarUrl?: string;
}

const AddFriendModal = ({ isOpen, onClose }: Props) => {
    const [query, setQuery] = useState("");
    const [searchResults, setSearchResults] = useState<SearchUser[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const { sendFriendRequest, friends, friendRequests } = useFriendStore();
    const { user: authUser } = useAuthStore();

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;

        setIsSearching(true);
        try {
            const res = await axiosInstance.get(`/users?search=${query.trim()}`);
            setSearchResults(res.data);
        } catch (error) {
            console.error("Error searching users:", error);
            toast.error("Failed to search users");
        } finally {
            setIsSearching(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
            <div
                className="bg-base-100 border border-base-300 rounded-xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all scale-100 animate-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-4 border-b border-base-300 flex justify-between items-center bg-base-200">
                    <div>
                        <h3 className="font-bold text-lg text-base-content">Find Friends</h3>
                        <p className="text-xs text-base-content/70">Search by username or email</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="btn btn-ghost btn-sm btn-circle"
                    >
                        <X className="size-5" />
                    </button>
                </div>

                <div className="p-4 bg-base-100">
                    <form onSubmit={handleSearch} className="relative mb-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-base-content/50" />
                            <input
                                type="text"
                                className="input input-bordered w-full pl-10 pr-20 bg-base-100 text-base-content"
                                placeholder="Search..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                autoFocus
                            />
                            <button
                                type="submit"
                                className="absolute right-1 top-1/2 -translate-y-1/2 btn btn-sm btn-primary"
                                disabled={isSearching || !query.trim()}
                            >
                                {isSearching ? <Loader2 className="size-4 animate-spin" /> : "Search"}
                            </button>
                        </div>
                    </form>

                    <div className="space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar">
                        {searchResults.length > 0 ? (
                            searchResults.map((user) => {
                                const isSelf = user._id === authUser?._id;
                                const isFriend = Array.isArray(friends) && friends.some(f => f._id === user._id);
                                const isPending = Array.isArray(friendRequests) && friendRequests.some(req =>
                                    (req.to?._id === user._id) || (req.from?._id === user._id)
                                );

                                return (
                                    <div
                                        key={user._id}
                                        className="flex items-center justify-between p-3 bg-base-200/50 hover:bg-base-200 rounded-lg transition-colors border border-base-200"
                                    >
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={user.avatarUrl || "/avatar.png"}
                                                alt={user.username}
                                                className="size-10 rounded-full object-cover border border-base-300"
                                            />
                                            <div className="flex flex-col">
                                                <span className="font-semibold text-sm text-base-content">{user.displayName || user.username}</span>
                                                <span className="text-xs text-base-content/60">@{user.username}</span>
                                            </div>
                                        </div>
                                        {isSelf ? (
                                            <button className="btn btn-sm btn-disabled btn-ghost" title="You">
                                                <User className="size-5" />
                                            </button>
                                        ) : isFriend ? (
                                            <button className="btn btn-sm btn-disabled btn-ghost text-success" title="Already Friends">
                                                <User className="size-5" />
                                            </button>
                                        ) : isPending ? (
                                            <button className="btn btn-sm btn-disabled btn-ghost text-warning" title="Request Pending">
                                                <User className="size-5" />
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => sendFriendRequest(user._id)}
                                                className="btn btn-sm btn-ghost text-primary hover:bg-primary/10"
                                                title="Add Friend"
                                            >
                                                <UserPlus className="size-5" />
                                            </button>
                                        )}
                                    </div>
                                );
                            })
                        ) : (
                            query && !isSearching && (
                                <div className="text-center py-8 text-base-content/50">
                                    <p>No users found matching "{query}"</p>
                                </div>
                            )
                        )}

                        {!query && !isSearching && (
                            <div className="text-center py-8 text-base-content/50">
                                <p>Enter a username to search</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddFriendModal;
