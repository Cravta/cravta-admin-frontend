import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;;

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const ENDPOINTS = {
  AUTH: {
    SIGNUP: '/auth/signup',
    VERIFY_OTP: '/auth/verify-otp',
    LOGIN: '/auth/login',
  },
  CLASSES: {
    BASE: '/classes',
    BY_ID: (id) => `/classes/${id}`,
    UNIQUE_CODE: (id) => `/classes/${id}/unique-code`,
    QR_CODE: (id) => `/classes/${id}/qr-code`,
  },
  CONTENT: {
    BASE: '/content',
    BY_CLASS: (classId) => `/content?classId=${classId}`,
    BY_ID: (id) => `/content/${id}`,
  },
};

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);