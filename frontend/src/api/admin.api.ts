import axios from './axios.config';
import { ApiResponse } from '@/types';

export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  bannedUsers: number;
  totalPhotos: number;
  reportedPhotos: number;
}

export interface PhotoReport {
  reportId: number;
  photoId: number;
  photoUrl: string;
  reporterId: number;
  reporterName: string;
  reason: string;
  description: string;
  status: string;
  createdAt: string;
}

export interface AdminLog {
  logId: number;
  adminName: string;
  action: string;
  targetType: string;
  targetId: number;
  reason: string;
  createdAt: string;
}

export const adminApi = {
  // Dashboard
  getDashboardStats: async (): Promise<DashboardStats> => {
    const response = await axios.get<ApiResponse<DashboardStats>>('/admin/dashboard/stats');
    return response.data.data!;
  },

  // User Management
  getAllUsers: async (page: number = 0, size: number = 20) => {
    const response = await axios.get<ApiResponse<any>>('/admin/users', {
      params: { page, size },
    });
    return response.data.data!;
  },

  searchUsers: async (query: string, page: number = 0, size: number = 20) => {
    const response = await axios.get<ApiResponse<any>>('/admin/users/search', {
      params: { query, page, size },
    });
    return response.data.data!;
  },

  banUser: async (userId: number, reason: string): Promise<void> => {
    await axios.post(`/admin/users/${userId}/ban`, { reason });
  },

  unbanUser: async (userId: number): Promise<void> => {
    await axios.post(`/admin/users/${userId}/unban`);
  },

  deleteUser: async (userId: number, reason?: string): Promise<void> => {
    await axios.delete(`/admin/users/${userId}`, {
      params: { reason },
    });
  },

  // Photo Management
  getReportedPhotos: async (page: number = 0, size: number = 20) => {
    const response = await axios.get<ApiResponse<any>>('/admin/photos/reported', {
      params: { page, size },
    });
    return response.data.data!;
  },

  deletePhoto: async (photoId: number, reason: string): Promise<void> => {
    await axios.delete(`/admin/photos/${photoId}`, {
      data: { reason },
    });
  },

  dismissReport: async (reportId: number, reason?: string): Promise<void> => {
    await axios.post(`/admin/reports/${reportId}/dismiss`, null, {
      params: { reason },
    });
  },

  // Logs
  getAdminLogs: async (page: number = 0, size: number = 50) => {
    const response = await axios.get<ApiResponse<any>>('/admin/logs', {
      params: { page, size },
    });
    return response.data.data!;
  },
};
