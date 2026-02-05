# Changelog

## v1.2.0 - 2024-02-04

### 🎯 Melhorias Recentes
- Removido código não utilizado e otimizado imports
- Corrigidos todos os erros de compilação e warnings
- Navegação por scroll melhorada com ScrollToTop component
- Logo personalizado implementado em toda a aplicação
- Sistema de API independente totalmente funcional

### 🔧 Correções Técnicas
- Removidas dependências desnecessárias do useLanguage em HomePage
- Corrigidos erros de sintaxe JSX
- Otimizada performance de navegação
- Melhorada compatibilidade entre frontend e backend

### 🚀 Estado Atual
- ✅ Frontend React totalmente funcional
- ✅ Backend FastAPI com armazenamento JSON
- ✅ Sistema de autenticação JWT implementado
- ✅ Painel administrativo completo
- ✅ API independente sem dependências externas
- ✅ Design limpo e profissional
- ✅ Navegação suave entre secções
- ✅ Formulário de contacto funcional

## v1.0.0 - 2024-02-04

### Funcionalidades Principais
- Loja online completa para impressão 3D
- Painel administrativo com gestão de produtos e categorias
- Sistema de autenticação JWT
- Suporte multi-idioma (PT/EN)
- Design responsivo com tema claro/escuro

### Tecnologias
- Frontend: React 18, Tailwind CSS, shadcn/ui
- Backend: FastAPI, armazenamento JSON
- Deployment: Docker

### Páginas
- Homepage com secções Hero, Sobre, Serviços, Processo, Contacto
- Catálogo de produtos com filtros
- Página de detalhes do produto
- Carrinho de compras
- Checkout
- Painel admin completo

### API Endpoints
- `POST /api/admin/register` - Registo de administrador
- `POST /api/admin/login` - Login de administrador
- `GET /api/categories` - Listar categorias
- `POST /api/categories` - Criar categoria
- `GET /api/products` - Listar produtos
- `POST /api/products` - Criar produto
- `GET /api/orders` - Listar encomendas
- `GET /api/contact` - Listar mensagens
- `POST /api/contact` - Enviar mensagem
- `GET /api/stats` - Estatísticas do dashboard

### Configuração
- Suporte para armazenamento JSON (sem base de dados externa)
- Variáveis de ambiente configuráveis
- CORS configurável para desenvolvimento
- Docker Compose para deployment
- Scripts de início automático (start.bat, start_simple.bat)