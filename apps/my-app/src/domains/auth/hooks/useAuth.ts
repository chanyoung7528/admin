import { api } from '@repo/core/api';
import { cookie } from '@repo/core/utils';
import { useNavigate } from '@tanstack/react-router';
import type { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { useCallback, useEffect } from 'react';
import { refreshAuthToken } from '../services/authService';
import { useAuthStore, type AuthTokens, type AuthUser } from '../stores/useAuthStore';

export const ACCESS_TOKEN_COOKIE_KEY = 'auth_access_token';
export const REFRESH_TOKEN_COOKIE_KEY = 'auth_refresh_token';

type RetryableRequestConfig = InternalAxiosRequestConfig & { _retry?: boolean };

let isClientInitialized = false;
let refreshPromise: Promise<AuthTokens | null> | null = null;

function getCookieSecurityOptions() {
  const isBrowser = typeof window !== 'undefined';
  const isHttps = isBrowser ? window.location.protocol === 'https:' : true;
  return {
    sameSite: 'strict' as const,
    secure: isHttps,
    path: '/',
  };
}

async function clearPersistedSession() {
  await Promise.all([cookie.remove(ACCESS_TOKEN_COOKIE_KEY), cookie.remove(REFRESH_TOKEN_COOKIE_KEY)]);
  useAuthStore.getState().reset();
}

async function handleForcedLogout() {
  await clearPersistedSession();
  if (typeof window !== 'undefined') {
    window.location.href = '/login';
  }
}

async function requestTokenRefresh(): Promise<AuthTokens | null> {
  const { refreshToken } = useAuthStore.getState();
  if (!refreshToken) {
    return null;
  }

  if (!refreshPromise) {
    refreshPromise = refreshAuthToken(refreshToken)
      .then(response => {
        if (!response?.accessToken || !response?.refreshToken) {
          return null;
        }
        const tokens: AuthTokens = {
          accessToken: response.accessToken,
          refreshToken: response.refreshToken,
        };
        useAuthStore.getState().setTokens(tokens);
        if (response.user) {
          useAuthStore.getState().setUser(response.user as AuthUser);
        }
        return tokens;
      })
      .catch(() => null)
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}

function ensureAuthClient() {
  if (isClientInitialized) return;
  isClientInitialized = true;

  api.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
      const token = await cookie.get(ACCESS_TOKEN_COOKIE_KEY);
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error: AxiosError) => Promise.reject(error)
  );

  api.interceptors.response.use(
    response => response,
    async (error: AxiosError) => {
      if (error.response?.status !== 401 || typeof window === 'undefined') {
        return Promise.reject(error);
      }

      const originalRequest = error.config as RetryableRequestConfig | undefined;
      if (!originalRequest || originalRequest._retry || originalRequest.url?.includes('/auth/refresh')) {
        await handleForcedLogout();
        return Promise.reject(error);
      }

      const refreshedTokens = await requestTokenRefresh();
      if (refreshedTokens && originalRequest.headers) {
        originalRequest._retry = true;
        originalRequest.headers.Authorization = `Bearer ${refreshedTokens.accessToken}`;
        return api.request(originalRequest);
      }

      await handleForcedLogout();
      return Promise.reject(error);
    }
  );
}

ensureAuthClient();

export function useAuth() {
  const navigate = useNavigate();
  const user = useAuthStore(state => state.user);
  const accessToken = useAuthStore(state => state.accessToken);
  const refreshToken = useAuthStore(state => state.refreshToken);
  const setUser = useAuthStore(state => state.setUser);
  const setTokens = useAuthStore(state => state.setTokens);

  const loadTokens = useCallback(async () => {
    const [savedAccess, savedRefresh] = await Promise.all([cookie.get(ACCESS_TOKEN_COOKIE_KEY), cookie.get(REFRESH_TOKEN_COOKIE_KEY)]);

    setTokens({
      accessToken: savedAccess ?? '',
      refreshToken: savedRefresh ?? '',
    });
  }, [setTokens]);

  useEffect(() => {
    if (!accessToken) {
      void loadTokens();
    }
  }, [accessToken, loadTokens]);

  const persistTokens = useCallback(
    async (tokens: AuthTokens) => {
      const cookieOptions = getCookieSecurityOptions();
      await Promise.all([
        cookie.set(ACCESS_TOKEN_COOKIE_KEY, tokens.accessToken, cookieOptions),
        cookie.set(REFRESH_TOKEN_COOKIE_KEY, tokens.refreshToken, cookieOptions),
      ]);
      setTokens(tokens);
    },
    [setTokens]
  );

  const signOut = useCallback(async () => {
    await clearPersistedSession();
    navigate({
      to: '/login',
      replace: true,
    });
  }, [navigate]);

  return {
    user,
    accessToken,
    refreshToken,
    setUser,
    setTokens: persistTokens,
    loadTokens,
    signOut,
  };
}
