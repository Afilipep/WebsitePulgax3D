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
      badge: 'Impressão 3D Artesanal',
      title: 'Criamos o que imaginas em 3D',
      subtitle: 'Da ideia à realidade. Especializamo-nos em impressão 3D personalizada para decoração, utilitários e presentes únicos. Cada peça é criada com paixão e atenção ao detalhe.',
      cta: 'Ver Produtos',
      ctaSecondary: 'Falar Connosco',
    },
    // About
    about: {
      title: 'Paixão pela Impressão 3D',
      subtitle: 'A Nossa História',
      description: 'Começámos como um hobby e transformámos a nossa paixão pela tecnologia 3D num negócio. Cada peça que criamos é única, pensada especialmente para ti. Desde pequenos detalhes decorativos até utilitários do dia-a-dia, trabalhamos com materiais de qualidade e atenção ao pormenor.',
      values: {
        innovation: 'Inovação Constante',
        innovationDesc: 'Sempre a explorar novas técnicas e materiais para criar peças ainda melhores',
        quality: 'Qualidade Garantida',
        qualityDesc: 'Cada peça passa por controlo de qualidade rigoroso antes de chegar às tuas mãos',
        personalization: '100% Personalizado',
        personalizationDesc: 'Tens uma ideia? Nós tornamo-la realidade. Personalizações sem limites',
      },
    },
    // Services
    services: {
      title: 'Os Nossos Serviços',
      subtitle: 'O Que Fazemos',
      gifts: {
        title: 'Presentes Únicos',
        description: 'Cria presentes verdadeiramente especiais. Desde porta-chaves personalizados a decorações temáticas, cada presente conta uma história única.',
      },
      custom: {
        title: 'Peças Personalizadas',
        description: 'Tens uma ideia específica? Trabalhamos contigo desde o conceito até à peça final. Cores, tamanhos e detalhes completamente à tua medida.',
      },
      business: {
        title: 'Soluções para Empresas',
        description: 'Protótipos, peças promocionais ou soluções técnicas. Ajudamos empresas a materializar as suas ideias com rapidez e qualidade.',
      },
    },
    // Process
    process: {
      title: 'Do Conceito à Realidade',
      subtitle: 'Como Trabalhamos',
      steps: {
        step1: {
          title: 'Conversa Inicial',
          description: 'Falamos sobre a tua ideia, necessidades e preferências. Sem compromisso.',
        },
        step2: {
          title: 'Design & Orçamento',
          description: 'Criamos o design 3D e apresentamos um orçamento transparente e justo.',
        },
        step3: {
          title: 'Impressão 3D',
          description: 'Imprimimos a tua peça com materiais de qualidade e acabamentos perfeitos.',
        },
        step4: {
          title: 'Entrega Rápida',
          description: 'Enviamos ou entregamos a tua peça com todo o cuidado e rapidez.',
        },
      },
    },
    // Payment
    payment: {
      title: 'Paga Como Preferires',
      subtitle: 'Formas de Pagamento',
      mbway: 'MB WAY',
      transfer: 'Transferência',
      card: 'Cartão',
      vinted: 'Vinted',
    },
    // Contact
    contact: {
      title: 'Tens uma Ideia? Fala Connosco!',
      subtitle: 'Vamos Conversar',
      description: 'Estamos sempre disponíveis para ouvir as tuas ideias e ajudar-te a torná-las realidade. Seja um projeto simples ou complexo, adoramos novos desafios!',
      form: {
        name: 'Nome',
        email: 'Email',
        phone: 'Telemóvel',
        subject: 'Assunto',
        message: 'Mensagem',
        messagePlaceholder: 'Conta-nos a tua ideia... Quanto mais detalhes, melhor!',
        send: 'Enviar Mensagem',
        sending: 'A enviar...',
        success: 'Mensagem enviada! Vamos responder em breve 😊',
        error: 'Ups! Algo correu mal. Tenta novamente ou contacta-nos pelo Instagram.',
      },
      social: 'Segue-nos nas Redes Sociais',
    },
    // Products
    products: {
      title: 'Os Nossos Produtos',
      subtitle: 'Explore a nossa coleção',
      all: 'Todos',
      addToCart: 'Adicionar ao Carrinho',
      addedToCart: 'Adicionado ao carrinho!',
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
      emptyMessage: 'Adicione produtos ao seu carrinho para continuar',
      total: 'Total',
      checkout: 'Finalizar Compra',
      remove: 'Remover',
      continueShopping: 'Continuar a Comprar',
    },
    // Checkout
    checkout: {
      title: 'Finalizar Encomenda',
      shipping: 'Informações de Envio',
      payment: 'Pagamento',
      review: 'Revisão',
      placeOrder: 'Confirmar Encomenda',
      orderSummary: 'Resumo da Encomenda',
      orderConfirmation: 'Confirmação da Encomenda',
      orderComplete: 'Encomenda Confirmada!',
      orderNumber: 'Número da encomenda',
      orderEmailNote: 'Receberá um email de confirmação em breve com todos os detalhes da sua encomenda.',
      loginRequired: 'Para finalizar a sua encomenda, precisa de fazer login ou criar uma conta.',
      backToCart: 'Voltar ao Carrinho',
      processing: 'A processar...',
      confirmOrder: 'Confirmar Encomenda',
      success: 'Encomenda criada com sucesso!',
      error: 'Erro ao processar encomenda',
      steps: {
        personal: 'Dados Pessoais',
        shipping: 'Método de Envio',
        payment: 'Pagamento',
        confirmation: 'Confirmação'
      },
      shippingMethod: 'Método de Envio',
      deliverTo: 'Entregar em:',
      continueToPayment: 'Continuar para Pagamento',
      paymentMethod: 'Método de Pagamento',
      subtotal: 'Subtotal',
      total: 'Total',
      securePayment: 'Pagamento 100% seguro e encriptado',
      continueToConfirmation: 'Continuar para Confirmação',
      continueToShipping: 'Continuar para Método de Envio',
      secure: 'Seguro',
      mbwayNotification: 'Receberá uma notificação MB WAY para confirmar o pagamento de',
      cardDataSecure: 'Os seus dados de pagamento são encriptados e seguros',
      form: {
        name: 'Nome Completo',
        email: 'Email',
        phone: 'Telefone',
        address: 'Morada de Envio',
        notes: 'Notas (opcional)',
      },
    },
    // Footer
    footer: {
      rights: 'Todos os direitos reservados',
      followUs: 'Siga-nos',
    },
    // Address
    address: {
      mainAddress: 'Morada Principal',
      address: 'Morada',
      addAddress: 'Adicionar Nova Morada',
      editInDevelopment: 'Funcionalidade de edição em desenvolvimento',
      addSuccess: 'Morada adicionada com sucesso',
      addError: 'Erro ao salvar morada',
      street: 'Morada Completa',
      city: 'Cidade',
      postalCode: 'Código Postal',
      country: 'País',
      streetPlaceholder: 'Rua das Flores, 123, 2º Esq',
      cityPlaceholder: 'Lisboa',
      postalPlaceholder: '1000-001',
      savedAddresses: 'Moradas Guardadas',
      main: 'Principal',
      newAddress: 'Nova Morada',
      saveAddress: 'Guardar Morada',
      fillRequired: 'Por favor, preencha todos os campos obrigatórios',
      selectAddress: 'Por favor, selecione uma morada',
    },
    // Shipping
    shipping: {
      methods: {
        ctt_normal: {
          name: 'CTT Normal',
          description: 'Entrega em 3-5 dias úteis',
          estimatedDays: '3-5 dias'
        },
        ctt_expresso: {
          name: 'CTT Expresso',
          description: 'Entrega em 1-2 dias úteis',
          estimatedDays: '1-2 dias'
        },
        ctt_24h: {
          name: 'CTT 24h',
          description: 'Entrega no próximo dia útil',
          estimatedDays: '24h'
        },
        pickup: {
          name: 'Levantamento na Loja',
          description: 'Levantamento gratuito na nossa loja',
          estimatedDays: 'Imediato'
        }
      },
      pickupInfo: 'Informações de Levantamento:',
      pickupAddress: 'Morada:',
      pickupHours: 'Horário:',
      pickupContact: 'Contacto:',
      pickupNote: 'Entraremos em contacto quando a encomenda estiver pronta.',
      pickupSchedule: 'Segunda a Sexta, 9h-18h',
      pickupLocation: 'Rua da Inovação, 123, Lisboa',
      pickupPhone: '+351 912 345 678',
    },
    // Payment Methods
    paymentMethods: {
      mbway: {
        name: 'MB WAY',
        description: 'Pagamento instantâneo e seguro'
      },
      card: {
        name: 'Cartão de Crédito/Débito',
        description: 'Pagamento seguro com cartão'
      },
      transfer: {
        name: 'Transferência Bancária',
        description: 'Pagamento após receber dados bancários'
      }
    },
    paymentErrors: {
      mbwayPhone: 'Por favor, insira o número de telefone MB WAY',
      mbwayInvalid: 'Número de telefone MB WAY inválido',
      cardDetails: 'Por favor, preencha todos os dados do cartão',
      cardInvalid: 'Número de cartão inválido'
    },
    paymentLabels: {
      mbwayPhone: 'Número de Telefone MB WAY',
      cardName: 'Nome no Cartão',
      cardNumber: 'Número do Cartão',
      cardExpiry: 'Validade (MM/AA)',
      cardCvv: 'CVV',
      transferNote: 'Após confirmar a encomenda, receberá os dados bancários por email para efetuar a transferência de',
      orderProcessed: 'A encomenda será processada após confirmação do pagamento.'
    },
    // Orders (Customer)
    orders: {
      title: 'As Minhas Encomendas',
      loading: 'A carregar encomendas...',
      loadError: 'Erro ao carregar encomendas',
      backToOrders: 'Voltar às Encomendas',
      backToStore: 'Voltar à Loja',
      orderNumber: 'Encomenda #',
      createdAt: 'Criada em',
      orderStatus: 'Estado da Encomenda',
      noOrders: 'Nenhuma encomenda encontrada',
      noOrdersDesc: 'Ainda não fez nenhuma encomenda. Explore os nossos produtos!',
      viewProducts: 'Ver Produtos',
      viewDetails: 'Ver Detalhes',
      color: 'Cor',
      size: 'Tamanho',
      quantity: 'Quantidade',
      product: 'produto',
      products: 'produtos',
      payment: 'Pagamento',
      shippingInfo: 'Informações de Envio',
      paymentInfo: 'Informações de Pagamento',
      orderProducts: 'Produtos',
      address: 'Morada',
      trackingNumber: 'Número de Rastreio',
      method: 'Método',
      status: 'Estado',
      total: 'Total',
      paid: 'Pago',
      pending: 'Pendente',
      statuses: {
        pending: 'Pendente',
        confirmed: 'Confirmada',
        processing: 'Em Processamento',
        shipped: 'Enviada',
        delivered: 'Entregue',
        cancelled: 'Cancelada',
        refunded: 'Reembolsada',
      },
    },
    // Profile
    profile: {
      title: 'O Meu Perfil',
      subtitle: 'Gerir os seus dados pessoais e preferências',
      editProfile: 'Editar Perfil',
      saveProfile: 'Guardar',
      saving: 'A guardar...',
      cancel: 'Cancelar',
      personalInfo: 'Informações Pessoais',
      shippingAddress: 'Morada de Entrega',
      addAddress: 'Adicionar Morada',
      noAddress: 'Ainda não tem morada guardada',
      quickActions: 'Ações Rápidas',
      continueShopping: 'Continuar a Comprar',
      logout: 'Sair',
      logoutConfirm: 'Tem a certeza que quer sair?',
      accountInfo: 'Informações da Conta',
      memberSince: 'Membro desde',
      accountType: 'Tipo de conta',
      localAccount: 'Conta Local',
      googleAccount: 'Conta Google',
      emailNote: 'O email não pode ser alterado por razões de segurança',
      updateSuccess: 'Dados atualizados com sucesso!',
      updateError: 'Erro ao atualizar dados',
    },
    // Customer
    customer: {
      login: {
        title: 'Entrar na Conta',
        subtitle: 'Aceda à sua conta Pulgax 3D',
        email: 'Email',
        password: 'Palavra-passe',
        submit: 'Entrar',
        loading: 'A entrar...',
        success: 'Login realizado com sucesso!',
        error: 'Erro no login',
        noAccount: 'Não tem conta? Criar conta',
        backToStore: '← Voltar à loja'
      },
      register: {
        title: 'Criar Conta',
        subtitle: 'Junte-se à comunidade Pulgax 3D',
        name: 'Nome Completo',
        email: 'Email',
        phone: 'Telefone (opcional)',
        password: 'Palavra-passe',
        submit: 'Criar Conta',
        loading: 'A criar conta...',
        success: 'Conta criada com sucesso!',
        error: 'Erro ao criar conta',
        hasAccount: 'Já tem conta? Fazer login',
        addAddress: 'Adicionar morada (opcional - pode ser feito depois)',
        addressOptional: 'Adicionar morada (opcional - pode ser feito depois)'
      }
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
      from: 'De',
      free: 'Grátis',
    },
    // Admin
    admin: {
      login: {
        title: 'Admin Login',
        email: 'Email',
        password: 'Palavra-passe',
        submit: 'Entrar',
        success: 'Login com sucesso!',
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
        details: 'Detalhes',
        viewDetails: 'Ver Detalhes',
        updateStatus: 'Atualizar Estado',
        processRefund: 'Processar Reembolso',
        orderDetails: 'Detalhes da Encomenda',
        customerInfo: 'Dados do Cliente',
        paymentInfo: 'Informações de Pagamento',
        shippingInfo: 'Informações de Envio',
        orderItems: 'Produtos Encomendados',
        orderTotals: 'Totais da Encomenda',
        refundInfo: 'Informações do Reembolso',
        statusUpdate: 'Atualizar Estado da Encomenda',
        refundForm: 'Processar Reembolso',
        statuses: {
          pending: 'Pendente',
          confirmed: 'Confirmada',
          processing: 'Em Processamento',
          shipped: 'Enviada',
          delivered: 'Entregue',
          cancelled: 'Cancelada',
          refunded: 'Reembolsada',
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
      badge: 'Artisanal 3D Printing',
      title: 'We create what you imagine in 3D',
      subtitle: 'From idea to reality. We specialize in personalized 3D printing for decoration, utilities and unique gifts. Each piece is created with passion and attention to detail.',
      cta: 'View Products',
      ctaSecondary: 'Contact Us',
    },
    // About
    about: {
      title: 'Passion for 3D Printing',
      subtitle: 'Our Story',
      description: 'We started as a hobby and transformed our passion for 3D technology into a business. Each piece we create is unique, designed especially for you. From small decorative details to everyday utilities, we work with quality materials and attention to detail.',
      values: {
        innovation: 'Constant Innovation',
        innovationDesc: 'Always exploring new techniques and materials to create even better pieces',
        quality: 'Guaranteed Quality',
        qualityDesc: 'Each piece goes through rigorous quality control before reaching your hands',
        personalization: '100% Personalized',
        personalizationDesc: 'Have an idea? We make it reality. Unlimited customizations',
      },
    },
    // Services
    services: {
      title: 'Our Services',
      subtitle: 'What We Do',
      gifts: {
        title: 'Unique Gifts',
        description: 'Create truly special gifts. From personalized keychains to themed decorations, each gift tells a unique story.',
      },
      custom: {
        title: 'Custom Pieces',
        description: 'Have a specific idea? We work with you from concept to final piece. Colors, sizes and details completely tailored to you.',
      },
      business: {
        title: 'Business Solutions',
        description: 'Prototypes, promotional pieces or technical solutions. We help companies materialize their ideas with speed and quality.',
      },
    },
    // Process
    process: {
      title: 'From Concept to Reality',
      subtitle: 'How We Work',
      steps: {
        step1: {
          title: 'Initial Conversation',
          description: 'We talk about your idea, needs and preferences. No commitment.',
        },
        step2: {
          title: 'Design & Quote',
          description: 'We create the 3D design and present a transparent and fair quote.',
        },
        step3: {
          title: '3D Printing',
          description: 'We print your piece with quality materials and perfect finishes.',
        },
        step4: {
          title: 'Fast Delivery',
          description: 'We ship or deliver your piece with all care and speed.',
        },
      },
    },
    // Payment
    payment: {
      title: 'Pay As You Prefer',
      subtitle: 'Payment Methods',
      mbway: 'MB WAY',
      transfer: 'Bank Transfer',
      card: 'Card',
      vinted: 'Vinted',
    },
    // Contact
    contact: {
      title: 'Have an Idea? Talk to Us!',
      subtitle: 'Let\'s Talk',
      description: 'We are always available to hear your ideas and help you make them reality. Whether it\'s a simple or complex project, we love new challenges!',
      form: {
        name: 'Name',
        email: 'Email',
        phone: 'Phone',
        subject: 'Subject',
        message: 'Message',
        messagePlaceholder: 'Tell us your idea... The more details, the better!',
        send: 'Send Message',
        sending: 'Sending...',
        success: 'Message sent! We\'ll respond soon 😊',
        error: 'Oops! Something went wrong. Try again or contact us on Instagram.',
      },
      social: 'Follow us on Social Media',
    },
    // Products
    products: {
      title: 'Our Products',
      subtitle: 'Explore our collection',
      all: 'All',
      addToCart: 'Add to Cart',
      addedToCart: 'Added to cart!',
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
      emptyMessage: 'Add products to your cart to continue',
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
      orderSummary: 'Order Summary',
      orderConfirmation: 'Order Confirmation',
      orderComplete: 'Order Confirmed!',
      orderNumber: 'Order number',
      orderEmailNote: 'You will receive a confirmation email shortly with all your order details.',
      loginRequired: 'To complete your order, you need to login or create an account.',
      backToCart: 'Back to Cart',
      processing: 'Processing...',
      confirmOrder: 'Confirm Order',
      success: 'Order created successfully!',
      error: 'Error processing order',
      steps: {
        personal: 'Personal Data',
        shipping: 'Shipping Method',
        payment: 'Payment',
        confirmation: 'Confirmation'
      },
      shippingMethod: 'Shipping Method',
      deliverTo: 'Deliver to:',
      continueToPayment: 'Continue to Payment',
      paymentMethod: 'Payment Method',
      subtotal: 'Subtotal',
      total: 'Total',
      securePayment: '100% secure and encrypted payment',
      continueToConfirmation: 'Continue to Confirmation',
      continueToShipping: 'Continue to Shipping Method',
      secure: 'Secure',
      mbwayNotification: 'You will receive an MB WAY notification to confirm the payment of',
      cardDataSecure: 'Your payment data is encrypted and secure',
      form: {
        name: 'Full Name',
        email: 'Email',
        phone: 'Phone',
        address: 'Shipping Address',
        notes: 'Notes (optional)',
      },
    },
    // Footer
    footer: {
      rights: 'All rights reserved',
      followUs: 'Follow us',
    },
    // Address
    address: {
      mainAddress: 'Main Address',
      address: 'Address',
      addAddress: 'Add New Address',
      editInDevelopment: 'Edit functionality in development',
      addSuccess: 'Address added successfully',
      addError: 'Error saving address',
      street: 'Full Address',
      city: 'City',
      postalCode: 'Postal Code',
      country: 'Country',
      streetPlaceholder: 'Flower Street, 123, 2nd Left',
      cityPlaceholder: 'Lisbon',
      postalPlaceholder: '1000-001',
      savedAddresses: 'Saved Addresses',
      main: 'Main',
      newAddress: 'New Address',
      saveAddress: 'Save Address',
      fillRequired: 'Please fill in all required fields',
      selectAddress: 'Please select an address',
    },
    // Shipping
    shipping: {
      methods: {
        ctt_normal: {
          name: 'CTT Normal',
          description: 'Delivery in 3-5 business days',
          estimatedDays: '3-5 days'
        },
        ctt_expresso: {
          name: 'CTT Express',
          description: 'Delivery in 1-2 business days',
          estimatedDays: '1-2 days'
        },
        ctt_24h: {
          name: 'CTT 24h',
          description: 'Next business day delivery',
          estimatedDays: '24h'
        },
        pickup: {
          name: 'Store Pickup',
          description: 'Free pickup at our store',
          estimatedDays: 'Immediate'
        }
      },
      pickupInfo: 'Pickup Information:',
      pickupAddress: 'Address:',
      pickupHours: 'Hours:',
      pickupContact: 'Contact:',
      pickupNote: 'We will contact you when your order is ready for pickup.',
      pickupSchedule: 'Monday to Friday, 9am-6pm',
      pickupLocation: 'Innovation Street, 123, Lisbon',
      pickupPhone: '+351 912 345 678',
    },
    // Payment Methods
    paymentMethods: {
      mbway: {
        name: 'MB WAY',
        description: 'Instant and secure payment'
      },
      card: {
        name: 'Credit/Debit Card',
        description: 'Secure card payment'
      },
      transfer: {
        name: 'Bank Transfer',
        description: 'Payment after receiving bank details'
      }
    },
    paymentErrors: {
      mbwayPhone: 'Please enter your MB WAY phone number',
      mbwayInvalid: 'Invalid MB WAY phone number',
      cardDetails: 'Please fill in all card details',
      cardInvalid: 'Invalid card number'
    },
    paymentLabels: {
      mbwayPhone: 'MB WAY Phone Number',
      cardName: 'Name on Card',
      cardNumber: 'Card Number',
      cardExpiry: 'Expiry (MM/YY)',
      cardCvv: 'CVV',
      transferNote: 'After confirming your order, you will receive bank details by email to make the transfer of',
      orderProcessed: 'The order will be processed after payment confirmation.'
    },
    // Shipping
    shipping: {
      methods: {
        ctt_normal: {
          name: 'CTT Normal',
          description: 'Delivery in 3-5 business days',
          estimatedDays: '3-5 days'
        },
        ctt_expresso: {
          name: 'CTT Express',
          description: 'Delivery in 1-2 business days',
          estimatedDays: '1-2 days'
        },
        ctt_24h: {
          name: 'CTT 24h',
          description: 'Next business day delivery',
          estimatedDays: '24h'
        },
        pickup: {
          name: 'Store Pickup',
          description: 'Free pickup at our store',
          estimatedDays: 'Immediate'
        }
      },
      pickupInfo: 'Pickup Information:',
      pickupAddress: 'Address:',
      pickupHours: 'Hours:',
      pickupContact: 'Contact:',
      pickupNote: 'We will contact you when your order is ready for pickup.',
      pickupSchedule: 'Monday to Friday, 9am-6pm',
      pickupLocation: 'Innovation Street, 123, Lisbon',
      pickupPhone: '+351 912 345 678',
    },
    // Orders (Customer)
    orders: {
      title: 'My Orders',
      loading: 'Loading orders...',
      loadError: 'Error loading orders',
      backToOrders: 'Back to Orders',
      backToStore: 'Back to Store',
      orderNumber: 'Order #',
      createdAt: 'Created on',
      orderStatus: 'Order Status',
      noOrders: 'No orders found',
      noOrdersDesc: 'You haven\'t placed any orders yet. Explore our products!',
      viewProducts: 'View Products',
      viewDetails: 'View Details',
      color: 'Color',
      size: 'Size',
      quantity: 'Quantity',
      product: 'product',
      products: 'products',
      payment: 'Payment',
      shippingInfo: 'Shipping Information',
      paymentInfo: 'Payment Information',
      orderProducts: 'Products',
      address: 'Address',
      trackingNumber: 'Tracking Number',
      method: 'Method',
      status: 'Status',
      total: 'Total',
      paid: 'Paid',
      pending: 'Pending',
      statuses: {
        pending: 'Pending',
        confirmed: 'Confirmed',
        processing: 'Processing',
        shipped: 'Shipped',
        delivered: 'Delivered',
        cancelled: 'Cancelled',
        refunded: 'Refunded',
      },
    },
    // Profile
    profile: {
      title: 'My Profile',
      subtitle: 'Manage your personal data and preferences',
      editProfile: 'Edit Profile',
      saveProfile: 'Save',
      saving: 'Saving...',
      cancel: 'Cancel',
      personalInfo: 'Personal Information',
      shippingAddress: 'Shipping Address',
      addAddress: 'Add Address',
      noAddress: 'No address saved yet',
      quickActions: 'Quick Actions',
      continueShopping: 'Continue Shopping',
      logout: 'Logout',
      logoutConfirm: 'Are you sure you want to logout?',
      accountInfo: 'Account Information',
      memberSince: 'Member since',
      accountType: 'Account type',
      localAccount: 'Local Account',
      googleAccount: 'Google Account',
      emailNote: 'Email cannot be changed for security reasons',
      updateSuccess: 'Data updated successfully!',
      updateError: 'Error updating data',
    },
    // Customer
    customer: {
      login: {
        title: 'Login to Account',
        subtitle: 'Access your Pulgax 3D account',
        email: 'Email',
        password: 'Password',
        submit: 'Login',
        loading: 'Logging in...',
        success: 'Login successful!',
        error: 'Login error',
        noAccount: 'No account? Create account',
        backToStore: '← Back to store'
      },
      register: {
        title: 'Create Account',
        subtitle: 'Join the Pulgax 3D community',
        name: 'Full Name',
        email: 'Email',
        phone: 'Phone (optional)',
        password: 'Password',
        submit: 'Create Account',
        loading: 'Creating account...',
        success: 'Account created successfully!',
        error: 'Error creating account',
        hasAccount: 'Already have account? Login',
        addAddress: 'Add address (optional - can be done later)',
        addressOptional: 'Add address (optional - can be done later)'
      }
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
      free: 'Free',
    },
    // Admin
    admin: {
      login: {
        title: 'Admin Login',
        email: 'Email',
        password: 'Password',
        submit: 'Login',
        success: 'Logged in successfully!',
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
        details: 'Details',
        viewDetails: 'View Details',
        updateStatus: 'Update Status',
        processRefund: 'Process Refund',
        orderDetails: 'Order Details',
        customerInfo: 'Customer Information',
        paymentInfo: 'Payment Information',
        shippingInfo: 'Shipping Information',
        orderItems: 'Order Items',
        orderTotals: 'Order Totals',
        refundInfo: 'Refund Information',
        statusUpdate: 'Update Order Status',
        refundForm: 'Process Refund',
        statuses: {
          pending: 'Pending',
          confirmed: 'Confirmed',
          processing: 'Processing',
          shipped: 'Shipped',
          delivered: 'Delivered',
          cancelled: 'Cancelled',
          refunded: 'Refunded',
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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    localStorage.setItem('pulgax-language', language);
    // Small delay to ensure translations are loaded
    setTimeout(() => setIsLoading(false), 100);
  }, [language]);

  const t = (key) => {
    if (isLoading) return key; // Return key while loading
    
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
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t, isLoading }}>
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