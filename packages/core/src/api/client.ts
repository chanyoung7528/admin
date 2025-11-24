import axios, { type AxiosError, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios';
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

export interface ApiInterceptorConfig {
  onRequest?: (config: InternalAxiosRequestConfig) => void;
  onResponse?: (response: AxiosResponse) => void;
  onError?: (error: AxiosError) => void;
  onUnauthorized?: (error: AxiosError) => Promise<unknown>;
  getAuthToken?: () => Promise<string | null | undefined>;
}

/**
 * API 클라이언트 인터셉터 설정
 * 중앙에서 인증 로직 등을 주입받아 설정합니다.
 */
export const setupInterceptors = (config: ApiInterceptorConfig) => {
  // Request Interceptor
  api.interceptors.request.use(
    async reqConfig => {
      config.onRequest?.(reqConfig);

      if (config.getAuthToken) {
        const token = await config.getAuthToken();
        if (token && reqConfig.headers) {
          reqConfig.headers.Authorization = `Bearer ${token}`;
        }
      }
      return reqConfig;
    },
    (error: AxiosError) => {
      config.onError?.(error);
      return Promise.reject(error);
    }
  );

  // Response Interceptor
  api.interceptors.response.use(
    response => {
      config.onResponse?.(response);
      return response.data;
    },
    async (error: AxiosError) => {
      config.onError?.(error);

      if (error.response?.status === 401 && config.onUnauthorized) {
        return config.onUnauthorized(error);
      }

      return Promise.reject(error);
    }
  );
};
