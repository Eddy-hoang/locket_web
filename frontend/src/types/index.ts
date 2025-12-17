// ==================== USER ====================
export interface User {
  userId: number;
  name: string;
  email: string;
  avatar: string;
  role: 'USER' | 'ADMIN';
  status: 'ACTIVE' | 'BANNED' | 'SUSPENDED';
  bannedReason?: string;
  bannedAt?: string;
  bannedBy?: number;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// ==================== PHOTO ====================
export interface Photo {
  photoId: number;
  userId: number;
  imageUrl: string;
  isReported: boolean;
  reportCount: number;
  status: 'ACTIVE' | 'HIDDEN' | 'DELETED';
  createdAt: string;
  user?: User; // Populated when fetching feed
}

export interface PhotoWithReactions extends Photo {
  reactions: Reaction[];
  reactionCount: { [key: string]: number };
}

// ==================== FRIENDSHIP ====================
export interface Friendship {
  id: number;
  userId: number;
  friendId: number;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  createdAt: string;
  friend?: User; // Populated
}

// ==================== MESSAGE ====================
export interface Message {
  messageId: number;
  senderId: number;
  receiverId: number;
  content: string;
  messageType: 'NORMAL' | 'PHOTO_REPLY';
  refPhotoId?: number;
  createdAt: string;
  isRead: boolean;
  sender?: User;
  photo?: Photo; // If PHOTO_REPLY
}

// ==================== REACTION ====================
export interface Reaction {
  reactionId: number;
  photoId: number;
  userId: number;
  emojiType: string;
  createdAt: string;
  user?: User;
}

// ==================== NOTIFICATION ====================
export interface Notification {
  notificationId: number;
  userId: number;
  type: 'FRIEND_REQUEST' | 'MESSAGE' | 'REACTION' | 'PHOTO_UPLOAD';
  content: string;
  refId?: number;
  isRead: boolean;
  createdAt: string;
}

// ==================== API REQUESTS ====================
export interface SignUpRequest {
  fullName: string;         // ← Changed from 'name' to 'fullName'
  email: string;
  password: string;
  confirmPassword: string;  // ← Added confirmPassword
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface UpdateNameRequest {
  name: string;
}

export interface SendMessageRequest {
  receiverId: number;
  content: string;
  messageType?: 'NORMAL' | 'PHOTO_REPLY';
  refPhotoId?: number;
}

export interface AddReactionRequest {
  photoId: number;
  emojiType: string;
}

// ==================== API RESPONSES ====================
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

// ==================== WEBSOCKET ====================
export interface WebSocketMessage {
  type: 'MESSAGE' | 'NOTIFICATION' | 'TYPING';
  payload: any;
}

export interface SignUpRequest {
  fullName: string;  // Frontend dùng
  email: string;
  password: string;
  confirmPassword: string;  // Chỉ để validate ở frontend
}

// Payload gửi lên backend
export interface SignUpPayload {
  name: string;      // Backend cần
  email: string;
  password: string;
}