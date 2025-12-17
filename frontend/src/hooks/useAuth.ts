import { useAuthStore } from '@/store/authStore';

export const useAuth = () => {
  const { user, token, isAuthenticated, setAuth, updateUser, logout } = useAuthStore();

  return {
    user,
    token,
    isAuthenticated,
    setAuth,
    updateUser,
    logout,
  };
};