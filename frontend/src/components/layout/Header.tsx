import React, { useState } from 'react';
import { Menu, MessageCircle, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MenuSidebar } from './MenuSidebar';
import { useChatStore } from '@/store/chatStore';
import { useAuthStore } from '@/store/authStore';
import { ROUTES } from '@/utils/routes';

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const unreadCount = useChatStore((state) => state.unreadCount);
  const user = useAuthStore((state) => state.user);
  const isAdmin = user?.role === 'ADMIN';

  return (
    <>
      <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-40">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
          {/* Menu Button */}
          <button
            onClick={() => setIsMenuOpen(true)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Menu className="w-6 h-6 text-gray-700" />
          </button>

          {/* Title */}
          <h1 className="text-lg font-semibold text-gray-900">Bạn bè</h1>

          {/* Right buttons */}
          <div className="flex items-center gap-2">
            {/* Admin Button (only for admin) */}
            {isAdmin && (
              <button
                onClick={() => navigate(ROUTES.ADMIN_DASHBOARD)}
                className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
                title="Admin Panel"
              >
                <Shield className="w-6 h-6 text-blue-600" />
              </button>
            )}

            {/* Chat Button */}
            <button
              onClick={() => navigate(ROUTES.FRIENDS)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative"
            >
              <MessageCircle className="w-6 h-6 text-gray-700" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Menu Sidebar */}
      <MenuSidebar isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  );
};