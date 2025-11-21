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
    const token = localStorage.getItem('accessToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// Response 인터셉터
api.interceptors.response.use(
  response => response.data,
  (error: AxiosError) => {
    // TODO: Handle error (401, 403, etc.)
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      // Redirect to login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
