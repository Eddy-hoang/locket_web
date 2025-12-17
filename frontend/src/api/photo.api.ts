import axios from './axios.config';
import { Photo, PhotoWithReactions, ApiResponse } from '@/types';

export const photoApi = {
  uploadPhoto: async (file: File): Promise<Photo> => { // Upload ảnh
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await axios.post<ApiResponse<Photo>>('/photo/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data!;
  },

  getFeed: async (page: number = 0, size: number = 10): Promise<PhotoWithReactions[]> => { // Lấy feed ảnh fen
    const response = await axios.get<ApiResponse<PhotoWithReactions[]>>('/photo/feed', {
      params: { page, size },
    });
    return response.data.data!;
  },

 
  getPhotosByUser: async (userId: number): Promise<Photo[]> => { // Lấy ảnh của 1 fen
    const response = await axios.get<ApiResponse<Photo[]>>(`/photo/user/${userId}`);
    return response.data.data!;
  },

  
  deletePhoto: async (photoId: number): Promise<void> => {
    await axios.delete(`/photo/${photoId}`);
  },

  // Lấy chi tiết ảnh sắc nét
  getPhotoById: async (photoId: number): Promise<PhotoWithReactions> => {
    const response = await axios.get<ApiResponse<PhotoWithReactions>>(`/photo/${photoId}`);
    return response.data.data!;
  },
};