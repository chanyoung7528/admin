import axios from 'axios';
import { env } from '../config';

// Axios 인스턴스 생성
export const apiClient = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: env.apiTimeout,
  headers: {
    'Content-Type': 'application/json',
    'Accept-Language': env.apiAcceptLanguage,
  },
});

// Request 인터셉터
apiClient.interceptors.request.use(
  config => {
    // TODO: Add auth token
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Response 인터셉터
apiClient.interceptors.response.use(
  response => response.data,
  error => {
    // TODO: Handle error (401, 403, etc.)
    if (error.response?.status === 401) {
      // Redirect to login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
