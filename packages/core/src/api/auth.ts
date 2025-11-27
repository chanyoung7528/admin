/**
 * API 인증 토큰
 */
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

/**
 * 인증 에러 코드
 */
export const AUTH_ERROR_CODES = {
  REFRESH_FAILED: 'REFRESH_FAILED',
  UNAUTHORIZED: 'UNAUTHORIZED',
} as const;

export type AuthErrorCode = (typeof AUTH_ERROR_CODES)[keyof typeof AUTH_ERROR_CODES];

/**
 * 인증 에러
 */
export class AuthError extends Error {
  constructor(
    public code: AuthErrorCode,
    message?: string
  ) {
    super(message || code);
    this.name = 'AuthError';
  }
}

/**
 * 인증 스토어 상태
 */
export interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
}

/**
 * 인증 스토어 액션
 */
export interface AuthActions {
  setTokens: (tokens: AuthTokens) => void;
  clearAuth: () => void;
}

/**
 * 인증 스토어 (Zustand 호환)
 */
export interface AuthStore {
  getState: () => AuthState & AuthActions;
}

/**
 * 인증 설정
 */
interface AuthConfig {
  store: AuthStore;
  refreshTokens: (refreshToken: string) => Promise<AuthTokens>;
  onAuthFailure: () => void;
  onError?: (error: Error) => void;
}

let authConfig: AuthConfig | null = null;

/**
 * 인증 설정
 */
export function configureAuth(config: AuthConfig): void {
  authConfig = config;
}

/**
 * 인증 설정 조회
 */
export function getAuthConfig(): AuthConfig | null {
  return authConfig;
}
