import type { InternalAxiosRequestConfig } from 'axios';

// 쿠키 키
export const ACCESS_TOKEN_COOKIE_KEY = 'auth_access_token';
export const REFRESH_TOKEN_COOKIE_KEY = 'auth_refresh_token';

// 인증 설정
export const AUTH_CONFIG = {
  MAX_REFRESH_ATTEMPTS: 3,
  SLOW_REQUEST_THRESHOLD: 300,
} as const;

// 사용자 정보
export interface AuthUser {
  accountNo: string;
  email: string;
  role: string[];
  exp: number;
}

// 토큰 정보
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

// API 요청 설정
export type RetryableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
  _requestId?: number;
};

// 재시도 태스크
export type PendingRetryTask = {
  config: RetryableRequestConfig;
  resolve: (value: unknown) => void;
  reject: (reason: unknown) => void;
};

// 요청 타이머
export type RequestTimerEntry = {
  timeoutId: number;
  visible: boolean;
};
