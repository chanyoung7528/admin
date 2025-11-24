import { api } from '@repo/core/api';
import type { AuthTokens, AuthUser } from '../types';

export interface RefreshAuthResponse extends AuthTokens {
  user?: AuthUser;
}

/**
 * 리프레시 토큰으로 새 액세스 토큰 발급
 * @param refreshToken - 리프레시 토큰
 * @returns 새 토큰 및 사용자 정보
 */
export async function refreshAuthToken(refreshToken: string): Promise<RefreshAuthResponse> {
  const res = await api.post<RefreshAuthResponse>('/auth/refresh', { refreshToken });
  return res.data;
}
