# Pulgax 3D Store

Loja online para impressão 3D personalizada em Portugal.

## Sobre

A Pulgax 3D Store é especializada em criar peças únicas através de impressão 3D. Desde decoração para casa até utilitários do dia-a-dia, cada peça é feita com atenção ao detalhe e qualidade.

## Funcionalidades

- Catálogo de produtos com categorias
- Sistema de encomendas
- Painel administrativo completo
- Suporte multi-idioma (PT/EN)
- Design responsivo
- Tema claro/escuro

## Tecnologias

- **Frontend**: React, Tailwind CSS
- **Backend**: FastAPI, MongoDB
- **Autenticação**: JWT
- **Deployment**: Docker

## Instalação

### Pré-requisitos
- Node.js 18+
- Python 3.8+
- MongoDB (opcional)

### Configuração

1. Clonar o repositório
```bash
git clone <url-do-repositorio>
cd pulgax3d-store
```

2. Frontend
```bash
cd frontend
npm install
npm start
```

3. Backend
```bash
cd backend
pip install -r requirements.txt
python server_simple.py
```

## Configuração

### Backend (.env)
```
MONGO_URL=mongodb://localhost:27017
DB_NAME=pulgax_3d_store
JWT_SECRET=sua-chave-secreta
CORS_ORIGINS=http://localhost:3000
```

### Frontend (.env)
```
REACT_APP_BACKEND_URL=http://localhost:8000
```

## Estrutura

```
pulgax3d-store/
├── frontend/          # Aplicação React
├── backend/           # API FastAPI
├── memory/           # Documentação
└── tests/            # Testes
```

## Deployment

O projeto está preparado para deployment com Docker. Ver ficheiros Dockerfile em cada diretório.

## Contacto

- Instagram: [@pulgaxstore](https://instagram.com/pulgaxstore)
- TikTok: [@pulgaxstore](https://tiktok.com/@pulgaxstore)
