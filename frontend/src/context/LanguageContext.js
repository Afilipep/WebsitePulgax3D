import { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const translations = {
  pt: {
    // Navigation
    nav: {
      home: 'Início',
      products: 'Produtos',
      about: 'Sobre',
      contact: 'Contacto',
      cart: 'Carrinho',
      admin: 'Admin',
    },
    // Hero
    hero: {
      title: 'Impressão 3D Personalizada',
      subtitle: 'Transformamos as suas ideias em realidade. Produtos únicos, presentes personalizados e soluções empresariais.',
      cta: 'Ver Produtos',
      ctaSecondary: 'Contactar',
    },
    // About
    about: {
      title: 'Sobre Nós',
      subtitle: 'Quem é a Pulgax 3D Store',
      description: 'A Pulgax 3D Store é especializada em produtos impressos em 3D, incluindo artigos de presente, designs personalizados e soluções para particulares e empresas. Todos os produtos são fabricados com tecnologia de impressão 3D, com atenção ao detalhe e personalização.',
      values: {
        innovation: 'Inovação',
        innovationDesc: 'Utilizamos tecnologia de ponta em impressão 3D',
        quality: 'Qualidade',
        qualityDesc: 'Cada produto é fabricado com precisão',
        personalization: 'Personalização',
        personalizationDesc: 'Criamos exatamente o que você precisa',
      },
    },
    // Services
    services: {
      title: 'Os Nossos Serviços',
      subtitle: 'O que oferecemos',
      gifts: {
        title: 'Presentes Únicos',
        description: 'Artigos personalizados perfeitos para qualquer ocasião',
      },
      custom: {
        title: 'Designs Personalizados',
        description: 'Criamos produtos baseados nas suas ideias',
      },
      business: {
        title: 'Soluções Empresariais',
        description: 'Produtos personalizados para a sua empresa',
      },
    },
    // Process
    process: {
      title: 'Como Funciona',
      subtitle: 'Processo de Personalização',
      steps: {
        step1: {
          title: 'Contacte-nos',
          description: 'Partilhe a sua ideia connosco',
        },
        step2: {
          title: 'Design',
          description: 'Criamos o design 3D do seu produto',
        },
        step3: {
          title: 'Produção',
          description: 'Imprimimos o seu produto com qualidade',
        },
        step4: {
          title: 'Entrega',
          description: 'Receba o seu produto personalizado',
        },
      },
    },
    // Payment
    payment: {
      title: 'Métodos de Pagamento',
      subtitle: 'Formas de pagamento aceites',
      mbway: 'MB Way',
      transfer: 'Transferência Bancária',
      vinted: 'Vinted',
    },
    // Contact
    contact: {
      title: 'Contacte-nos',
      subtitle: 'Fale connosco',
      form: {
        name: 'Nome',
        email: 'Email',
        phone: 'Telefone',
        subject: 'Assunto',
        message: 'Mensagem',
        send: 'Enviar Mensagem',
        success: 'Mensagem enviada com sucesso!',
        error: 'Erro ao enviar mensagem. Tente novamente.',
      },
      social: 'Siga-nos nas redes sociais',
    },
    // Products
    products: {
      title: 'Os Nossos Produtos',
      subtitle: 'Explore a nossa coleção',
      all: 'Todos',
      addToCart: 'Adicionar ao Carrinho',
      viewDetails: 'Ver Detalhes',
      noProducts: 'Nenhum produto encontrado',
      featured: 'Destaques',
      price: 'Preço',
      color: 'Cor',
      size: 'Tamanho',
      customization: 'Personalização',
      quantity: 'Quantidade',
    },
    // Cart
    cart: {
      title: 'Carrinho de Compras',
      empty: 'O seu carrinho está vazio',
      total: 'Total',
      checkout: 'Finalizar Compra',
      remove: 'Remover',
      continueShopping: 'Continuar a Comprar',
    },
    // Checkout
    checkout: {
      title: 'Finalizar Compra',
      shipping: 'Informações de Envio',
      payment: 'Pagamento',
      review: 'Revisão',
      placeOrder: 'Confirmar Encomenda',
      form: {
        name: 'Nome Completo',
        email: 'Email',
        phone: 'Telefone',
        address: 'Morada de Envio',
        notes: 'Notas (opcional)',
      },
      success: 'Encomenda realizada com sucesso!',
      orderNumber: 'Número da encomenda',
    },
    // Footer
    footer: {
      rights: 'Todos os direitos reservados',
      followUs: 'Siga-nos',
    },
    // Common
    common: {
      loading: 'A carregar...',
      error: 'Erro',
      success: 'Sucesso',
      back: 'Voltar',
      save: 'Guardar',
      cancel: 'Cancelar',
      delete: 'Eliminar',
      edit: 'Editar',
      search: 'Pesquisar',
      filter: 'Filtrar',
      from: 'Desde',
    },
    // Admin
    admin: {
      login: {
        title: 'Admin Login',
        email: 'Email',
        password: 'Palavra-passe',
        submit: 'Entrar',
        error: 'Credenciais inválidas',
      },
      dashboard: {
        title: 'Painel de Administração',
        welcome: 'Bem-vindo',
        stats: 'Estatísticas',
        products: 'Produtos',
        categories: 'Categorias',
        orders: 'Encomendas',
        messages: 'Mensagens',
        pending: 'Pendentes',
        logout: 'Sair',
      },
      products: {
        add: 'Adicionar Produto',
        edit: 'Editar Produto',
        name: 'Nome',
        description: 'Descrição',
        price: 'Preço Base',
        category: 'Categoria',
        colors: 'Cores',
        sizes: 'Tamanhos',
        customizations: 'Personalizações',
        images: 'Imagens',
        featured: 'Destaque',
        active: 'Ativo',
      },
      categories: {
        add: 'Adicionar Categoria',
        edit: 'Editar Categoria',
        name: 'Nome',
        description: 'Descrição',
        image: 'Imagem',
      },
      orders: {
        number: 'Nº Encomenda',
        customer: 'Cliente',
        total: 'Total',
        status: 'Estado',
        date: 'Data',
        statuses: {
          pending: 'Pendente',
          confirmed: 'Confirmada',
          processing: 'Em Processamento',
          shipped: 'Enviada',
          delivered: 'Entregue',
          cancelled: 'Cancelada',
        },
      },
    },
  },
  en: {
    // Navigation
    nav: {
      home: 'Home',
      products: 'Products',
      about: 'About',
      contact: 'Contact',
      cart: 'Cart',
      admin: 'Admin',
    },
    // Hero
    hero: {
      title: 'Custom 3D Printing',
      subtitle: 'We turn your ideas into reality. Unique products, personalized gifts and business solutions.',
      cta: 'View Products',
      ctaSecondary: 'Contact Us',
    },
    // About
    about: {
      title: 'About Us',
      subtitle: 'Who is Pulgax 3D Store',
      description: 'Pulgax 3D Store specializes in 3D-printed products, including gift items, custom designs and solutions for individuals and companies. All products are manufactured with 3D printing technology, with attention to detail and customization.',
      values: {
        innovation: 'Innovation',
        innovationDesc: 'We use cutting-edge 3D printing technology',
        quality: 'Quality',
        qualityDesc: 'Every product is manufactured with precision',
        personalization: 'Personalization',
        personalizationDesc: 'We create exactly what you need',
      },
    },
    // Services
    services: {
      title: 'Our Services',
      subtitle: 'What we offer',
      gifts: {
        title: 'Unique Gifts',
        description: 'Personalized items perfect for any occasion',
      },
      custom: {
        title: 'Custom Designs',
        description: 'We create products based on your ideas',
      },
      business: {
        title: 'Business Solutions',
        description: 'Custom products for your company',
      },
    },
    // Process
    process: {
      title: 'How It Works',
      subtitle: 'Customization Process',
      steps: {
        step1: {
          title: 'Contact Us',
          description: 'Share your idea with us',
        },
        step2: {
          title: 'Design',
          description: 'We create the 3D design of your product',
        },
        step3: {
          title: 'Production',
          description: 'We print your product with quality',
        },
        step4: {
          title: 'Delivery',
          description: 'Receive your personalized product',
        },
      },
    },
    // Payment
    payment: {
      title: 'Payment Methods',
      subtitle: 'Accepted payment methods',
      mbway: 'MB Way',
      transfer: 'Bank Transfer',
      vinted: 'Vinted',
    },
    // Contact
    contact: {
      title: 'Contact Us',
      subtitle: 'Get in touch',
      form: {
        name: 'Name',
        email: 'Email',
        phone: 'Phone',
        subject: 'Subject',
        message: 'Message',
        send: 'Send Message',
        success: 'Message sent successfully!',
        error: 'Error sending message. Please try again.',
      },
      social: 'Follow us on social media',
    },
    // Products
    products: {
      title: 'Our Products',
      subtitle: 'Explore our collection',
      all: 'All',
      addToCart: 'Add to Cart',
      viewDetails: 'View Details',
      noProducts: 'No products found',
      featured: 'Featured',
      price: 'Price',
      color: 'Color',
      size: 'Size',
      customization: 'Customization',
      quantity: 'Quantity',
    },
    // Cart
    cart: {
      title: 'Shopping Cart',
      empty: 'Your cart is empty',
      total: 'Total',
      checkout: 'Checkout',
      remove: 'Remove',
      continueShopping: 'Continue Shopping',
    },
    // Checkout
    checkout: {
      title: 'Checkout',
      shipping: 'Shipping Information',
      payment: 'Payment',
      review: 'Review',
      placeOrder: 'Place Order',
      form: {
        name: 'Full Name',
        email: 'Email',
        phone: 'Phone',
        address: 'Shipping Address',
        notes: 'Notes (optional)',
      },
      success: 'Order placed successfully!',
      orderNumber: 'Order number',
    },
    // Footer
    footer: {
      rights: 'All rights reserved',
      followUs: 'Follow us',
    },
    // Common
    common: {
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      back: 'Back',
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      search: 'Search',
      filter: 'Filter',
      from: 'From',
    },
    // Admin
    admin: {
      login: {
        title: 'Admin Login',
        email: 'Email',
        password: 'Password',
        submit: 'Login',
        error: 'Invalid credentials',
      },
      dashboard: {
        title: 'Admin Dashboard',
        welcome: 'Welcome',
        stats: 'Statistics',
        products: 'Products',
        categories: 'Categories',
        orders: 'Orders',
        messages: 'Messages',
        pending: 'Pending',
        logout: 'Logout',
      },
      products: {
        add: 'Add Product',
        edit: 'Edit Product',
        name: 'Name',
        description: 'Description',
        price: 'Base Price',
        category: 'Category',
        colors: 'Colors',
        sizes: 'Sizes',
        customizations: 'Customizations',
        images: 'Images',
        featured: 'Featured',
        active: 'Active',
      },
      categories: {
        add: 'Add Category',
        edit: 'Edit Category',
        name: 'Name',
        description: 'Description',
        image: 'Image',
      },
      orders: {
        number: 'Order #',
        customer: 'Customer',
        total: 'Total',
        status: 'Status',
        date: 'Date',
        statuses: {
          pending: 'Pending',
          confirmed: 'Confirmed',
          processing: 'Processing',
          shipped: 'Shipped',
          delivered: 'Delivered',
          cancelled: 'Cancelled',
        },
      },
    },
  },
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem('pulgax-language');
    return saved || 'pt';
  });

  useEffect(() => {
    localStorage.setItem('pulgax-language', language);
  }, [language]);

  const t = (key) => {
    const keys = key.split('.');
    let value = translations[language];
    for (const k of keys) {
      value = value?.[k];
    }
    return value || key;
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'pt' ? 'en' : 'pt');
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
