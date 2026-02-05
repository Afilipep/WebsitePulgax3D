// Real API client for backend server
const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';

// Helper function to make API requests
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}/api${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  // Add auth token if available
  const adminToken = localStorage.getItem('pulgax-admin-token');
  const customerToken = localStorage.getItem('pulgax-customer-token');
  
  if (adminToken && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${adminToken}`;
  } else if (customerToken && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${customerToken}`;
  }

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: 'Network error' }));
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  } catch (error) {
    console.error('API Request failed:', {
      url,
      method: config.method || 'GET',
      status: error.status,
      message: error.message
    });
    throw error;
  }
};

// API endpoints
export const api = {
  // Admin authentication
  adminRegister: (data) => apiRequest('/admin/register', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  adminLogin: (data) => apiRequest('/admin/login', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  adminMe: () => apiRequest('/admin/me'),

  // Customer authentication
  customerRegister: (data) => apiRequest('/customer/register', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  customerLogin: (data) => apiRequest('/customer/login', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  googleAuth: (data) => apiRequest('/customer/google', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  getCustomerProfile: () => apiRequest('/customer/profile'),
  
  updateCustomerAddress: (data) => apiRequest('/customer/address', {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  
  getCustomerOrders: () => apiRequest('/customer/orders'),

  // Categories
  getCategories: () => apiRequest('/categories'),
  
  createCategory: (data) => apiRequest('/categories', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  updateCategory: (id, data) => apiRequest(`/categories/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  
  deleteCategory: (id) => apiRequest(`/categories/${id}`, {
    method: 'DELETE',
  }),

  // Products
  getProducts: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/products${queryString ? `?${queryString}` : ''}`);
  },
  
  getAllProducts: () => apiRequest('/products/all'),
  
  getProduct: (id) => apiRequest(`/products/${id}`),
  
  createProduct: (data) => apiRequest('/products', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  updateProduct: (id, data) => apiRequest(`/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  
  deleteProduct: (id) => apiRequest(`/products/${id}`, {
    method: 'DELETE',
  }),

  // Orders
  getOrders: () => apiRequest('/orders'),
  
  getOrder: (id) => apiRequest(`/orders/${id}`),
  
  getOrderDetails: (id) => apiRequest(`/orders/${id}`),
  
  createOrder: (data) => apiRequest('/orders', {
    method: 'POST',
    body: JSON.stringify(data),
  }).then(response => ({ data: response })), // Wrap response to match expected structure
  
  updateOrderStatus: (id, status, note = '') => apiRequest(`/orders/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status, note }),
  }),
  
  processRefund: (id, refundData) => apiRequest(`/orders/${id}/refund`, {
    method: 'POST',
    body: JSON.stringify(refundData),
  }),

  // Contact messages
  getMessages: () => apiRequest('/contact'),
  
  createMessage: (data) => apiRequest('/contact', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  markMessageRead: (id) => apiRequest(`/contact/${id}/read`, {
    method: 'PUT',
  }),
  
  deleteMessage: (id) => apiRequest(`/contact/${id}`, {
    method: 'DELETE',
  }),

  
  // Stats
  getStats: () => apiRequest('/stats'),

  // Data validation
  validateData: () => apiRequest('/validate'),

  // Image upload (simplified - in production would upload to cloud storage)
  uploadImage: (file) => {
    return Promise.resolve({
      data: {
        url: URL.createObjectURL(file) // Create a local URL for the image
      }
    });
  },

  // Health check
  healthCheck: () => apiRequest('/'),
};

export default api;