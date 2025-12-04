import { api, AUTH_ERROR_CODES, AuthError, type AuthTokens } from '@repo/core/api';

import type { AuthTokenResponse, LoginPayload } from '../types';

// 로그인 API
export async function postAuthToken(payload: LoginPayload): Promise<AuthTokens> {
  // const { data } = await api.post<AuthTokenResponse>('/auth/token', { ...payload, sessionToken: '1234567890' }, { skipAuth: true });

  console.log('payload', payload);

  const data = {
    resultCode: 200,
    resultMessage: '성공했습니다.',
    result: {
      accessToken: 'test-access-token',
      refreshToken: 'test-refresh-token',
      tokenType: 'JWT',
      expiresIn: '14400',
      expiresDatetime: '2025-12-04 PM 05:45',
    },
    apiSysCntcId: '20251204-134539-000000009564603',
  };

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
