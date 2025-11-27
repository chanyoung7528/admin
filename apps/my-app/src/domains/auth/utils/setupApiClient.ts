import { configureApiAuth } from '@repo/core/api';
import { clearAuthSession, getAccessTokenSnapshot, getRefreshTokenSnapshot, refreshSessionTokens } from '../services/authService';

/**
 * API 클라이언트 인증 설정 초기화
 * 브라우저 환경에서만 실행
 */
if (typeof window !== 'undefined') {
  configureApiAuth({
    // 액세스 토큰 조회
    getAccessToken: getAccessTokenSnapshot,

    // 리프레시 토큰 조회
    getRefreshToken: getRefreshTokenSnapshot,

    // 토큰 갱신 로직
    refreshTokens: async refreshToken => {
      const tokens = await refreshSessionTokens(refreshToken);
      return tokens;
    },

    // 토큰 갱신 성공 시 (이미 authService에서 처리)
    onTokensUpdated: () => {
      // 필요시 추가 로직 (예: 분석 이벤트 전송)
    },

    // 인증 실패 시 처리
    onAuthFailure: () => {
      clearAuthSession();
      // 로그인 페이지로 리다이렉트
      window.location.href = '/login';
    },
  });
}
