import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { env } from '../config';

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

// Request 인터셉터
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // TODO: Add auth token

    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// Response 인터셉터
api.interceptors.response.use(
  response => response,
  (error: AxiosError) => {
    // OFFLINE
    if (!error.response) {
      alert('네트워크 연결을 확인해주세요');
      return Promise.reject(new Error('NETWORK_ERROR'));
    }

    // 401 토큰 만료
    if (error.response.status === 401) {
      // TODO: 리프레시 또는 로그아웃
      return Promise.reject(error);
    }

    // 500번대 서버 에러
    if (error.response.status >= 500) {
      alert('서버에 문제가 발생했습니다. 잠시 후 다시 시도해주세요');
    }

    // React Query isError
    return Promise.reject(error);
  }
);
