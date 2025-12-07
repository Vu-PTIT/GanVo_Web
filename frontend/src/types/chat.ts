export interface Message {
  _id: string;
  conversationId: string;
  senderId: {
    _id: string;
    username: string;
    displayName: string;
    avatarUrl?: string;
  };
  content: string;
  imgUrl?: string;
  createdAt: string;
}

export interface Participant {
  userId: {
    _id: string;
    username: string;
    displayName: string;
    avatarUrl?: string;
  };
  joinedAt: string;
}

export interface Conversation {
  _id: string;
  type: "direct" | "group";
  participants: Participant[];
  group?: {
    name: string;
    createdBy: string;
  };
  lastMessageAt?: string;
  lastMessage?: {
    _id: string;
    content: string;
    senderId: string;
    createdAt: string;
  };
  unreadCounts?: Record<string, number>;
}
