import axios, { type AxiosError, type AxiosRequestConfig, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios';
import { env } from '../config';

/**
 * Axios 기반 API 클라이언트 (내부용)
 * @see https://axios-http.com/docs/intro
 */
const axiosInstance = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: env.apiTimeout,
  headers: {
    'Content-Type': 'application/json',
    'Accept-Language': env.apiAcceptLanguage,
  },
});

/**
 * 타입 안전한 API 클라이언트
 * 인터셉터에서 response.data를 반환하므로 타입도 그에 맞게 조정
 */
export const api = {
  get: <T = any>(url: string, config?: AxiosRequestConfig) => axiosInstance.get<T>(url, config) as Promise<T>,
  post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => axiosInstance.post<T>(url, data, config) as Promise<T>,
  put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => axiosInstance.put<T>(url, data, config) as Promise<T>,
  patch: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => axiosInstance.patch<T>(url, data, config) as Promise<T>,
  delete: <T = any>(url: string, config?: AxiosRequestConfig) => axiosInstance.delete<T>(url, config) as Promise<T>,
  request: <T = any>(config: AxiosRequestConfig) => axiosInstance.request<T>(config) as Promise<T>,
};

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
  axiosInstance.interceptors.request.use(
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
  axiosInstance.interceptors.response.use(
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
