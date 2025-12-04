import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';

import { env } from '../config';
import { AUTH_ERROR_CODES, AuthError, type AuthTokens, getAuthConfig } from './auth';

declare module 'axios' {
  export interface AxiosRequestConfig {
    skipAuth?: boolean;
  }
}

/**
 * Axios 기반 API 클라이언트
 */
export const api = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: env.apiTimeout,
  headers: {
    'Content-Type': 'application/json',
    'Accept-Language': env.apiAcceptLanguage,
  },
});

/**
 * 토큰 갱신 Promise (동시 요청 방지)
 */
let refreshPromise: Promise<AuthTokens> | null = null;

/**
 * Request 인터셉터: 액세스 토큰 주입
 */
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (config.skipAuth) return config;

    const authConfig = getAuthConfig();
    if (!authConfig) return config;

    const { accessToken } = authConfig.store.getState();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

/**
 * Response 인터셉터: 에러 처리 및 토큰 갱신
 */
api.interceptors.response.use(
  response => response,
  async (error: AxiosError) => {
    // 네트워크 연결 오류
    if (!error.response) {
      const authConfig = getAuthConfig();
      const networkError = new Error('NETWORK_ERROR');

      if (authConfig?.onError) {
        authConfig.onError(networkError);
      } else {
        console.error('[Network Error] 네트워크 연결을 확인해주세요.');
      }

      return Promise.reject(networkError);
    }

    const status = error.response.status;
    const originalRequest = error.config as (InternalAxiosRequestConfig & { _retry?: boolean }) | undefined;

    // 401 Unauthorized - 토큰 갱신 시도
    if (status === 401 && originalRequest && !originalRequest._retry && !originalRequest.skipAuth) {
      const authConfig = getAuthConfig();
      if (!authConfig) {
        return Promise.reject(new AuthError(AUTH_ERROR_CODES.UNAUTHORIZED));
      }

      const { refreshToken } = authConfig.store.getState();

      // 리프레시 토큰이 없거나 리프레시 API 자체가 401인 경우
      if (!refreshToken || originalRequest.url?.includes('/auth/refresh-token')) {
        authConfig.onAuthFailure();
        return Promise.reject(new AuthError(AUTH_ERROR_CODES.UNAUTHORIZED));
      }

      try {
        // 동시 다발적 401 시 하나의 갱신 요청만 실행
        if (!refreshPromise) {
          refreshPromise = authConfig.refreshTokens(refreshToken).finally(() => {
            refreshPromise = null;
          });
        }

        const tokens = await refreshPromise;
        authConfig.store.getState().setTokens(tokens);

        // 원본 요청 재시도
        originalRequest._retry = true;
        originalRequest.headers.Authorization = `Bearer ${tokens.accessToken}`;

        return api(originalRequest);
      } catch {
        authConfig.onAuthFailure();
        return Promise.reject(new AuthError(AUTH_ERROR_CODES.REFRESH_FAILED));
      }
    }

    // 500번대 서버 에러
    if (status >= 500) {
      const authConfig = getAuthConfig();
      const serverError = new Error('SERVER_ERROR');

      if (authConfig?.onError) {
        authConfig.onError(serverError);
      } else {
        console.error('[Server Error] 서버에 문제가 발생했습니다.');
      }

      return Promise.reject(serverError);
    }

    // 그 외 에러는 그대로 전달
    return Promise.reject(error);
  }
);
