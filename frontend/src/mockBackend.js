// Mock backend for development when Python backend is not available
let mockData = {
  admins: [],
  products: [],
  categories: [],
  orders: [],
  messages: []
};

// Simple JWT mock
const createMockToken = (adminId) => {
  return btoa(JSON.stringify({ sub: adminId, exp: Date.now() + 86400000 }));
};

const mockAPI = {
  // Admin endpoints
  'http://localhost:8000/api/admin/register': (data) => {
    console.log('Mock register called with:', data);
    if (mockData.admins.length > 0) {
      throw new Error('Admin already exists');
    }
    const admin = {
      id: Date.now().toString(),
      email: data.email,
      name: data.name,
      created_at: new Date().toISOString()
    };
    mockData.admins.push({ ...admin, password: data.password });
    console.log('Admin created:', admin);
    return {
      access_token: createMockToken(admin.id),
      token_type: 'bearer',
      admin
    };
  },

  'http://localhost:8000/api/admin/login': (data) => {
    console.log('Mock login called with:', data);
    const admin = mockData.admins.find(a => a.email === data.email && a.password === data.password);
    if (!admin) {
      throw new Error('Invalid credentials');
    }
    const { password, ...adminResponse } = admin;
    return {
      access_token: createMockToken(admin.id),
      token_type: 'bearer',
      admin: adminResponse
    };
  },

  'http://localhost:8000/api/stats': () => ({
    total_products: mockData.products.length,
    total_categories: mockData.categories.length,
    total_orders: mockData.orders.length,
    pending_orders: mockData.orders.filter(o => o.status === 'pending').length,
    unread_messages: mockData.messages.filter(m => !m.read).length
  }),

  'http://localhost:8000/api/products/all': () => mockData.products,
  'http://localhost:8000/api/categories': () => mockData.categories,
  'http://localhost:8000/api/orders': () => mockData.orders,
  'http://localhost:8000/api/contact': () => mockData.messages
};

let mockModeEnabled = false;

// Mock axios implementation
export const mockAxios = {
  post: async (url, data) => {
    console.log('Mock API POST:', url, data);
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
    
    if (mockAPI[url]) {
      try {
        const result = mockAPI[url](data);
        console.log('Mock API POST result:', result);
        return { data: result };
      } catch (error) {
        console.error('Mock API POST error:', error);
        throw { response: { data: { detail: error.message } } };
      }
    }
    throw new Error(`Mock endpoint not found: ${url}`);
  },
  get: async (url) => {
    console.log('Mock API GET:', url);
    await new Promise(resolve => setTimeout(resolve, 300)); // Simulate network delay
    
    if (mockAPI[url]) {
      try {
        const result = mockAPI[url]();
        console.log('Mock API GET result:', result);
        return { data: result };
      } catch (error) {
        console.error('Mock API GET error:', error);
        throw { response: { data: { detail: error.message } } };
      }
    }
    throw new Error(`Mock endpoint not found: ${url}`);
  }
};

// Enable mock mode
export const enableMockMode = () => {
  mockModeEnabled = true;
  console.log('🚀 Mock backend enabled - you can now create admin accounts without Python backend');
  console.log('Available mock endpoints:', Object.keys(mockAPI));
};

// Check if mock mode is enabled
export const isMockModeEnabled = () => mockModeEnabled;

// Reset mock data (useful for testing)
export const resetMockData = () => {
  mockData = {
    admins: [],
    products: [],
    categories: [],
    orders: [],
    messages: []
  };
  console.log('Mock data reset');
};