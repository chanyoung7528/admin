import type { InternalAxiosRequestConfig } from 'axios';

export const ACCESS_TOKEN_COOKIE_KEY = 'auth_access_token';
export const REFRESH_TOKEN_COOKIE_KEY = 'auth_refresh_token';

export type RetryableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
  _requestId?: number;
};

export type PendingRetryTask = {
  config: RetryableRequestConfig;
  resolve: (value: unknown) => void;
  reject: (reason: unknown) => void;
};

export type RequestTimerEntry = {
  timeoutId: number;
  visible: boolean;
};
