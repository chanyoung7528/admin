import { configureAuth } from '@repo/core/api';

import { postAuthRefreshToken } from '@/domains/auth/services/authService';
import { useAuthStore } from '@/domains/auth/stores/useAuthStore';

export function setupApiClient() {
  if (typeof window === 'undefined') return;

  configureAuth({
    store: useAuthStore,
    refreshTokens: postAuthRefreshToken,
    onAuthFailure: () => {
      useAuthStore.getState().clearAuth();
      window.location.href = '/login';
    },
    onError: error => {
      // TODO: 에러 처리 다시 테스트
      if (error.message === 'NETWORK_ERROR') {
        alert('네트워크 연결을 확인해주세요.');
      } else if (error.message === 'SERVER_ERROR') {
        alert('서버에 일시적인 문제가 발생했습니다.');
      }
    },
  });
}
