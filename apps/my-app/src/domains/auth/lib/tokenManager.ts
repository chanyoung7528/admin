import { router } from '@/router';
import { cookie } from '@repo/core/utils';
import { refreshAuthToken } from '../services/authService';
import type { AuthTokens, AuthUser } from '../stores/useAuthStore';
import { useAuthStore } from '../stores/useAuthStore';
import { ACCESS_TOKEN_COOKIE_KEY, REFRESH_TOKEN_COOKIE_KEY } from '../types';
import { getCookieSecurityOptions } from '../utils/cookieHelpers';

const MAX_REFRESH_ATTEMPTS = 3;

let refreshPromise: Promise<AuthTokens | null> | null = null;
let hasHydratedTokens = false;

/**
 * 토큰을 쿠키와 스토어에 저장
 */
export async function persistTokens(tokens: AuthTokens) {
  if (typeof window !== 'undefined') {
    const cookieOptions = getCookieSecurityOptions();
    await Promise.all([
      cookie.set(ACCESS_TOKEN_COOKIE_KEY, tokens.accessToken, cookieOptions),
      cookie.set(REFRESH_TOKEN_COOKIE_KEY, tokens.refreshToken, cookieOptions),
    ]);
  }

  useAuthStore.getState().setTokens(tokens);
}

/**
 * 저장된 세션 정보 모두 제거
 */
export async function clearPersistedSession() {
  if (typeof window !== 'undefined') {
    await Promise.all([cookie.remove(ACCESS_TOKEN_COOKIE_KEY, { path: '/' }), cookie.remove(REFRESH_TOKEN_COOKIE_KEY, { path: '/' })]);
  }

  useAuthStore.getState().reset();
  hasHydratedTokens = false;
}

/**
 * 강제 로그아웃 처리
 */
export async function handleForcedLogout() {
  await clearPersistedSession();

  if (typeof window === 'undefined') {
    return;
  }

  const redirectHref = router.state.location.href ?? window.location.href;

  try {
    await router.navigate({
      to: '/login',
      replace: true,
      search: {
        redirect: redirectHref,
      },
    });
  } catch {
    window.location.href = '/login';
  }
}

/**
 * 토큰 갱신 시도 (단일 시도)
 */
async function executeRefreshAttempt(): Promise<AuthTokens | null> {
  const { refreshToken } = useAuthStore.getState();
  if (!refreshToken) {
    return null;
  }

  try {
    const response = await refreshAuthToken(refreshToken);
    if (!response?.accessToken || !response?.refreshToken) {
      return null;
    }

    const tokens: AuthTokens = {
      accessToken: response.accessToken,
      refreshToken: response.refreshToken,
    };

    await persistTokens(tokens);

    if (response.user) {
      useAuthStore.getState().setUser(response.user as AuthUser);
    }

    return tokens;
  } catch {
    return null;
  }
}

/**
 * 토큰 갱신 요청 (중복 요청 방지 및 재시도)
 */
export async function requestTokenRefresh(): Promise<AuthTokens | null> {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      for (let attempt = 0; attempt < MAX_REFRESH_ATTEMPTS; attempt += 1) {
        const tokens = await executeRefreshAttempt();
        if (tokens) {
          return tokens;
        }
      }
      return null;
    })().finally(() => {
      refreshPromise = null;
    });
  }

  return refreshPromise;
}

/**
 * 앱 초기화 시 쿠키에서 토큰 복원
 */
export async function initializeAuthSession() {
  if (hasHydratedTokens || typeof window === 'undefined') {
    return;
  }

  const [savedAccess, savedRefresh] = await Promise.all([cookie.get(ACCESS_TOKEN_COOKIE_KEY), cookie.get(REFRESH_TOKEN_COOKIE_KEY)]);
  useAuthStore.getState().setTokens({
    accessToken: savedAccess ?? '',
    refreshToken: savedRefresh ?? '',
  });

  hasHydratedTokens = true;
}
