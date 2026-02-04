// Local API with persistent storage using localStorage
// This simulates a real API but stores data locally in the browser

const STORAGE_KEYS = {
  ADMINS: 'pulgax_admins',
  PRODUCTS: 'pulgax_products',
  CATEGORIES: 'pulgax_categories',
  ORDERS: 'pulgax_orders',
  MESSAGES: 'pulgax_messages',
  CURRENT_ADMIN: 'pulgax_current_admin'
};

// Helper functions for localStorage
const getStorageData = (key) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error(`Error reading ${key} from localStorage:`, error);
    return [];
  }
};

const setStorageData = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
    return false;
  }
};

// Simple JWT mock
const createToken = (adminId) => {
  const payload = {
    sub: adminId,
    exp: Date.now() + (7 * 24 * 60 * 60 * 1000) // 7 days
  };
  return btoa(JSON.stringify(payload));
};

const verifyToken = (token) => {
  try {
    const payload = JSON.parse(atob(token));
    if (payload.exp < Date.now()) {
      throw new Error('Token expired');
    }
    return payload.sub;
  } catch (error) {
    throw new Error('Invalid token');
  }
};

// Hash password (simple for demo - in real app use proper hashing)
const hashPassword = (password) => {
  return btoa(password + 'pulgax_salt');
};

const verifyPassword = (password, hash) => {
  return hashPassword(password) === hash;
};

