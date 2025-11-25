import { useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';

export const useAuth = () => {
  const { user, accessToken, isAuthenticated, isLoading, setTokens, setUser, signOut: storeSignOut, checkAuth } = useAuthStore();

  // Initialize auth check on mount if needed
  useEffect(() => {
    if (!isAuthenticated && !accessToken && isLoading) {
      checkAuth();
    }
  }, [checkAuth, isAuthenticated, accessToken, isLoading]);

  const signOut = async () => {
    await storeSignOut();
    // Additional cleanup if needed (e.g. query cache reset)
  };

  const refreshToken = async () => {
    // TODO: Implement API call to refresh token
    // const newToken = await api.refreshToken();
    // await setTokens(newToken);
    console.warn('refreshToken implementation missing');
  };

  return {
    user,
    accessToken,
    isAuthenticated,
    isLoading,
    setTokens,
    setUser,
    signOut,
    refreshToken,
    checkAuth,
  };
};
