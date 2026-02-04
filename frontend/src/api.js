// Real API client for Pulgax 3D Store
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_admin');
      window.location.href = '/admin';
    }
    return Promise.reject(error);
  }
);

// API endpoints
export const api = {
  // Admin authentication
  adminRegister: (data) => apiClient.post('/api/admin/register', data),
  adminLogin: (data) => apiClient.post('/api/admin/login', data),
  adminMe: () => apiClient.get('/api/admin/me'),

  // Categories
  getCategories: () => apiClient.get('/api/categories'),
  createCategory: (data) => apiClient.post('/api/categories', data),
  updateCategory: (id, data) => apiClient.put(`/api/categories/${id}`, data),
  deleteCategory: (id) => apiClient.delete(`/api/categories/${id}`),

  // Products
  getProducts: (params = {}) => apiClient.get('/api/products', { params }),
  getAllProducts: () => apiClient.get('/api/products/all'),
  getProduct: (id) => apiClient.get(`/api/products/${id}`),
  createProduct: (data) => apiClient.post('/api/products', data),
  updateProduct: (id, data) => apiClient.put(`/api/products/${id}`, data),
  deleteProduct: (id) => apiClient.delete(`/api/products/${id}`),

  // Orders
  getOrders: () => apiClient.get('/api/orders'),
  getOrder: (id) => apiClient.get(`/api/orders/${id}`),
  createOrder: (data) => apiClient.post('/api/orders', data),
  updateOrderStatus: (id, status) => apiClient.put(`/api/orders/${id}/status?status=${status}`),

  // Contact messages
  getMessages: () => apiClient.get('/api/contact'),
  createMessage: (data) => apiClient.post('/api/contact', data),
  markMessageRead: (id) => apiClient.put(`/api/contact/${id}/read`),
  deleteMessage: (id) => apiClient.delete(`/api/contact/${id}`),

  // Stats
  getStats: () => apiClient.get('/api/stats'),

  // Image upload
  uploadImage: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.post('/api/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Health check
  healthCheck: () => apiClient.get('/api/'),
};

export default api;