// Local API implementation
export const localAPI = {
  // Admin endpoints
  async adminRegister(data) {
    console.log('🔐 Local API: Admin Register', data);
    
    const admins = getStorageData(STORAGE_KEYS.ADMINS);
    
    // Check if admin already exists
    if (admins.length > 0) {
      throw new Error('Admin already exists');
    }
    
    // Check if email already exists
    if (admins.find(a => a.email === data.email)) {
      throw new Error('Email already registered');
    }
    
    const admin = {
      id: Date.now().toString(),
      email: data.email,
      name: data.name,
      password: hashPassword(data.password),
      created_at: new Date().toISOString()
    };
    
    admins.push(admin);
    setStorageData(STORAGE_KEYS.ADMINS, admins);
    
    const token = createToken(admin.id);
    const { password, ...adminResponse } = admin;
    
    // Store current admin session
    setStorageData(STORAGE_KEYS.CURRENT_ADMIN, { admin: adminResponse, token });
    
    console.log('✅ Admin registered successfully:', adminResponse);
    
    return {
      access_token: token,
      token_type: 'bearer',
      admin: adminResponse
    };
  },

  async adminLogin(data) {
    console.log('🔐 Local API: Admin Login', data);
    
    const admins = getStorageData(STORAGE_KEYS.ADMINS);
    const admin = admins.find(a => a.email === data.email);
    
    if (!admin || !verifyPassword(data.password, admin.password)) {
      throw new Error('Invalid credentials');
    }
    
    const token = createToken(admin.id);
    const { password, ...adminResponse } = admin;
    
    // Store current admin session
    setStorageData(STORAGE_KEYS.CURRENT_ADMIN, { admin: adminResponse, token });
    
    console.log('✅ Admin logged in successfully:', adminResponse);
    
    return {
      access_token: token,
      token_type: 'bearer',
      admin: adminResponse
    };
  },

  async getStats() {
    console.log('📊 Local API: Get Stats');
    
    const products = getStorageData(STORAGE_KEYS.PRODUCTS);
    const categories = getStorageData(STORAGE_KEYS.CATEGORIES);
    const orders = getStorageData(STORAGE_KEYS.ORDERS);
    const messages = getStorageData(STORAGE_KEYS.MESSAGES);
    
    return {
      total_products: products.length,
      total_categories: categories.length,
      total_orders: orders.length,
      pending_orders: orders.filter(o => o.status === 'pending').length,
      unread_messages: messages.filter(m => !m.read).length
    };
  },

  async getProducts() {
    console.log('📦 Local API: Get Products');
    return getStorageData(STORAGE_KEYS.PRODUCTS);
  },

  async createProduct(data) {
    console.log('📦 Local API: Create Product', data);
    
    const products = getStorageData(STORAGE_KEYS.PRODUCTS);
    const product = {
      id: Date.now().toString(),
      ...data,
      created_at: new Date().toISOString()
    };
    
    products.push(product);
    setStorageData(STORAGE_KEYS.PRODUCTS, products);
    
    return product;
  },

  async updateProduct(id, data) {
    console.log('📦 Local API: Update Product', id, data);
    
    const products = getStorageData(STORAGE_KEYS.PRODUCTS);
    const index = products.findIndex(p => p.id === id);
    
    if (index === -1) {
      throw new Error('Product not found');
    }
    
    products[index] = { ...products[index], ...data };
    setStorageData(STORAGE_KEYS.PRODUCTS, products);
    
    return products[index];
  },

  async deleteProduct(id) {
    console.log('📦 Local API: Delete Product', id);
    
    const products = getStorageData(STORAGE_KEYS.PRODUCTS);
    const filteredProducts = products.filter(p => p.id !== id);
    
    if (filteredProducts.length === products.length) {
      throw new Error('Product not found');
    }
    
    setStorageData(STORAGE_KEYS.PRODUCTS, filteredProducts);
    return { message: 'Product deleted' };
  },

  async getCategories() {
    console.log('📂 Local API: Get Categories');
    return getStorageData(STORAGE_KEYS.CATEGORIES);
  },

  async createCategory(data) {
    console.log('📂 Local API: Create Category', data);
    
    const categories = getStorageData(STORAGE_KEYS.CATEGORIES);
    const category = {
      id: Date.now().toString(),
      ...data,
      created_at: new Date().toISOString()
    };
    
    categories.push(category);
    setStorageData(STORAGE_KEYS.CATEGORIES, categories);
    
    return category;
  },

  async updateCategory(id, data) {
    console.log('📂 Local API: Update Category', id, data);
    
    const categories = getStorageData(STORAGE_KEYS.CATEGORIES);
    const index = categories.findIndex(c => c.id === id);
    
    if (index === -1) {
      throw new Error('Category not found');
    }
    
    categories[index] = { ...categories[index], ...data };
    setStorageData(STORAGE_KEYS.CATEGORIES, categories);
    
    return categories[index];
  },

  async deleteCategory(id) {
    console.log('📂 Local API: Delete Category', id);
    
    const categories = getStorageData(STORAGE_KEYS.CATEGORIES);
    const filteredCategories = categories.filter(c => c.id !== id);
    
    if (filteredCategories.length === categories.length) {
      throw new Error('Category not found');
    }
    
    setStorageData(STORAGE_KEYS.CATEGORIES, filteredCategories);
    return { message: 'Category deleted' };
  },

  async getOrders() {
    console.log('🛒 Local API: Get Orders');
    return getStorageData(STORAGE_KEYS.ORDERS);
  },

  async getMessages() {
    console.log('💬 Local API: Get Messages');
    return getStorageData(STORAGE_KEYS.MESSAGES);
  },

  async createMessage(data) {
    console.log('💬 Local API: Create Message', data);
    
    const messages = getStorageData(STORAGE_KEYS.MESSAGES);
    const message = {
      id: Date.now().toString(),
      ...data,
      read: false,
      created_at: new Date().toISOString()
    };
    
    messages.push(message);
    setStorageData(STORAGE_KEYS.MESSAGES, messages);
    
    return message;
  },

  async updateMessage(id, data) {
    console.log('💬 Local API: Update Message', id, data);
    
    const messages = getStorageData(STORAGE_KEYS.MESSAGES);
    const index = messages.findIndex(m => m.id === id);
    
    if (index === -1) {
      throw new Error('Message not found');
    }
    
    messages[index] = { ...messages[index], ...data };
    setStorageData(STORAGE_KEYS.MESSAGES, messages);
    
    return messages[index];
  },

  async deleteMessage(id) {
    console.log('💬 Local API: Delete Message', id);
    
    const messages = getStorageData(STORAGE_KEYS.MESSAGES);
    const filteredMessages = messages.filter(m => m.id !== id);
    
    if (filteredMessages.length === messages.length) {
      throw new Error('Message not found');
    }
    
    setStorageData(STORAGE_KEYS.MESSAGES, filteredMessages);
    return { message: 'Message deleted' };
  },

  async updateOrder(id, data) {
    console.log('🛒 Local API: Update Order', id, data);
    
    const orders = getStorageData(STORAGE_KEYS.ORDERS);
    const index = orders.findIndex(o => o.id === id);
    
    if (index === -1) {
      throw new Error('Order not found');
    }
    
    orders[index] = { ...orders[index], ...data };
    setStorageData(STORAGE_KEYS.ORDERS, orders);
    
    return orders[index];
  },

  // Session management
  getCurrentSession() {
    return getStorageData(STORAGE_KEYS.CURRENT_ADMIN);
  },

  clearSession() {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_ADMIN);
  },

  // Data management
  clearAllData() {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
    console.log('🗑️ All local data cleared');
  },

  exportData() {
    const data = {};
    Object.entries(STORAGE_KEYS).forEach(([name, key]) => {
      data[name] = getStorageData(key);
    });
    return data;
  },

  importData(data) {
    Object.entries(data).forEach(([name, value]) => {
      const key = STORAGE_KEYS[name];
      if (key) {
        setStorageData(key, value);
      }
    });
    console.log('📥 Data imported successfully');
  }
};

