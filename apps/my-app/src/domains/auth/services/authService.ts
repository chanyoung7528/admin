import { api } from '@repo/core/api';
import type { AuthTokenResponse, LoginPayload, RefreshTokenPayload } from '../utils/types';

/**
 * 로그인 토큰 발급
 * @param payload - 사용자 이름과 비밀번호
 * @returns 액세스 토큰과 리프레시 토큰
 */
export async function postAuthToken(payload: LoginPayload): Promise<AuthTokenResponse> {
  const { data } = await api.post<AuthTokenResponse>('/auth/token', { ...payload, sessionToken: '1234567890' });
  return data as AuthTokenResponse;
}

/**
 * 리프레시 토큰 갱신
 * @param payload - 리프레시 토큰
 * @returns 새로운 액세스 토큰과 리프레시 토큰
 */
export async function postAuthRefreshToken(payload: RefreshTokenPayload): Promise<AuthTokenResponse> {
  const { data } = await api.post<AuthTokenResponse>('/auth/refresh-token', { ...payload });
  return data as AuthTokenResponse;
}
