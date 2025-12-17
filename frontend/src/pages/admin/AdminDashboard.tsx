import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, Image, AlertTriangle, Activity } from 'lucide-react';
import { adminApi, DashboardStats } from '@/api/admin.api';
import { ROUTES } from '@/utils/routes';

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await adminApi.getDashboardStats();
      setStats(data);
    } catch (error) {
      console.error('Load stats failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate(ROUTES.HOME)} className="p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-semibold">Admin Dashboard</h1>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : stats ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Total Users</p>
                  <p className="text-3xl font-bold mt-2">{stats.totalUsers}</p>
                </div>
                <Users className="w-12 h-12 text-blue-600" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Active Users</p>
                  <p className="text-3xl font-bold mt-2">{stats.activeUsers}</p>
                </div>
                <Activity className="w-12 h-12 text-green-600" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Banned Users</p>
                  <p className="text-3xl font-bold mt-2">{stats.bannedUsers}</p>
                </div>
                <AlertTriangle className="w-12 h-12 text-red-600" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Total Photos</p>
                  <p className="text-3xl font-bold mt-2">{stats.totalPhotos}</p>
                </div>
                <Image className="w-12 h-12 text-purple-600" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Reported Photos</p>
                  <p className="text-3xl font-bold mt-2">{stats.reportedPhotos}</p>
                </div>
                <AlertTriangle className="w-12 h-12 text-orange-600" />
              </div>
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-500">Failed to load stats</p>
        )}

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => navigate(ROUTES.ADMIN_USERS)}
            className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition-shadow text-left"
          >
            <h3 className="font-semibold text-lg mb-2">User Management</h3>
            <p className="text-gray-600 text-sm">Manage users, ban/unban accounts</p>
          </button>

          <button
            onClick={() => navigate(ROUTES.ADMIN_PHOTOS)}
            className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition-shadow text-left"
          >
            <h3 className="font-semibold text-lg mb-2">Photo Management</h3>
            <p className="text-gray-600 text-sm">Review reported photos</p>
          </button>

          <button
            onClick={() => navigate(ROUTES.ADMIN_LOGS)}
            className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition-shadow text-left"
          >
            <h3 className="font-semibold text-lg mb-2">Activity Logs</h3>
            <p className="text-gray-600 text-sm">View admin activity history</p>
          </button>
        </div>
      </div>
    </div>
  );
};