// API wrapper that mimics axios
export const createLocalAxios = () => {
  const baseURL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';
  
  return {
    post: async (url, data) => {
      console.log('🌐 Local Axios POST:', url, data);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      try {
        let result;
        
        if (url.includes('/admin/register')) {
          result = await localAPI.adminRegister(data);
        } else if (url.includes('/admin/login')) {
          result = await localAPI.adminLogin(data);
        } else if (url.includes('/products')) {
          result = await localAPI.createProduct(data);
        } else if (url.includes('/categories')) {
          result = await localAPI.createCategory(data);
        } else if (url.includes('/contact')) {
          result = await localAPI.createMessage(data);
        } else {
          throw new Error(`Endpoint not implemented: ${url}`);
        }
        
        return { data: result };
      } catch (error) {
        console.error('Local API Error:', error);
        throw { response: { data: { detail: error.message } } };
      }
    },

    put: async (url, data) => {
      console.log('🌐 Local Axios PUT:', url, data);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      try {
        let result;
        
        if (url.includes('/products/')) {
          const id = url.split('/products/')[1];
          result = await localAPI.updateProduct(id, data);
        } else if (url.includes('/categories/')) {
          const id = url.split('/categories/')[1];
          result = await localAPI.updateCategory(id, data);
        } else if (url.includes('/orders/') && url.includes('/status')) {
          const id = url.split('/orders/')[1].split('/status')[0];
          const status = new URLSearchParams(url.split('?')[1]).get('status');
          result = await localAPI.updateOrder(id, { status });
        } else if (url.includes('/contact/') && url.includes('/read')) {
          const id = url.split('/contact/')[1].split('/read')[0];
          result = await localAPI.updateMessage(id, { read: true });
        } else {
          throw new Error(`PUT endpoint not implemented: ${url}`);
        }
        
        return { data: result };
      } catch (error) {
        console.error('Local API Error:', error);
        throw { response: { data: { detail: error.message } } };
      }
    },

    delete: async (url) => {
      console.log('🌐 Local Axios DELETE:', url);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 200));
      
      try {
        let result;
        
        if (url.includes('/products/')) {
          const id = url.split('/products/')[1];
          result = await localAPI.deleteProduct(id);
        } else if (url.includes('/categories/')) {
          const id = url.split('/categories/')[1];
          result = await localAPI.deleteCategory(id);
        } else {
          throw new Error(`DELETE endpoint not implemented: ${url}`);
        }
        
        return { data: result };
      } catch (error) {
        console.error('Local API Error:', error);
        throw { response: { data: { detail: error.message } } };
      }
    },

    get: async (url) => {
      console.log('🌐 Local Axios GET:', url);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 200));
      
      try {
        let result;
        
        if (url.includes('/stats')) {
          result = await localAPI.getStats();
        } else if (url.includes('/products')) {
          result = await localAPI.getProducts();
        } else if (url.includes('/categories')) {
          result = await localAPI.getCategories();
        } else if (url.includes('/orders')) {
          result = await localAPI.getOrders();
        } else if (url.includes('/contact')) {
          result = await localAPI.getMessages();
        } else {
          throw new Error(`Endpoint not implemented: ${url}`);
        }
        
        return { data: result };
      } catch (error) {
        console.error('Local API Error:', error);
        throw { response: { data: { detail: error.message } } };
      }
    }
  };
};

