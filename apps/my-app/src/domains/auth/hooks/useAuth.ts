import { useNavigate } from '@tanstack/react-router';
import { useAuthStore } from '../stores/useAuthStore';

export const useAuth = () => {
  const navigate = useNavigate();
  const { user, accessToken, refreshToken, setTokens, setUser, clearAuth } = useAuthStore();

  const signIn = (tokens: { accessToken: string; refreshToken: string }) => {
    setTokens(tokens);
  };

  const signOut = () => {
    clearAuth();
    navigate({ to: '/' });
  };

  return {
    user,
    accessToken,
    refreshToken,
    signIn,
    setTokens,
    setUser,
    signOut,
  };
};
