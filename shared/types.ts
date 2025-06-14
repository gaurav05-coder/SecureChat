// Shared TypeScript types for SecureChat
export interface UserProfile {
  id: string;
  username: string;
  publicKey: string;
  role: 'admin' | 'member';
}

export interface ChatMessage {
  id: string;
  senderId: string;
  chatRoomId: string;
  content: string; // encrypted
  timestamp: number;
  selfDestructAt?: number;
  fileUrl?: string;
}

export interface ChatRoom {
  id: string;
  name: string;
  members: string[];
  admins: string[];
}
