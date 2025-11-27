import { createAuthStoreAdapter, refreshSessionTokens } from '@/domains/auth/services/authService';
import { useAuthStore } from '@/domains/auth/stores/useAuthStore';
import { configureApiAuth } from '@repo/core/api';

export function setupApiClient() {
  if (typeof window === 'undefined') return;

  const authStore = createAuthStoreAdapter(useAuthStore);

  configureApiAuth({
    getAccessToken: () => authStore.getAccessToken(),
    getRefreshToken: () => authStore.getRefreshToken(),
    refreshTokens: async refreshToken => {
      const tokens = await refreshSessionTokens(refreshToken, authStore);
      return tokens;
    },
    onAuthFailure: () => {
      authStore.clearAuth();
      window.location.href = '/login';
    },
  });
}
