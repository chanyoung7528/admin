import { api } from '@repo/core/api';
import { useAuthStore } from '../stores/useAuthStore';
import type { AuthTokenResponse, AuthTokens, LoginPayload, RefreshTokenPayload } from '../utils/types';

/**
 * 로그인 토큰 발급
 * @param payload - 사용자 이름과 비밀번호
 * @returns 액세스 토큰과 리프레시 토큰 응답
 */
export async function postAuthToken(payload: LoginPayload): Promise<AuthTokenResponse> {
  const { data } = await api.post<AuthTokenResponse>('/auth/token', payload, { skipAuth: true });
  return data;
}

/**
 * 리프레시 토큰 갱신
 * @param payload - 리프레시 토큰
 * @returns 새로운 액세스 토큰과 리프레시 토큰 응답
 */
export async function postAuthRefreshToken(payload: RefreshTokenPayload): Promise<AuthTokenResponse> {
  const { data } = await api.post<AuthTokenResponse>('/auth/refresh-token', payload, {
    skipAuth: true,
  });
  return data;
}

/**
 * 로그인 및 세션 저장 (비즈니스 로직)
 * @param payload - 로그인 정보
 * @returns 발급된 토큰
 */
export async function issueSessionTokens(payload: LoginPayload): Promise<AuthTokens> {
  const { result } = await postAuthToken(payload);
  if (!result) {
    throw new Error('INVALID_CREDENTIALS');
  }

  useAuthStore.getState().setTokens(result);
  return result;
}

/**
 * 리프레시 토큰으로 세션 갱신 (비즈니스 로직)
 * @param refreshToken - 리프레시 토큰 (미제공 시 스토어에서 조회)
 * @returns 새로 발급된 토큰
 */
export async function refreshSessionTokens(refreshToken?: string | null): Promise<AuthTokens> {
  const token = refreshToken ?? useAuthStore.getState().refreshToken;
  if (!token) {
    throw new Error('MISSING_REFRESH_TOKEN');
  }

  const { result } = await postAuthRefreshToken({ refreshToken: token });
  if (!result) {
    throw new Error('REFRESH_FAILED');
  }

  useAuthStore.getState().setTokens(result);
  return result;
}

/**
 * 현재 액세스 토큰 스냅샷 조회
 */
export function getAccessTokenSnapshot(): string | null {
  return useAuthStore.getState().accessToken;
}

/**
 * 현재 리프레시 토큰 스냅샷 조회
 */
export function getRefreshTokenSnapshot(): string | null {
  return useAuthStore.getState().refreshToken;
}

/**
 * 인증 세션 초기화 (로그아웃)
 */
export function clearAuthSession(): void {
  useAuthStore.getState().clearAuth();
}
