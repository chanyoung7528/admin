import { api } from '@repo/core/api';
import { cookie } from '@repo/core/utils';
import type { AxiosError, InternalAxiosRequestConfig } from 'axios';
import type { PendingRetryTask, RetryableRequestConfig } from '../types';
import { ACCESS_TOKEN_COOKIE_KEY } from '../types';
import { clearRequestTracking, trackRequest } from './requestTracker';
import { handleForcedLogout, requestTokenRefresh } from './tokenManager';

let isClientInitialized = false;
const pendingRetryQueue: PendingRetryTask[] = [];
let isProcessingRetryQueue = false;

/**
 * 재시도 큐에 요청 추가
 */
function enqueueRequestRetry(config: RetryableRequestConfig) {
  return new Promise((resolve, reject) => {
    pendingRetryQueue.push({ config, resolve, reject });
    void processRetryQueue();
  });
}

/**
 * 대기 중인 재시도 요청들을 순차적으로 처리
 */
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

/**
 * API 클라이언트에 인증 및 추적 인터셉터 설정
 * - 요청 시 Authorization 헤더 추가 및 로딩 추적 시작
 * - 응답 시 로딩 추적 종료
 * - 401 응답 시 토큰 갱신 후 재시도
 */
function setupInterceptors() {
  // Request Interceptor
  api.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
      const retryableConfig = config as RetryableRequestConfig;

      // 요청 추적 시작
      trackRequest(retryableConfig);

      const token = await cookie.get(ACCESS_TOKEN_COOKIE_KEY);
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error: AxiosError) => {
      const config = error.config as RetryableRequestConfig;
      if (config) {
        clearRequestTracking(config);
      }
      return Promise.reject(error);
    }
  );

  // Response Interceptor
  api.interceptors.response.use(
    response => {
      const config = response.config as RetryableRequestConfig;
      clearRequestTracking(config);
      return response;
    },
    async (error: AxiosError) => {
      const originalRequest = error.config as RetryableRequestConfig | undefined;

      if (originalRequest) {
        clearRequestTracking(originalRequest);
      }

      if (error.response?.status !== 401 || typeof window === 'undefined') {
        return Promise.reject(error);
      }

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

/**
 * 인증 클라이언트 초기화 (브라우저 환경에서 한 번만 실행)
 */
export function ensureAuthClient() {
  if (typeof window === 'undefined' || isClientInitialized) {
    return;
  }

  isClientInitialized = true;
  setupInterceptors();
}
