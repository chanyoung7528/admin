import { useNavigate } from '@tanstack/react-router';
import { useCallback } from 'react';
import { clearPersistedSession, persistTokens } from '../lib/tokenManager';
import type { AuthTokens } from '../stores/useAuthStore';
import { useAuthStore } from '../stores/useAuthStore';

export { initializeAuthSession } from '../lib/tokenManager';
export { ACCESS_TOKEN_COOKIE_KEY, REFRESH_TOKEN_COOKIE_KEY } from '../types';

/**
 * 인증 관련 기능을 제공하는 훅
 */
export function useAuth() {
  const navigate = useNavigate();
  const user = useAuthStore(state => state.user);
  const accessToken = useAuthStore(state => state.accessToken);
  const refreshToken = useAuthStore(state => state.refreshToken);
  const setUser = useAuthStore(state => state.setUser);

  const setTokens = useCallback(async (tokens: AuthTokens) => {
    await persistTokens(tokens);
  }, []);

  const signOut = useCallback(async () => {
    await clearPersistedSession();
    navigate({
      to: '/login',
      replace: true,
    });
  }, [navigate]);

  return {
    user,
    accessToken,
    refreshToken,
    setUser,
    setTokens,
    signOut,
  };
}
