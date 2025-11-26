import { useNavigate } from '@tanstack/react-router';
import { useAuthStore } from '../stores/useAuthStore';

export const useAuth = () => {
  const navigate = useNavigate();
  const { user, accessToken, refreshToken, setTokens, setUser, clearAuth } = useAuthStore();

  const signOut = () => {
    clearAuth();
    navigate({ to: '/' });
  };

  return {
    user,
    accessToken,
    refreshToken,
    isLogin: !!accessToken,
    setTokens,
    setUser,
    signOut,
  };
};
