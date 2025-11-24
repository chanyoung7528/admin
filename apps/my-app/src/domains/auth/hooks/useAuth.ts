import { router } from '@/router';
import { api } from '@repo/core/api';
import { cookie } from '@repo/core/utils';
import { useFullPageLoadingStore } from '@repo/shared/hooks/useFullPageLoadingStore';
import { useNavigate } from '@tanstack/react-router';
import type { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { useCallback } from 'react';
import { refreshAuthToken } from '../services/authService';
import { useAuthStore, type AuthTokens, type AuthUser } from '../stores/useAuthStore';

export const ACCESS_TOKEN_COOKIE_KEY = 'auth_access_token';
export const REFRESH_TOKEN_COOKIE_KEY = 'auth_refresh_token';

const MAX_REFRESH_ATTEMPTS = 3;
const SLOW_REQUEST_THRESHOLD = 300;

type RetryableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
  _requestId?: number;
};

type PendingRetryTask = {
  config: RetryableRequestConfig;
  resolve: (value: unknown) => void;
  reject: (reason: unknown) => void;
};

let isClientInitialized = false;
let refreshPromise: Promise<AuthTokens | null> | null = null;
let requestSequence = 0;
let originalApiRequest: typeof api.request | null = null;
let hasHydratedTokens = false;

const requestTimers = new Map<number, { timeoutId: number; visible: boolean }>();
const pendingRetryQueue: PendingRetryTask[] = [];
let isProcessingRetryQueue = false;

function getCookieSecurityOptions() {
  const isBrowser = typeof window !== 'undefined';
  const isHttps = isBrowser ? window.location.protocol === 'https:' : true;
  return {
    sameSite: 'strict' as const,
    secure: isHttps,
    path: '/',
  };
}

async function persistTokens(tokens: AuthTokens) {
  if (typeof window !== 'undefined') {
    const cookieOptions = getCookieSecurityOptions();
    await Promise.all([
      cookie.set(ACCESS_TOKEN_COOKIE_KEY, tokens.accessToken, cookieOptions),
      cookie.set(REFRESH_TOKEN_COOKIE_KEY, tokens.refreshToken, cookieOptions),
    ]);
  }

  useAuthStore.getState().setTokens(tokens);
}

async function clearPersistedSession() {
  if (typeof window !== 'undefined') {
    await Promise.all([cookie.remove(ACCESS_TOKEN_COOKIE_KEY, { path: '/' }), cookie.remove(REFRESH_TOKEN_COOKIE_KEY, { path: '/' })]);
  }

  useAuthStore.getState().reset();
  hasHydratedTokens = false;
}

async function handleForcedLogout() {
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

function trackRequest(config: RetryableRequestConfig) {
  if (typeof window === 'undefined') {
    return;
  }

  const requestId = ++requestSequence;
  config._requestId = requestId;

  const timeoutId = window.setTimeout(() => {
    const entry = requestTimers.get(requestId);
    if (!entry) {
      return;
    }
    entry.visible = true;
    useFullPageLoadingStore.getState().show(requestId);
  }, SLOW_REQUEST_THRESHOLD);

  requestTimers.set(requestId, { timeoutId, visible: false });
}

function clearRequestTracking(config: RetryableRequestConfig) {
  if (typeof window === 'undefined') {
    return;
  }

  const requestId = config._requestId;
  if (!requestId) {
    return;
  }

  const entry = requestTimers.get(requestId);
  if (!entry) {
    return;
  }

  window.clearTimeout(entry.timeoutId);
  if (entry.visible) {
    useFullPageLoadingStore.getState().hide(requestId);
  }

  requestTimers.delete(requestId);
}

function overrideApiRequest() {
  if (originalApiRequest) {
    return;
  }

  const boundRequest = api.request.bind(api);
  originalApiRequest = boundRequest;

  const trackedRequest: typeof api.request = config => {
    const normalizedConfig = (config ?? {}) as RetryableRequestConfig;
    trackRequest(normalizedConfig);

    return boundRequest(normalizedConfig).finally(() => {
      clearRequestTracking(normalizedConfig);
    });
  };

  api.request = trackedRequest;
}

function enqueueRequestRetry(config: RetryableRequestConfig) {
  return new Promise((resolve, reject) => {
    pendingRetryQueue.push({ config, resolve, reject });
    void processRetryQueue();
  });
}

async function processRetryQueue() {
  if (isProcessingRetryQueue) {
    return;
  }

  isProcessingRetryQueue = true;

  while (pendingRetryQueue.length) {
    const task = pendingRetryQueue.shift();
    if (!task) {
      continue;
    }

    try {
      const response = await api.request(task.config);
      task.resolve(response);
    } catch (error) {
      task.reject(error);
    }
  }

  isProcessingRetryQueue = false;
}

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

async function requestTokenRefresh(): Promise<AuthTokens | null> {
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

function ensureAuthClient() {
  if (isClientInitialized) {
    return;
  }

  isClientInitialized = true;
  overrideApiRequest();

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
        return enqueueRequestRetry(originalRequest);
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
  const persistTokensCallback = useCallback(async (tokens: AuthTokens) => {
    await persistTokens(tokens);
  }, []);

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
    setTokens: persistTokensCallback,
    signOut,
  };
}
