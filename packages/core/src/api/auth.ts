/**
 * 동기 또는 비동기 값을 표현하는 유틸리티 타입
 */
export type MaybePromise<T> = T | Promise<T>;

/**
 * API 인증 토큰 구조
 */
export interface ApiAuthTokens {
  accessToken: string;
  refreshToken: string;
}

/**
 * 인증 에러 코드 (인증 관련만 포함)
 */
export const AUTH_ERROR_CODES = {
  MISSING_REFRESH_TOKEN: 'MISSING_REFRESH_TOKEN',
  MISSING_REFRESH_HANDLER: 'MISSING_REFRESH_HANDLER',
  REFRESH_FAILED: 'REFRESH_FAILED',
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  UNAUTHORIZED: 'UNAUTHORIZED',
} as const;

export type AuthErrorCode = (typeof AUTH_ERROR_CODES)[keyof typeof AUTH_ERROR_CODES];

/**
 * 인증 에러 클래스 (인증 실패만 표현)
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
 * API 인증 프로바이더 인터페이스
 * 애플리케이션별 인증 로직을 주입받아 API 클라이언트가 사용
 */
export interface ApiAuthProvider<TTokens extends ApiAuthTokens = ApiAuthTokens> {
  /** 현재 액세스 토큰 조회 (동기/비동기 가능) */
  getAccessToken?: () => MaybePromise<string | null | undefined>;

  /** 현재 리프레시 토큰 조회 (동기/비동기 가능) */
  getRefreshToken?: () => MaybePromise<string | null | undefined>;

  /** 토큰 갱신 로직 (리프레시 토큰을 받아 새 토큰 반환) */
  refreshTokens?: (refreshToken: string) => Promise<TTokens | null>;

  /** 토큰 갱신 성공 시 호출 (스토어/스토리지 업데이트용) */
  onTokensUpdated?: (tokens: TTokens) => void;

  /** 인증 실패 시 호출 (로그아웃, 리다이렉트 등) */
  onAuthFailure?: (error: unknown) => void;
}

/**
 * 전역 인증 프로바이더 상태
 */
let authProvider: ApiAuthProvider | null = null;

/**
 * API 인증 프로바이더 설정
 * @param provider - 인증 프로바이더 구현체
 */
export function configureApiAuth(provider: ApiAuthProvider | null) {
  authProvider = provider;
}

/**
 * 현재 설정된 인증 프로바이더 조회
 */
export function getApiAuthProvider(): ApiAuthProvider | null {
  return authProvider;
}

/**
 * 인증 프로바이더 초기화
 */
export function clearApiAuthProvider() {
  authProvider = null;
}
