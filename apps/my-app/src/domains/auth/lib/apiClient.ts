import { api, setupInterceptors } from '@repo/core/api';
import { cookie } from '@repo/core/utils';
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
 * 인증 클라이언트 초기화 (브라우저 환경에서 한 번만 실행)
 */
export function ensureAuthClient() {
  if (typeof window === 'undefined' || isClientInitialized) {
    return;
  }

  isClientInitialized = true;

  setupInterceptors({
    getAuthToken: async () => cookie.get(ACCESS_TOKEN_COOKIE_KEY),

    onRequest: config => {
      trackRequest(config as RetryableRequestConfig);
    },

    onResponse: response => {
      clearRequestTracking(response.config as RetryableRequestConfig);
    },

    onError: error => {
      const config = error.config as RetryableRequestConfig;
      if (config) {
        clearRequestTracking(config);
      }
    },

    onUnauthorized: async error => {
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
    },
  });
}
