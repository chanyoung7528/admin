import { useNavigate } from '@tanstack/react-router';
import { useAuthStore } from '../stores/useAuthStore';

export const useAuth = () => {
  const navigate = useNavigate();
  const { user, accessToken, refreshToken, setTokens, setUser, clearAuth } = useAuthStore();

  const isAuthenticated = Boolean(accessToken);

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
    isAuthenticated,
    signIn,
    setTokens,
    setUser,
    signOut,
  };
};
