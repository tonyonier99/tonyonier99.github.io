import axios, { AxiosResponse } from 'axios';
import { ApiResponse } from '@/types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

// Create axios instance
export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to login on unauthorized
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Generic API request wrapper
export const apiRequest = async <T = any>(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  url: string,
  data?: any,
  config?: any
): Promise<ApiResponse<T>> => {
  try {
    const response = await api.request({
      method,
      url,
      data,
      ...config,
    });
    
    return {
      data: response.data,
    };
  } catch (error: any) {
    return {
      error: error.response?.data?.error || error.message || 'An error occurred',
    };
  }
};

export default api;