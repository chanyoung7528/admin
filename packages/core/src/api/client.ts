import axios from 'axios';

// Axios 인스턴스 생성
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
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
