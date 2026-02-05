// Local storage-based API for Netlify deployment
// This replaces the backend API with localStorage-based data management

// Initialize default data if not exists
const initializeData = () => {
  // Admin data
  if (!localStorage.getItem('pulgax-admins')) {
    const defaultAdmins = [
      {
        id: 'admin-pulgax-123',
        email: 'admin@pulgax.com',
        password: 'admin123', // In a real app, this would be hashed
        name: 'Admin Pulgax',
        created_at: new Date().toISOString()
      }
    ];
    localStorage.setItem('pulgax-admins', JSON.stringify(defaultAdmins));
  }

  // Categories data
  if (!localStorage.getItem('pulgax-categories')) {
    const defaultCategories = [
      {
        id: 'cat-1',
        name_pt: 'Decoração',
        name_en: 'Decoration',
        description_pt: 'Peças decorativas únicas',
        description_en: 'Unique decorative pieces',
        image_url: '',
        created_at: new Date().toISOString()
      },
      {
        id: 'cat-2',
        name_pt: 'Utilitários',
        name_en: 'Utilities',
        description_pt: 'Objetos úteis para o dia-a-dia',
        description_en: 'Useful objects for everyday life',
        image_url: '',
        created_at: new Date().toISOString()
      },
      {
        id: 'cat-3',
        name_pt: 'Presentes',
        name_en: 'Gifts',
        description_pt: 'Presentes personalizados especiais',
        description_en: 'Special personalized gifts',
        image_url: '',
        created_at: new Date().toISOString()
      }
    ];
    localStorage.setItem('pulgax-categories', JSON.stringify(defaultCategories));
  }

  // Products data
  if (!localStorage.getItem('pulgax-products')) {
    const defaultProducts = [
      {
        id: 'prod-1',
        name_pt: 'Vaso Geométrico',
        name_en: 'Geometric Vase',
        description_pt: 'Vaso decorativo com design geométrico moderno, perfeito para plantas pequenas ou como peça decorativa.',
        description_en: 'Decorative vase with modern geometric design, perfect for small plants or as decorative piece.',
        base_price: 25.99,
        category_id: 'cat-1',
        colors: [
          { name: 'Branco', hex_code: '#FFFFFF', image_url: '' },
          { name: 'Preto', hex_code: '#000000', image_url: '' },
          { name: 'Azul', hex_code: '#3B82F6', image_url: '' },
          { name: 'Verde', hex_code: '#10B981', image_url: '' },
          { name: 'Rosa', hex_code: '#EC4899', image_url: '' }
        ],
        sizes: [
          { name: 'Pequeno (8cm)', price_modifier: 0, image_url: '' },
          { name: 'Médio (12cm)', price_modifier: 8, image_url: '' },
          { name: 'Grande (16cm)', price_modifier: 15, image_url: '' }
        ],
        customization_options: [
          { name: 'Gravação de nome', price_modifier: 3.50 },
          { name: 'Padrão personalizado', price_modifier: 5.00 }
        ],
        images: ['/api/placeholder/400/400'],
        is_featured: true,
        is_active: true,
        created_at: new Date().toISOString()
      },
      {
        id: 'prod-2',
        name_pt: 'Porta-Chaves Personalizado',
        name_en: 'Custom Keychain',
        description_pt: 'Porta-chaves totalmente personalizado com o seu nome, logótipo ou design. Resistente e durável.',
        description_en: 'Fully customized keychain with your name, logo or design. Resistant and durable.',
        base_price: 8.99,
        category_id: 'cat-3',
        colors: [
          { name: 'Branco', hex_code: '#FFFFFF', image_url: '' },
          { name: 'Preto', hex_code: '#000000', image_url: '' },
          { name: 'Azul', hex_code: '#3B82F6', image_url: '' },
          { name: 'Vermelho', hex_code: '#EF4444', image_url: '' },
          { name: 'Verde', hex_code: '#10B981', image_url: '' },
          { name: 'Amarelo', hex_code: '#F59E0B', image_url: '' },
          { name: 'Roxo', hex_code: '#8B5CF6', image_url: '' }
        ],
        sizes: [
          { name: 'Pequeno (3cm)', price_modifier: 0, image_url: '' },
          { name: 'Médio (5cm)', price_modifier: 2.50, image_url: '' },
          { name: 'Grande (7cm)', price_modifier: 5.00, image_url: '' }
        ],
        customization_options: [
          { name: 'Nome personalizado', price_modifier: 2.00 },
          { name: 'Número personalizado', price_modifier: 1.50 },
          { name: 'Logótipo/Imagem', price_modifier: 5.00 },
          { name: 'Acabamento brilhante', price_modifier: 1.50 },
          { name: 'Corrente premium', price_modifier: 3.00 }
        ],
        images: ['/api/placeholder/400/400'],
        is_featured: true,
        is_active: true,
        created_at: new Date().toISOString()
      },
      {
        id: 'prod-3',
        name_pt: 'Caneca Personalizada',
        name_en: 'Custom Mug',
        description_pt: 'Caneca impressa em 3D com design personalizado. Perfeita para café, chá ou chocolate quente.',
        description_en: '3D printed mug with custom design. Perfect for coffee, tea or hot chocolate.',
        base_price: 18.99,
        category_id: 'cat-2',
        colors: [
          { name: 'Azul Oceano', hex_code: '#0EA5E9', image_url: '' },
          { name: 'Verde Floresta', hex_code: '#059669', image_url: '' },
          { name: 'Rosa Suave', hex_code: '#EC4899', image_url: '' },
          { name: 'Laranja Vibrante', hex_code: '#F97316', image_url: '' },
          { name: 'Roxo Místico', hex_code: '#7C3AED', image_url: '' }
        ],
        sizes: [
          { name: 'Pequena (250ml)', price_modifier: 0, image_url: '' },
          { name: 'Média (350ml)', price_modifier: 3.00, image_url: '' },
          { name: 'Grande (500ml)', price_modifier: 6.00, image_url: '' },
          { name: 'XL (750ml)', price_modifier: 10.00, image_url: '' }
        ],
        customization_options: [
          { name: 'Nome personalizado', price_modifier: 3.00 },
          { name: 'Frase motivacional', price_modifier: 4.00 },
          { name: 'Data especial', price_modifier: 2.50 },
          { name: 'Foto personalizada', price_modifier: 8.00 }
        ],
        images: ['/api/placeholder/400/400'],
        is_featured: true,
        is_active: true,
        created_at: new Date().toISOString()
      },
      {
        id: 'prod-4',
        name_pt: 'Suporte para Telemóvel',
        name_en: 'Phone Stand',
        description_pt: 'Suporte ergonómico para telemóvel com design moderno. Ajustável e compatível com todos os dispositivos.',
        description_en: 'Ergonomic phone stand with modern design. Adjustable and compatible with all devices.',
        base_price: 12.99,
        category_id: 'cat-2',
        colors: [
          { name: 'Preto Mate', hex_code: '#1F2937', image_url: '' },
          { name: 'Branco Puro', hex_code: '#FFFFFF', image_url: '' },
          { name: 'Cinza Espacial', hex_code: '#6B7280', image_url: '' },
          { name: 'Azul Tecnológico', hex_code: '#1E40AF', image_url: '' }
        ],
        sizes: [
          { name: 'Compacto', price_modifier: 0, image_url: '' },
          { name: 'Standard', price_modifier: 2.00, image_url: '' },
          { name: 'Pro (ajustável)', price_modifier: 5.00, image_url: '' }
        ],
        customization_options: [
          { name: 'Gravação de nome', price_modifier: 2.50 },
          { name: 'Logo da empresa', price_modifier: 4.00 },
          { name: 'Base antiderrapante', price_modifier: 1.50 }
        ],
        images: ['/api/placeholder/400/400'],
        is_featured: false,
        is_active: true,
        created_at: new Date().toISOString()
      },
      {
        id: 'prod-5',
        name_pt: 'Organizador de Secretária',
        name_en: 'Desk Organizer',
        description_pt: 'Organizador multifuncional para secretária com compartimentos para canetas, clips e pequenos objetos.',
        description_en: 'Multifunctional desk organizer with compartments for pens, clips and small objects.',
        base_price: 22.50,
        category_id: 'cat-2',
        colors: [
          { name: 'Madeira Clara', hex_code: '#D2B48C', image_url: '' },
          { name: 'Madeira Escura', hex_code: '#8B4513', image_url: '' },
          { name: 'Preto Executivo', hex_code: '#000000', image_url: '' },
          { name: 'Branco Minimalista', hex_code: '#FFFFFF', image_url: '' },
          { name: 'Azul Corporativo', hex_code: '#1E3A8A', image_url: '' }
        ],
        sizes: [
          { name: 'Compacto (3 compartimentos)', price_modifier: 0, image_url: '' },
          { name: 'Médio (5 compartimentos)', price_modifier: 5.00, image_url: '' },
          { name: 'Grande (7 compartimentos)', price_modifier: 10.00, image_url: '' },
          { name: 'XL (10 compartimentos)', price_modifier: 18.00, image_url: '' }
        ],
        customization_options: [
          { name: 'Nome/Empresa gravado', price_modifier: 4.00 },
          { name: 'Compartimento para cartões', price_modifier: 3.00 },
          { name: 'Suporte para telemóvel integrado', price_modifier: 6.00 }
        ],
        images: ['/api/placeholder/400/400'],
        is_featured: true,
        is_active: true,
        created_at: new Date().toISOString()
      },
      {
        id: 'prod-6',
        name_pt: 'Miniatura Decorativa',
        name_en: 'Decorative Miniature',
        description_pt: 'Miniatura detalhada de animais, veículos ou personagens. Perfeita para colecionadores.',
        description_en: 'Detailed miniature of animals, vehicles or characters. Perfect for collectors.',
        base_price: 15.99,
        category_id: 'cat-1',
        colors: [
          { name: 'Natural', hex_code: '#F5F5DC', image_url: '' },
          { name: 'Dourado', hex_code: '#FFD700', image_url: '' },
          { name: 'Prateado', hex_code: '#C0C0C0', image_url: '' },
          { name: 'Bronze', hex_code: '#CD7F32', image_url: '' },
          { name: 'Colorido', hex_code: '#FF6B6B', image_url: '' }
        ],
        sizes: [
          { name: 'Mini (5cm)', price_modifier: 0, image_url: '' },
          { name: 'Pequeno (8cm)', price_modifier: 3.00, image_url: '' },
          { name: 'Médio (12cm)', price_modifier: 8.00, image_url: '' },
          { name: 'Grande (16cm)', price_modifier: 15.00, image_url: '' }
        ],
        customization_options: [
          { name: 'Tema personalizado', price_modifier: 5.00 },
          { name: 'Base com nome', price_modifier: 3.50 },
          { name: 'Acabamento premium', price_modifier: 4.00 }
        ],
        images: ['/api/placeholder/400/400'],
        is_featured: false,
        is_active: true,
        created_at: new Date().toISOString()
      },
      {
        id: 'prod-7',
        name_pt: 'Porta-Retratos Personalizado',
        name_en: 'Custom Photo Frame',
        description_pt: 'Porta-retratos único com design personalizado. Ideal para fotos especiais e presentes.',
        description_en: 'Unique photo frame with custom design. Ideal for special photos and gifts.',
        base_price: 19.99,
        category_id: 'cat-3',
        colors: [
          { name: 'Branco Clássico', hex_code: '#FFFFFF', image_url: '' },
          { name: 'Preto Elegante', hex_code: '#000000', image_url: '' },
          { name: 'Dourado Luxo', hex_code: '#FFD700', image_url: '' },
          { name: 'Prata Moderna', hex_code: '#C0C0C0', image_url: '' },
          { name: 'Rosa Romântico', hex_code: '#FFB6C1', image_url: '' },
          { name: 'Azul Serenidade', hex_code: '#87CEEB', image_url: '' }
        ],
        sizes: [
          { name: '10x15cm', price_modifier: 0, image_url: '' },
          { name: '13x18cm', price_modifier: 3.00, image_url: '' },
          { name: '15x21cm', price_modifier: 6.00, image_url: '' },
          { name: '20x25cm', price_modifier: 12.00, image_url: '' }
        ],
        customization_options: [
          { name: 'Nomes dos namorados', price_modifier: 3.00 },
          { name: 'Data especial', price_modifier: 2.50 },
          { name: 'Mensagem romântica', price_modifier: 4.00 },
          { name: 'Padrão decorativo', price_modifier: 5.00 },
          { name: 'Suporte de mesa incluído', price_modifier: 2.00 }
        ],
        images: ['/api/placeholder/400/400'],
        is_featured: true,
        is_active: true,
        created_at: new Date().toISOString()
      },
      {
        id: 'prod-8',
        name_pt: 'Luminária LED Personalizada',
        name_en: 'Custom LED Lamp',
        description_pt: 'Luminária LED com design 3D personalizado. Cria ambiente acolhedor com luz suave.',
        description_en: 'LED lamp with custom 3D design. Creates cozy atmosphere with soft light.',
        base_price: 35.99,
        category_id: 'cat-1',
        colors: [
          { name: 'Base Branca', hex_code: '#FFFFFF', image_url: '' },
          { name: 'Base Preta', hex_code: '#000000', image_url: '' },
          { name: 'Base Madeira', hex_code: '#DEB887', image_url: '' }
        ],
        sizes: [
          { name: 'Pequena (15cm)', price_modifier: 0, image_url: '' },
          { name: 'Média (20cm)', price_modifier: 8.00, image_url: '' },
          { name: 'Grande (25cm)', price_modifier: 15.00, image_url: '' }
        ],
        customization_options: [
          { name: 'Nome iluminado', price_modifier: 5.00 },
          { name: 'Desenho personalizado', price_modifier: 8.00 },
          { name: 'Controlo remoto', price_modifier: 12.00 },
          { name: 'Mudança de cores RGB', price_modifier: 15.00 },
          { name: 'Mensagem especial', price_modifier: 4.00 }
        ],
        images: ['/api/placeholder/400/400'],
        is_featured: true,
        is_active: true,
        created_at: new Date().toISOString()
      },
      {
        id: 'prod-9',
        name_pt: 'Puzzle 3D Personalizado',
        name_en: 'Custom 3D Puzzle',
        description_pt: 'Puzzle tridimensional personalizado com a sua foto ou design. Diversão garantida para toda a família.',
        description_en: 'Custom three-dimensional puzzle with your photo or design. Guaranteed fun for the whole family.',
        base_price: 28.99,
        category_id: 'cat-3',
        colors: [
          { name: 'Colorido', hex_code: '#FF6B6B', image_url: '' },
          { name: 'Tons de Cinza', hex_code: '#808080', image_url: '' },
          { name: 'Sépia Vintage', hex_code: '#DEB887', image_url: '' }
        ],
        sizes: [
          { name: '50 peças', price_modifier: 0, image_url: '' },
          { name: '100 peças', price_modifier: 5.00, image_url: '' },
          { name: '200 peças', price_modifier: 12.00, image_url: '' },
          { name: '500 peças', price_modifier: 25.00, image_url: '' }
        ],
        customization_options: [
          { name: 'Foto personalizada', price_modifier: 8.00 },
          { name: 'Texto/Nome', price_modifier: 3.00 },
          { name: 'Caixa personalizada', price_modifier: 5.00 },
          { name: 'Dificuldade extra', price_modifier: 4.00 }
        ],
        images: ['/api/placeholder/400/400'],
        is_featured: false,
        is_active: true,
        created_at: new Date().toISOString()
      },
      {
        id: 'prod-10',
        name_pt: 'Marcador de Livros Artístico',
        name_en: 'Artistic Bookmark',
        description_pt: 'Marcador de livros com design artístico único. Perfeito para amantes da leitura.',
        description_en: 'Bookmark with unique artistic design. Perfect for reading lovers.',
        base_price: 6.99,
        category_id: 'cat-3',
        colors: [
          { name: 'Dourado Antigo', hex_code: '#B8860B', image_url: '' },
          { name: 'Prata Lunar', hex_code: '#C0C0C0', image_url: '' },
          { name: 'Bronze Clássico', hex_code: '#CD7F32', image_url: '' },
          { name: 'Azul Profundo', hex_code: '#191970', image_url: '' },
          { name: 'Verde Esmeralda', hex_code: '#50C878', image_url: '' },
          { name: 'Vermelho Rubi', hex_code: '#E0115F', image_url: '' }
        ],
        sizes: [
          { name: 'Standard (15cm)', price_modifier: 0, image_url: '' },
          { name: 'Longo (20cm)', price_modifier: 1.50, image_url: '' }
        ],
        customization_options: [
          { name: 'Nome do leitor', price_modifier: 1.50 },
          { name: 'Citação favorita', price_modifier: 2.50 },
          { name: 'Símbolo pessoal', price_modifier: 2.00 },
          { name: 'Data especial', price_modifier: 1.00 },
          { name: 'Fita decorativa', price_modifier: 1.50 }
        ],
        images: ['/api/placeholder/400/400'],
        is_featured: false,
        is_active: true,
        created_at: new Date().toISOString()
      }
    ];
    localStorage.setItem('pulgax-products', JSON.stringify(defaultProducts));
  }

  // Orders data
  if (!localStorage.getItem('pulgax-orders')) {
    const defaultOrders = [
      {
        id: 'order-1',
        order_number: 'ORD-2026-001',
        customer_id: 'customer-1',
        customer: {
          name: 'Ana Silva',
          email: 'ana@example.com',
          phone: '912345678',
          address: {
            street: 'Rua das Flores, 123',
            city: 'Lisboa',
            postal_code: '1000-100',
            country: 'Portugal'
          }
        },
        items: [
          {
            product_id: 'prod-1',
            product_name: 'Vaso Decorativo',
            quantity: 1,
            unit_price: 25.99,
            selected_color: 'Branco',
            selected_size: 'Médio',
            customizations: {},
            total_price: 25.99,
            image_url: '/api/placeholder/400/400'
          }
        ],
        totals: {
          subtotal: 25.99,
          shipping: 3.99,
          total: 29.98
        },
        total_amount: 29.98,
        payment: {
          method: 'MB WAY',
          status: 'paid',
          transaction_id: 'TXN-123456789',
          paid_at: new Date().toISOString()
        },
        shipping: {
          method: 'CTT Normal',
          cost: 3.99,
          tracking_number: 'CTT123456789'
        },
        status: 'processing',
        notes: 'Entrega rápida solicitada',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        status_history: [
          {
            status: 'pending',
            note: 'Encomenda criada',
            updated_at: new Date(Date.now() - 86400000).toISOString(),
            updated_by: 'system'
          },
          {
            status: 'confirmed',
            note: 'Pagamento confirmado',
            updated_at: new Date(Date.now() - 43200000).toISOString(),
            updated_by: 'admin@pulgax.com'
          },
          {
            status: 'processing',
            note: 'Em produção',
            updated_at: new Date().toISOString(),
            updated_by: 'admin@pulgax.com'
          }
        ]
      },
      {
        id: 'order-2',
        order_number: 'ORD-2026-002',
        customer_id: 'customer-2',
        customer: {
          name: 'João Santos',
          email: 'joao@example.com',
          phone: '913456789',
          address: {
            street: 'Avenida Central, 456',
            city: 'Porto',
            postal_code: '4000-200',
            country: 'Portugal'
          }
        },
        items: [
          {
            product_id: 'prod-2',
            product_name: 'Porta-chaves Personalizado',
            quantity: 2,
            unit_price: 8.99,
            selected_color: 'Azul',
            selected_size: 'Standard',
            customizations: { 'Texto': 'João' },
            total_price: 17.98,
            image_url: '/api/placeholder/400/400'
          }
        ],
        totals: {
          subtotal: 17.98,
          shipping: 5.99,
          total: 23.97
        },
        total_amount: 23.97,
        payment: {
          method: 'Cartão',
          status: 'paid',
          transaction_id: 'CARD-987654321',
          paid_at: new Date(Date.now() - 172800000).toISOString()
        },
        shipping: {
          method: 'CTT Expresso',
          cost: 5.99,
          tracking_number: 'CTT987654321'
        },
        status: 'delivered',
        notes: '',
        created_at: new Date(Date.now() - 259200000).toISOString(),
        updated_at: new Date(Date.now() - 86400000).toISOString(),
        status_history: [
          {
            status: 'pending',
            note: 'Encomenda criada',
            updated_at: new Date(Date.now() - 259200000).toISOString(),
            updated_by: 'system'
          },
          {
            status: 'confirmed',
            note: 'Pagamento por cartão confirmado',
            updated_at: new Date(Date.now() - 172800000).toISOString(),
            updated_by: 'admin@pulgax.com'
          },
          {
            status: 'processing',
            note: 'Em produção',
            updated_at: new Date(Date.now() - 129600000).toISOString(),
            updated_by: 'admin@pulgax.com'
          },
          {
            status: 'shipped',
            note: 'Enviado via CTT Expresso',
            updated_at: new Date(Date.now() - 86400000).toISOString(),
            updated_by: 'admin@pulgax.com'
          },
          {
            status: 'delivered',
            note: 'Entregue com sucesso',
            updated_at: new Date(Date.now() - 43200000).toISOString(),
            updated_by: 'admin@pulgax.com'
          }
        ]
      }
    ];
    localStorage.setItem('pulgax-orders', JSON.stringify(defaultOrders));
    console.log('Default orders created:', defaultOrders);
  }

  // Customers data
  if (!localStorage.getItem('pulgax-customers')) {
    const defaultCustomers = [
      {
        id: 'customer-1',
        name: 'Test Customer',
        email: 'customer@test.com',
        password: 'test123',
        phone: '912345678',
        address: {
          street: 'Rua das Flores, 123',
          city: 'Lisboa',
          postal_code: '1000-100',
          country: 'Portugal'
        },
        created_at: new Date().toISOString()
      }
    ];
    localStorage.setItem('pulgax-customers', JSON.stringify(defaultCustomers));
  }

  // Messages data
  if (!localStorage.getItem('pulgax-messages')) {
    localStorage.setItem('pulgax-messages', JSON.stringify([]));
  }
};

