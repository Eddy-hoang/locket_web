import axios from './axios.config';
import { User, UpdateNameRequest, ApiResponse } from '@/types';

export const userApi = {
  // Lấy thông tin user hiện tại
  getMe: async (): Promise<User> => {
    const response = await axios.get<ApiResponse<User>>('/user/me');
    return response.data.data!;
  },

  // Cập nhật tên
  updateName: async (data: UpdateNameRequest): Promise<User> => {
    const response = await axios.put<ApiResponse<User>>('/user/update-name', data);
    return response.data.data!;
  },

  // Cập nhật avatar
  updateAvatar: async (file: File): Promise<User> => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await axios.post<ApiResponse<User>>('/user/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data!;
  },

  // Lấy thông tin user khác ID
  getUserById: async (userId: number): Promise<User> => {
    const response = await axios.get<ApiResponse<User>>(`/user/${userId}`);
    return response.data.data!;
  },
};