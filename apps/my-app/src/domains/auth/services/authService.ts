import { api, AUTH_ERROR_CODES, AuthError, type AuthTokens } from '@repo/core/api';
import { env } from '@repo/core/config';

import type { AuthTokenResponse, LoginPayload } from '../types';

export async function postAuthToken(payload: LoginPayload): Promise<AuthTokens> {
  if (env.isDebug) {
    return {
      accessToken: 'debug-access-token',
      refreshToken: 'debug-refresh-token',
    };
  }

  const { data } = await api.post<AuthTokenResponse>('/auth/token', { ...payload, sessionToken: '1234567890' }, { skipAuth: true });

  return data.result;
}

export async function postAuthRefreshToken(refreshToken: string): Promise<AuthTokens> {
  const { data } = await api.post<AuthTokenResponse>('/auth/refresh-token', { refreshToken }, { skipAuth: true });

  if (!data.result) {
    throw new AuthError(AUTH_ERROR_CODES.REFRESH_FAILED);
  }

  return data.result;
}
