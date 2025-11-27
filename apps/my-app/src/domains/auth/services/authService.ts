import { api, AUTH_ERROR_CODES, AuthError, type AuthTokens } from '@repo/core/api';
import type { AuthTokenResponse, LoginPayload } from '../utils/types';

// 로그인 API
export async function postAuthToken(payload: LoginPayload): Promise<AuthTokens> {
  const { data } = await api.post<AuthTokenResponse>('/auth/token', { ...payload, sessionToken: '1234567890' }, { skipAuth: true });

  return data.result;
}

// 토큰 갱신 API
export async function postAuthRefreshToken(refreshToken: string): Promise<AuthTokens> {
  const { data } = await api.post<AuthTokenResponse>('/auth/refresh-token', { refreshToken }, { skipAuth: true });

  if (!data.result) {
    throw new AuthError(AUTH_ERROR_CODES.REFRESH_FAILED);
  }

  return data.result;
}
