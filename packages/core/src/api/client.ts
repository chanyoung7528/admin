import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';

import { env } from '../config';
import { AUTH_ERROR_CODES, AuthError, type AuthTokens, getAuthConfig } from './auth';

// Axios Request Config 확장
declare module 'axios' {
  export interface AxiosRequestConfig {
    skipAuth?: boolean;
  }
}

/**
 * Axios 기반 API 클라이언트
 * @see https://axios-http.com/docs/intro
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
 * 토큰 갱신 Promise (중복 요청 방지)
 */
let refreshPromise: Promise<AuthTokens> | null = null;

/**
 * Request 인터셉터: 액세스 토큰 주입
 */
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (config.skipAuth) return config;

    const config_ = getAuthConfig();
    if (!config_) return config;

    const { accessToken } = config_.store.getState();
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
      const config = getAuthConfig();
      const networkError = new Error('NETWORK_ERROR');
      if (config?.onError) {
        config.onError(networkError);
      } else {
        alert('네트워크 연결을 확인해주세요.');
      }
      return Promise.reject(networkError);
    }

    const status = error.response.status;
    const originalRequest = error.config as (InternalAxiosRequestConfig & { _retry?: boolean }) | undefined;

    // 401 Unauthorized - 토큰 갱신 시도
    if (status === 401 && originalRequest && !originalRequest._retry && !originalRequest.skipAuth) {
      const config = getAuthConfig();
      if (!config) {
        return Promise.reject(new AuthError(AUTH_ERROR_CODES.UNAUTHORIZED));
      }

      const { refreshToken } = config.store.getState();

      // 리프레시 토큰이 없거나 리프레시 API 자체가 401인 경우
      if (!refreshToken || originalRequest.url?.includes('/auth/refresh-token')) {
        config.onAuthFailure();
        return Promise.reject(new AuthError(AUTH_ERROR_CODES.UNAUTHORIZED));
      }

      try {
        // 동시 다발적 401 시 하나의 갱신 요청만 실행
        if (!refreshPromise) {
          refreshPromise = config.refreshTokens(refreshToken).finally(() => {
            refreshPromise = null;
          });
        }

        const tokens = await refreshPromise;
        config.store.getState().setTokens(tokens);

        // 원본 요청 재시도
        originalRequest._retry = true;
        originalRequest.headers.Authorization = `Bearer ${tokens.accessToken}`;
        return api(originalRequest);
      } catch {
        config.onAuthFailure();
        return Promise.reject(new AuthError(AUTH_ERROR_CODES.REFRESH_FAILED));
      }
    }

    // 500번대 서버 에러
    if (status >= 500) {
      const config = getAuthConfig();
      const serverError = new Error('SERVER_ERROR');
      if (config?.onError) {
        config.onError(serverError);
      } else {
        alert('서버에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.');
      }
      return Promise.reject(serverError);
    }

    // 그 외 에러는 그대로 전달
    return Promise.reject(error);
  }
);
