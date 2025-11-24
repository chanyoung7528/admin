import axios, { type AxiosError } from 'axios';
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

// Response 인터셉터
api.interceptors.response.use(
  response => response.data,
  (error: AxiosError) => Promise.reject(error)
);
