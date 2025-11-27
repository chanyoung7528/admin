import { api, AUTH_ERROR_CODES, AuthError } from '@repo/core/api';
import type { AuthTokenResponse, AuthTokens, LoginPayload, RefreshTokenPayload } from '../utils/types';

/**
 * 인증 스토어 인터페이스
 * authService가 스토어에 직접 의존하지 않도록 추상화
 */
export interface AuthStore {
  getAccessToken: () => string | null;
  getRefreshToken: () => string | null;
  setTokens: (tokens: AuthTokens) => void;
  clearAuth: () => void;
}

/**
 * 로그인 토큰 발급 API
 * @param payload - 사용자 이름과 비밀번호
 */
export async function postAuthToken(payload: LoginPayload): Promise<AuthTokenResponse> {
  const { data } = await api.post<AuthTokenResponse>('/auth/token', payload, { skipAuth: true });
  return data;
}

/**
 * 리프레시 토큰 갱신 API
 * @param payload - 리프레시 토큰
 */
export async function postAuthRefreshToken(payload: RefreshTokenPayload): Promise<AuthTokenResponse> {
  const { data } = await api.post<AuthTokenResponse>('/auth/refresh-token', payload, {
    skipAuth: true,
  });
  return data;
}

/**
 * 로그인 및 세션 저장
 * @param payload - 로그인 정보
 * @param store - 인증 스토어
 */
export async function issueSessionTokens(payload: LoginPayload, store: AuthStore): Promise<AuthTokens> {
  const { result } = await postAuthToken(payload);
  if (!result) {
    throw new AuthError(AUTH_ERROR_CODES.INVALID_CREDENTIALS);
  }

  store.setTokens(result);
  return result;
}

/**
 * 리프레시 토큰으로 세션 갱신
 * @param refreshToken - 리프레시 토큰
 * @param store - 인증 스토어
 */
export async function refreshSessionTokens(refreshToken: string, store: AuthStore): Promise<AuthTokens> {
  if (!refreshToken) {
    throw new AuthError(AUTH_ERROR_CODES.MISSING_REFRESH_TOKEN);
  }

  const { result } = await postAuthRefreshToken({ refreshToken });
  if (!result) {
    throw new AuthError(AUTH_ERROR_CODES.REFRESH_FAILED);
  }

  store.setTokens(result);
  return result;
}

/**
 * Auth Store 팩토리 함수
 * 스토어 구현체를 주입받아 AuthStore 인터페이스로 변환
 */
export function createAuthStoreAdapter(store: {
  getState: () => {
    accessToken: string | null;
    refreshToken: string | null;
    setTokens: (tokens: AuthTokens) => void;
    clearAuth: () => void;
  };
}): AuthStore {
  return {
    getAccessToken: () => store.getState().accessToken,
    getRefreshToken: () => store.getState().refreshToken,
    setTokens: tokens => store.getState().setTokens(tokens),
    clearAuth: () => store.getState().clearAuth(),
  };
}
