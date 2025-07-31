import axios from 'axios';
import type { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import { API_BASE_URL, STORAGE_KEYS, HTTP_STATUS } from '@/constants';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response?.status === HTTP_STATUS.UNAUTHORIZED) {
      // Chỉ redirect nếu user đã login trước đó (có token) và không phải là request đăng nhập
      const isLoginRequest = error.config?.url?.includes('/auth/login');
      const hasToken = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      
      if (!isLoginRequest && hasToken) {
        // Token hết hạn hoặc không hợp lệ, clear auth data và redirect
        localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER_DATA);
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export class ApiService {
  private static instance: ApiService;

  private constructor() {}

  public static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }

  // Generic API methods
  async get<T>(endpoint: string, params?: Record<string, unknown>): Promise<T> {
    try {
      const response = await apiClient.get<T>(endpoint, { params });
      return response.data;
    } catch (error) {
      // Special case: if backend returns structured error response, return it instead of throwing
      if (axios.isAxiosError(error) && error.response?.data && 
          typeof error.response.data === 'object' && 
          'success' in error.response.data && 
          'message' in error.response.data) {
        return error.response.data as T;
      }
      throw this.handleError(error);
    }
  }

  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    try {
      const response = await apiClient.post<T>(endpoint, data);
      return response.data;
    } catch (error) {
      // Special case: if backend returns structured error response, return it instead of throwing
      if (axios.isAxiosError(error) && error.response?.data && 
          typeof error.response.data === 'object' && 
          'success' in error.response.data && 
          'message' in error.response.data) {
        return error.response.data as T;
      }
      throw this.handleError(error);
    }
  }

  async put<T>(endpoint: string, data?: unknown): Promise<T> {
    try {
      const response = await apiClient.put<T>(endpoint, data);
      return response.data;
    } catch (error) {
      // Special case: if backend returns structured error response, return it instead of throwing
      if (axios.isAxiosError(error) && error.response?.data && 
          typeof error.response.data === 'object' && 
          'success' in error.response.data && 
          'message' in error.response.data) {
        return error.response.data as T;
      }
      throw this.handleError(error);
    }
  }

  async patch<T>(endpoint: string, data?: unknown): Promise<T> {
    try {
      const response = await apiClient.patch<T>(endpoint, data);
      return response.data;
    } catch (error) {
      // Special case: if backend returns structured error response, return it instead of throwing
      if (axios.isAxiosError(error) && error.response?.data && 
          typeof error.response.data === 'object' && 
          'success' in error.response.data && 
          'message' in error.response.data) {
        return error.response.data as T;
      }
      throw this.handleError(error);
    }
  }

  async delete<T>(endpoint: string): Promise<T> {
    try {
      const response = await apiClient.delete<T>(endpoint);
      return response.data;
    } catch (error) {
      // Special case: if backend returns structured error response, return it instead of throwing
      if (axios.isAxiosError(error) && error.response?.data && 
          typeof error.response.data === 'object' && 
          'success' in error.response.data && 
          'message' in error.response.data) {
        return error.response.data as T;
      }
      throw this.handleError(error);
    }
  }

  private handleError(error: unknown): Error {
    if (axios.isAxiosError(error)) {
      // Nếu backend trả về response với format { success: false, message: "..." }
      if (error.response?.data?.message) {
        return new Error(error.response.data.message);
      }
      
      // Fallback to general error messages
      const message = error.message || 'An unexpected error occurred';
      return new Error(message);
    }
    return new Error('An unexpected error occurred');
  }
}

export const apiService = ApiService.getInstance();