// Helper functions
const generateId = () => 'id-' + Date.now() + '-' + Math.random().toString(36).substring(2, 11);

const getStorageData = (key) => {
  try {
    return JSON.parse(localStorage.getItem(key) || '[]');
  } catch {
    return [];
  }
};

const setStorageData = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

// Simulate API delay
const delay = (ms = 100) => new Promise(resolve => setTimeout(resolve, ms));

// Local API implementation
export const localAPI = {
  // Initialize data
  init: () => {
    initializeData();
  },

  // Admin authentication
  adminLogin: async (credentials) => {
    await delay();
    const admins = getStorageData('pulgax-admins');
    const admin = admins.find(a => a.email === credentials.email && a.password === credentials.password);
    
    if (!admin) {
      throw new Error('Invalid credentials');
    }

    const token = 'local-admin-token-' + Date.now();
    localStorage.setItem('pulgax-token', token);
    localStorage.setItem('pulgax-admin', JSON.stringify(admin));

    return {
      data: {
        access_token: token,
        admin: {
          id: admin.id,
          email: admin.email,
          name: admin.name,
          created_at: admin.created_at
        }
      }
    };
  },

  adminRegister: async (adminData) => {
    await delay();
    const admins = getStorageData('pulgax-admins');
    
    if (admins.find(a => a.email === adminData.email)) {
      throw new Error('Email already registered');
    }

    const newAdmin = {
      id: generateId(),
      email: adminData.email,
      password: adminData.password, // In a real app, this would be hashed
      name: adminData.name,
      created_at: new Date().toISOString()
    };

    admins.push(newAdmin);
    setStorageData('pulgax-admins', admins);

    const token = 'local-admin-token-' + Date.now();
    localStorage.setItem('pulgax-token', token);
    localStorage.setItem('pulgax-admin', JSON.stringify(newAdmin));

    return {
      data: {
        access_token: token,
        admin: {
          id: newAdmin.id,
          email: newAdmin.email,
          name: newAdmin.name,
          created_at: newAdmin.created_at
        }
      }
    };
  },

  // Customer authentication
  customerLogin: async (credentials) => {
    await delay();
    const customers = getStorageData('pulgax-customers');
    const customer = customers.find(c => c.email === credentials.email && c.password === credentials.password);
    
    if (!customer) {
      throw new Error('Invalid credentials');
    }

    const token = 'local-customer-token-' + Date.now();
    localStorage.setItem('pulgax-customer-token', token);
    localStorage.setItem('pulgax-customer', JSON.stringify(customer));

    return {
      data: {
        access_token: token,
        customer: customer
      }
    };
  },

  customerRegister: async (customerData) => {
    await delay();
    const customers = getStorageData('pulgax-customers');
    
    if (customers.find(c => c.email === customerData.email)) {
      throw new Error('Email already registered');
    }

    const newCustomer = {
      id: generateId(),
      email: customerData.email,
      password: customerData.password,
      name: customerData.name,
      phone: customerData.phone || '',
      address: customerData.address || {},
      created_at: new Date().toISOString()
    };

    customers.push(newCustomer);
    setStorageData('pulgax-customers', customers);

    const token = 'local-customer-token-' + Date.now();
    localStorage.setItem('pulgax-customer-token', token);
    localStorage.setItem('pulgax-customer', JSON.stringify(newCustomer));

    return {
      data: {
        access_token: token,
        customer: newCustomer
      }
    };
  },

  getCustomerProfile: async () => {
    await delay();
    const customer = JSON.parse(localStorage.getItem('pulgax-customer') || '{}');
    return { data: customer };
  },

  updateCustomerAddress: async (addressData) => {
    await delay();
    const customer = JSON.parse(localStorage.getItem('pulgax-customer') || '{}');
    const customers = getStorageData('pulgax-customers');
    
    const updatedCustomer = { ...customer, address: addressData };
    const customerIndex = customers.findIndex(c => c.id === customer.id);
    
    if (customerIndex !== -1) {
      customers[customerIndex] = updatedCustomer;
      setStorageData('pulgax-customers', customers);
      localStorage.setItem('pulgax-customer', JSON.stringify(updatedCustomer));
    }

    return { data: updatedCustomer };
  },

  // Categories
  getCategories: async () => {
    await delay();
    const categories = getStorageData('pulgax-categories');
    return { data: categories };
  },

  createCategory: async (categoryData) => {
    await delay();
    const categories = getStorageData('pulgax-categories');
    const newCategory = {
      id: generateId(),
      ...categoryData,
      created_at: new Date().toISOString()
    };
    categories.push(newCategory);
    setStorageData('pulgax-categories', categories);
    return { data: newCategory };
  },

  updateCategory: async (id, categoryData) => {
    await delay();
    const categories = getStorageData('pulgax-categories');
    const index = categories.findIndex(c => c.id === id);
    if (index !== -1) {
      categories[index] = { ...categories[index], ...categoryData };
      setStorageData('pulgax-categories', categories);
      return { data: categories[index] };
    }
    throw new Error('Category not found');
  },

  deleteCategory: async (id) => {
    await delay();
    const categories = getStorageData('pulgax-categories');
    const filtered = categories.filter(c => c.id !== id);
    setStorageData('pulgax-categories', filtered);
    return { data: { success: true } };
  },

  // Products
  getProducts: async (params = {}) => {
    await delay();
    let products = getStorageData('pulgax-products');
    
    if (params.category) {
      products = products.filter(p => p.category_id === params.category);
    }
    
    if (params.featured) {
      products = products.filter(p => p.is_featured);
    }

    return { data: products };
  },

  getAllProducts: async () => {
    await delay();
    const products = getStorageData('pulgax-products');
    return { data: products };
  },

  getProduct: async (id) => {
    await delay();
    const products = getStorageData('pulgax-products');
    const product = products.find(p => p.id === id);
    if (!product) {
      throw new Error('Product not found');
    }
    return { data: product };
  },

  createProduct: async (productData) => {
    await delay();
    const products = getStorageData('pulgax-products');
    const newProduct = {
      id: generateId(),
      ...productData,
      created_at: new Date().toISOString()
    };
    products.push(newProduct);
    setStorageData('pulgax-products', products);
    return { data: newProduct };
  },

  updateProduct: async (id, productData) => {
    await delay();
    const products = getStorageData('pulgax-products');
    const index = products.findIndex(p => p.id === id);
    if (index !== -1) {
      products[index] = { ...products[index], ...productData };
      setStorageData('pulgax-products', products);
      return { data: products[index] };
    }
    throw new Error('Product not found');
  },

  deleteProduct: async (id) => {
    await delay();
    const products = getStorageData('pulgax-products');
    const filtered = products.filter(p => p.id !== id);
    setStorageData('pulgax-products', filtered);
    return { data: { success: true } };
  },

  // Orders
  getOrders: async () => {
    await delay();
    const orders = getStorageData('pulgax-orders');
    return { data: orders };
  },

  getOrder: async (id) => {
    await delay();
    const orders = getStorageData('pulgax-orders');
    const order = orders.find(o => o.id === id);
    if (!order) {
      throw new Error('Order not found');
    }
    
    // Ensure consistent order structure
    const normalizedOrder = {
      ...order,
      customer: order.customer || {
        name: order.customer_name || 'Cliente Desconhecido',
        email: order.customer_email || 'email@desconhecido.com',
        phone: order.customer_phone || 'N/A',
        address: order.customer_address || order.shipping?.address || {
          street: 'Morada não disponível',
          city: 'N/A',
          postal_code: 'N/A',
          country: 'Portugal'
        }
      },
      payment: order.payment || {
        method: 'Método não especificado',
        status: 'pending',
        transaction_id: 'N/A',
        paid_at: order.created_at || new Date().toISOString()
      },
      shipping: order.shipping || {
        method: 'Método não especificado',
        cost: 0,
        tracking_number: null
      },
      totals: order.totals || {
        subtotal: order.total_amount || 0,
        shipping: order.shipping?.cost || 0,
        total: order.total_amount || 0
      },
      items: (order.items || []).map(item => ({
        ...item,
        product_name: item.product_name || 'Produto sem nome',
        quantity: item.quantity || 1,
        unit_price: item.unit_price || 0,
        total_price: item.total_price || item.unit_price || 0,
        customizations: item.customizations || {}
      })),
      notes: order.notes || '',
      refund: order.refund || null,
      status: order.status || 'pending',
      created_at: order.created_at || new Date().toISOString(),
      updated_at: order.updated_at || order.created_at || new Date().toISOString()
    };
    
    return { data: normalizedOrder };
  },

  getCustomerOrders: async () => {
    await delay();
    const customer = JSON.parse(localStorage.getItem('pulgax-customer') || '{}');
    const orders = getStorageData('pulgax-orders');
    const customerOrders = orders.filter(o => o.customer_id === customer.id);
    return { data: customerOrders };
  },

  createOrder: async (orderData) => {
    await delay();
    const orders = getStorageData('pulgax-orders');
    const newOrder = {
      id: generateId(),
      order_number: 'ORD-' + Date.now(),
      ...orderData,
      status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    orders.push(newOrder);
    setStorageData('pulgax-orders', orders);
    return { data: newOrder };
  },

  updateOrderStatus: async (id, status, note = '') => {
    await delay();
    const orders = getStorageData('pulgax-orders');
    const index = orders.findIndex(o => o.id === id);
    if (index !== -1) {
      orders[index].status = status;
      orders[index].updated_at = new Date().toISOString();
      if (note) {
        orders[index].admin_note = note;
        // Add to status history if it doesn't exist
        if (!orders[index].status_history) {
          orders[index].status_history = [];
        }
        orders[index].status_history.push({
          status: status,
          note: note,
          updated_at: new Date().toISOString(),
          updated_by: 'admin@pulgax.com'
        });
      }
      setStorageData('pulgax-orders', orders);
      return { data: orders[index] };
    }
    throw new Error('Order not found');
  },

  processRefund: async (id, refundData) => {
    await delay();
    const orders = getStorageData('pulgax-orders');
    const index = orders.findIndex(o => o.id === id);
    if (index !== -1) {
      const order = orders[index];
      
      // Update order status to refunded
      order.status = 'refunded';
      order.updated_at = new Date().toISOString();
      
      // Add refund information
      order.refund = {
        amount: refundData.amount,
        reason: refundData.reason,
        method: refundData.method,
        processed_at: new Date().toISOString(),
        processed_by: 'admin@pulgax.com'
      };
      
      // Update payment status
      if (order.payment) {
        order.payment.status = 'refunded';
      }
      
      // Add to status history
      if (!order.status_history) {
        order.status_history = [];
      }
      order.status_history.push({
        status: 'refunded',
        note: `Reembolso processado: ${refundData.reason}`,
        updated_at: new Date().toISOString(),
        updated_by: 'admin@pulgax.com'
      });
      
      setStorageData('pulgax-orders', orders);
      return { data: order };
    }
    throw new Error('Order not found');
  },

  // Messages
  getMessages: async () => {
    await delay();
    const messages = getStorageData('pulgax-messages');
    return { data: messages };
  },

  createMessage: async (messageData) => {
    await delay();
    const messages = getStorageData('pulgax-messages');
    const newMessage = {
      id: generateId(),
      ...messageData,
      is_read: false,
      created_at: new Date().toISOString()
    };
    messages.push(newMessage);
    setStorageData('pulgax-messages', messages);
    return { data: newMessage };
  },

  markMessageRead: async (id) => {
    await delay();
    const messages = getStorageData('pulgax-messages');
    const index = messages.findIndex(m => m.id === id);
    if (index !== -1) {
      messages[index].is_read = true;
      setStorageData('pulgax-messages', messages);
      return { data: messages[index] };
    }
    throw new Error('Message not found');
  },

  deleteMessage: async (id) => {
    await delay();
    const messages = getStorageData('pulgax-messages');
    const filtered = messages.filter(m => m.id !== id);
    setStorageData('pulgax-messages', filtered);
    return { data: { success: true } };
  },

  // Stats
  getStats: async () => {
    await delay();
    const products = getStorageData('pulgax-products');
    const categories = getStorageData('pulgax-categories');
    const orders = getStorageData('pulgax-orders');
    const messages = getStorageData('pulgax-messages');

    return {
      data: {
        total_products: products.length,
        total_categories: categories.length,
        total_orders: orders.length,
        pending_orders: orders.filter(o => o.status === 'pending').length,
        total_messages: messages.length,
        unread_messages: messages.filter(m => !m.is_read).length
      }
    };
  },

  // Health check
  healthCheck: async () => {
    await delay();
    return { data: { status: 'ok', message: 'Local API is working' } };
  }
};

// Initialize data when module loads
localAPI.init();

export default localAPI;