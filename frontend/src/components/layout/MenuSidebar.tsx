import React, { useState, useRef } from 'react';
import { X, LogOut, Camera } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { userApi } from '@/api/user.api';
import { authApi } from '@/api/auth.api';
import { useNavigate } from 'react-router-dom';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ROUTES } from '@/utils/routes';

interface MenuSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MenuSidebar: React.FC<MenuSidebarProps> = ({ isOpen, onClose }) => {
  const { user, updateUser, logout } = useAuthStore();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState(user?.name || '');
  const [isLoading, setIsLoading] = useState(false);

  // Đổi tên
  const handleUpdateName = async () => {
    if (!newName.trim() || newName === user?.name) {
      setIsEditingName(false);
      return;
    }

    setIsLoading(true);
    try {
      const updatedUser = await userApi.updateName({ name: newName });
      updateUser(updatedUser);
      setIsEditingName(false);
    } catch (error) {
      console.error('Update name failed:', error);
      alert('Không thể cập nhật tên');
    } finally {
      setIsLoading(false);
    }
  };

  // Đổi avatar
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    if (!file.type.startsWith('image/')) {
      alert('Vui lòng chọn file ảnh');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB
      alert('Kích thước ảnh tối đa 5MB');
      return;
    }

    setIsLoading(true);
    try {
      const updatedUser = await userApi.updateAvatar(file);
      updateUser(updatedUser);
    } catch (error) {
      console.error('Update avatar failed:', error);
      alert('Không thể cập nhật avatar');
    } finally {
      setIsLoading(false);
    }
  };

  // Dangxuar
  const handleLogout = () => {
    authApi.logout();
    logout();
    navigate(ROUTES.SIGNIN);
    onClose();
  };

  if (!user) return null;

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-50 transition-opacity"
          onClick={onClose}
        />
      )}
      <div
        className={`fixed top-0 left-0 bottom-0 w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-xl font-semibold">Tài khoản</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-6">
            <div className="flex flex-col items-center mb-6">
              <div className="relative">
                <Avatar src={user.avatar} size="xl" />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 p-2 bg-primary text-white rounded-full hover:bg-primary-dark transition-colors"
                  disabled={isLoading}
                >
                  <Camera className="w-4 h-4" />
                </button>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
            </div>

            {/* Name */}
            <div className="mb-4">
              {isEditingName ? (
                <div className="space-y-2">
                  <Input
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Nhập tên mới"
                    disabled={isLoading}
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <Button
                      onClick={handleUpdateName}
                      disabled={isLoading}
                      size="sm"
                      className="flex-1"
                    >
                      Lưu
                    </Button>
                    <Button
                      onClick={() => {
                        setIsEditingName(false);
                        setNewName(user.name);
                      }}
                      variant="ghost"
                      size="sm"
                      className="flex-1"
                    >
                      Hủy
                    </Button>
                  </div>
                </div>
              ) : (
                <div>
                  <p className="text-sm text-gray-500">Tên tài khoản</p>
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-semibold">{user.name}</p>
                    <Button
                      onClick={() => setIsEditingName(true)}
                      variant="ghost"
                      size="sm"
                    >
                      Đổi
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* email */}
            <div className="mb-6">
              <p className="text-sm text-gray-500">Email</p>
              <p className="text-base">{user.email}</p>
            </div>

            <div className="border-t pt-4">
              <Button
                onClick={() => fileInputRef.current?.click()}
                variant="secondary"
                className="w-full mb-3"
                disabled={isLoading}
              >
                Thay đổi ảnh đại diện
              </Button>
            </div>
          </div>
          <div className="p-4 border-t">
            <Button
              onClick={handleLogout}
              variant="danger"
              className="w-full flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Đăng xuất
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};