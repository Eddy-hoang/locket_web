import axios from './axios.config';
import { Reaction, AddReactionRequest, ApiResponse } from '@/types';

export const reactionApi = {
  
  addReaction: async (data: AddReactionRequest): Promise<Reaction> => {
    const response = await axios.post<ApiResponse<Reaction>>('/reaction/add', data);
    return response.data.data!;
  },
  removeReaction: async (reactionId: number): Promise<void> => {
    await axios.delete(`/reaction/${reactionId}`);
  },

  // Lay reac 1 anh
  getReactionsByPhoto: async (photoId: number): Promise<Reaction[]> => {
    const response = await axios.get<ApiResponse<Reaction[]>>(`/reaction/photo/${photoId}`);
    return response.data.data!;
  },
  // nếu có thì xóa đéo thì thì quay về add
  toggleReaction: async (photoId: number, emojiType: string): Promise<Reaction | null> => {
    const response = await axios.post<ApiResponse<Reaction | null>>('/reaction/toggle', {
      photoId,
      emojiType,
    });
    return response.data.data!;
  },
};