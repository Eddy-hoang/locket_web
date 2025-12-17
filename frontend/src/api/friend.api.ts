import axios from './axios.config';
import { Friendship, User, ApiResponse } from '@/types';

export const friendApi = {
  // add face
  sendFriendRequest: async (friendId: number): Promise<Friendship> => {
    const response = await axios.post<ApiResponse<Friendship>>('/friend/request', { friendId });
    return response.data.data!;
  },
  // chapnhan
  acceptFriendRequest: async (friendshipId: number): Promise<Friendship> => {
    const response = await axios.put<ApiResponse<Friendship>>(`/friend/accept/${friendshipId}`);
    return response.data.data!;
  },
  // tuchoi
  rejectFriendRequest: async (friendshipId: number): Promise<void> => {
    await axios.put(`/friend/reject/${friendshipId}`);
  },
  // list fen
  getFriends: async (): Promise<User[]> => {
    const response = await axios.get<ApiResponse<User[]>>('/friend/list');
    return response.data.data!;
  },
  // list mời chờ 
  getPendingRequests: async (): Promise<Friendship[]> => {
    const response = await axios.get<ApiResponse<Friendship[]>>('/friend/pending');
    return response.data.data!;
  },
  // mat kett noi
  removeFriend: async (friendId: number): Promise<void> => {
    await axios.delete(`/friend/${friendId}`);
  },
  searchUsers: async (query: string): Promise<User[]> => {
    const response = await axios.get<ApiResponse<User[]>>('/friend/search', {
      params: { q: query },
    });
    return response.data.data!;
  },
};