// Initialize with some sample data if empty
export const initializeSampleData = () => {
  const categories = getStorageData(STORAGE_KEYS.CATEGORIES);
  const products = getStorageData(STORAGE_KEYS.PRODUCTS);
  
  if (categories.length === 0) {
    const sampleCategories = [
      {
        id: '1',
        name_pt: 'Decoração',
        name_en: 'Decoration',
        description_pt: 'Itens decorativos impressos em 3D para casa e escritório',
        description_en: '3D printed decorative items for home and office',
        image_url: '',
        created_at: new Date().toISOString()
      },
      {
        id: '2',
        name_pt: 'Utilitários',
        name_en: 'Utilities',
        description_pt: 'Objetos úteis para o dia a dia',
        description_en: 'Useful everyday objects',
        image_url: '',
        created_at: new Date().toISOString()
      },
      {
        id: '3',
        name_pt: 'Brinquedos',
        name_en: 'Toys',
        description_pt: 'Brinquedos e jogos impressos em 3D',
        description_en: '3D printed toys and games',
        image_url: '',
        created_at: new Date().toISOString()
      }
    ];
    setStorageData(STORAGE_KEYS.CATEGORIES, sampleCategories);
    console.log('📂 Sample categories created:', sampleCategories.length);
  }
  
  if (products.length === 0) {
    const sampleProducts = [
      {
        id: '1',
        name_pt: 'Vaso Decorativo Moderno',
        name_en: 'Modern Decorative Vase',
        description_pt: 'Vaso decorativo moderno impresso em 3D com design elegante',
        description_en: 'Modern decorative vase 3D printed with elegant design',
        base_price: 25.99,
        category_id: '1',
        colors: [
          { name_pt: 'Branco', name_en: 'White', hex_code: '#FFFFFF', image_url: '' },
          { name_pt: 'Preto', name_en: 'Black', hex_code: '#000000', image_url: '' }
        ],
        sizes: [
          { name: 'Pequeno', price_adjustment: 0 },
          { name: 'Grande', price_adjustment: 10 }
        ],
        customization_options: [
          { name_pt: 'Gravação', name_en: 'Engraving', type: 'text', required: false, max_length: 50 }
        ],
        images: [],
        featured: true,
        active: true,
        created_at: new Date().toISOString()
      },
      {
        id: '2',
        name_pt: 'Suporte para Telemóvel',
        name_en: 'Phone Stand',
        description_pt: 'Suporte ajustável para telemóvel impresso em 3D',
        description_en: 'Adjustable phone stand 3D printed',
        base_price: 12.50,
        category_id: '2',
        colors: [],
        sizes: [],
        customization_options: [],
        images: [],
        featured: false,
        active: true,
        created_at: new Date().toISOString()
      },
      {
        id: '3',
        name_pt: 'Puzzle 3D',
        name_en: '3D Puzzle',
        description_pt: 'Puzzle 3D educativo para crianças',
        description_en: 'Educational 3D puzzle for children',
        base_price: 18.75,
        category_id: '3',
        colors: [
          { name_pt: 'Colorido', name_en: 'Colorful', hex_code: '#FF6B6B', image_url: '' }
        ],
        sizes: [],
        customization_options: [],
        images: [],
        featured: true,
        active: true,
        created_at: new Date().toISOString()
      }
    ];
    setStorageData(STORAGE_KEYS.PRODUCTS, sampleProducts);
    console.log('📦 Sample products created:', sampleProducts.length);
  }
  
  // Add some sample messages
  const messages = getStorageData(STORAGE_KEYS.MESSAGES);
  if (messages.length === 0) {
    const sampleMessages = [
      {
        id: '1',
        name: 'João Silva',
        email: 'joao@example.com',
        phone: '912345678',
        subject: 'Informações sobre produtos',
        message: 'Gostaria de saber mais sobre os vossos produtos de decoração.',
        read: false,
        created_at: new Date(Date.now() - 86400000).toISOString() // 1 day ago
      },
      {
        id: '2',
        name: 'Maria Santos',
        email: 'maria@example.com',
        phone: '923456789',
        subject: 'Encomenda personalizada',
        message: 'Posso fazer uma encomenda personalizada de um vaso?',
        read: true,
        created_at: new Date(Date.now() - 172800000).toISOString() // 2 days ago
      }
    ];
    setStorageData(STORAGE_KEYS.MESSAGES, sampleMessages);
    console.log('💬 Sample messages created:', sampleMessages.length);
  }
  
  console.log('🎯 Sample data initialization complete');
};