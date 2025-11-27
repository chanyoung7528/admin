import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { env } from '../config';
import { AUTH_ERROR_CODES, AuthError, getApiAuthProvider, type ApiAuthProvider, type ApiAuthTokens, type MaybePromise } from './auth';

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
let refreshPromise: Promise<ApiAuthTokens | null> | null = null;

/**
 * Authorization 헤더 포맷 정규화
 * @param token - 액세스 토큰
 */
function formatAuthHeader(token: string): string {
  const trimmed = token.trim();
  if (trimmed.toLowerCase().startsWith('bearer ')) {
    return `Bearer ${trimmed.slice(7).trim()}`;
  }
  return `Bearer ${trimmed}`;
}

/**
 * 프로바이더 값 안전하게 resolve
 * @param resolver - 동기/비동기 값 반환 함수
 */
async function resolveProviderValue<T>(resolver?: () => MaybePromise<T | null | undefined>): Promise<T | null> {
  if (!resolver) {
    return null;
  }

  try {
    const value = await resolver();
    return value ?? null;
  } catch {
    return null;
  }
}

/**
 * 토큰 갱신 큐 관리 (동시 다발적 401 응답 시 단 한 번만 갱신)
 * @param provider - 인증 프로바이더
 */
async function queueTokenRefresh(provider: ApiAuthProvider): Promise<ApiAuthTokens | null> {
  if (!refreshPromise) {
    refreshPromise = runRefresh(provider).finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
}

/**
 * 실제 토큰 갱신 실행
 * @param provider - 인증 프로바이더
 */
async function runRefresh(provider: ApiAuthProvider): Promise<ApiAuthTokens | null> {
  const refreshToken = await resolveProviderValue(provider.getRefreshToken);
  if (!refreshToken) {
    throw new AuthError(AUTH_ERROR_CODES.MISSING_REFRESH_TOKEN);
  }

  if (!provider.refreshTokens) {
    throw new AuthError(AUTH_ERROR_CODES.MISSING_REFRESH_HANDLER);
  }

  const tokens = await provider.refreshTokens(refreshToken);
  if (tokens?.accessToken) {
    provider.onTokensUpdated?.(tokens);
  }

  return tokens ?? null;
}

/**
 * Request 인터셉터: 액세스 토큰 주입
 */
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // skipAuth 옵션이 true이면 토큰 주입 건너뜀
    if (config.skipAuth) {
      return config;
    }

    const provider = getApiAuthProvider();
    if (!provider?.getAccessToken) {
      return config;
    }

    const token = await resolveProviderValue(provider.getAccessToken);
    if (token) {
      config.headers.Authorization = formatAuthHeader(token);
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
      alert('NETWORK_ERROR');
      return Promise.reject(new Error('NETWORK_ERROR'));
    }

    const status = error.response.status;
    const originalRequest = error.config as (InternalAxiosRequestConfig & { _retry?: boolean }) | undefined;

    // 401 Unauthorized 처리
    if (status === 401) {
      // skipAuth로 요청한 경우 401 처리 안 함 (로그인 API 등)
      if (originalRequest?.skipAuth) {
        return Promise.reject(error);
      }

      const provider = getApiAuthProvider();

      // 프로바이더 미설정, 재시도 완료, 또는 리프레시 토큰 엔드포인트인 경우
      if (
        !provider ||
        !provider.refreshTokens ||
        !provider.getRefreshToken ||
        !originalRequest ||
        originalRequest._retry ||
        originalRequest.url?.includes('/auth/refresh-token')
      ) {
        const authError = new AuthError(AUTH_ERROR_CODES.UNAUTHORIZED);
        provider?.onAuthFailure?.(authError);
        return Promise.reject(authError);
      }

      try {
        // 토큰 갱신 (중복 요청 시 큐에서 대기)
        const tokens = await queueTokenRefresh(provider);
        if (!tokens?.accessToken) {
          throw new AuthError(AUTH_ERROR_CODES.REFRESH_FAILED);
        }

        // 원본 요청 재시도
        originalRequest._retry = true;
        originalRequest.headers.Authorization = formatAuthHeader(tokens.accessToken);

        return api(originalRequest);
      } catch (refreshError) {
        provider.onAuthFailure?.(refreshError);
        return Promise.reject(refreshError);
      }
    }

    // 500번대 서버 에러
    if (status >= 500) {
      alert('서버에 문제가 발생했습니다. 잠시 후 다시 시도해주세요');
      return Promise.reject(new Error('SERVER_ERROR'));
    }

    // 그 외 모든 에러는 그대로 throw (Error Boundary가 처리)
    return Promise.reject(error);
  }
);
