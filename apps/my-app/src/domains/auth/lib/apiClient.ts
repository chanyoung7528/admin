import { api } from '@repo/core/api';
import { cookie } from '@repo/core/utils';
import type { AxiosError, InternalAxiosRequestConfig } from 'axios';
import type { PendingRetryTask, RetryableRequestConfig } from '../types';
import { ACCESS_TOKEN_COOKIE_KEY } from '../types';
import { clearRequestTracking, trackRequest } from './requestTracker';
import { handleForcedLogout, requestTokenRefresh } from './tokenManager';

let isClientInitialized = false;
let originalApiRequest: typeof api.request | null = null;
const pendingRetryQueue: PendingRetryTask[] = [];
let isProcessingRetryQueue = false;

/**
 * api.request를 오버라이드하여 요청 추적 기능 추가
 */
function overrideApiRequest() {
  if (originalApiRequest) {
    return;
  }

  const boundRequest = api.request.bind(api);
  originalApiRequest = boundRequest;

  api.request = (config => {
    const normalizedConfig = (config ?? {}) as RetryableRequestConfig;
    trackRequest(normalizedConfig);

    return boundRequest(normalizedConfig).finally(() => {
      clearRequestTracking(normalizedConfig);
    });
  }) as typeof api.request;
}

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
 * API 클라이언트에 인증 인터셉터 설정
 * - 요청 시 Authorization 헤더 추가
 * - 401 응답 시 토큰 갱신 후 재시도
 */
function setupAuthInterceptors() {
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

/**
 * 인증 클라이언트 초기화 (한 번만 실행)
 */
export function ensureAuthClient() {
  if (isClientInitialized) {
    return;
  }

  isClientInitialized = true;
  overrideApiRequest();
  setupAuthInterceptors();
}

// 모듈 로드 시 자동 초기화
ensureAuthClient();
