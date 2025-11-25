import { useAuthStore } from '../stores/useAuthStore';

export const useAuth = () => {
  const { accessToken, refreshToken, user, setTokens, setUser, signOut } = useAuthStore();

  return {
    user,
    accessToken,
    refreshToken,
    setTokens,
    setUser,
    signOut,
  };
};
