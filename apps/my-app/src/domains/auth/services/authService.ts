import { api } from '@repo/core/api';
import type { AuthUser } from '../stores/useAuthStore';

interface RefreshAuthResponse {
  accessToken: string;
  refreshToken: string;
  user?: AuthUser | null;
}

/**
 * Refresh access token by calling backend refresh endpoint.
 * TODO: Replace `/auth/refresh` with actual refresh API once backend is ready.
 */
export async function refreshAuthToken(refreshToken: string): Promise<RefreshAuthResponse> {
  const { data } = await api.post<RefreshAuthResponse>('/auth/refresh', {
    refreshToken,
  });
  return data;
}
