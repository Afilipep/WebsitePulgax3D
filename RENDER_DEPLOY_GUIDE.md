# 🚀 Guia de Deploy no Render - Pulgax 3D Store Backend

## ✅ Solução Implementada: Docker com Python 3.12

Este guia usa **Docker** para garantir Python 3.12 e evitar problemas de compilação do pydantic-core no Python 3.13.

---

## 📋 Ficheiros Alterados

1. **backend/Dockerfile** - Atualizado para usar `$PORT` do Render
2. **backend/.dockerignore** - Criado para otimizar build
3. **backend/server.py** - Adicionado endpoint `/api/health`

---

## 🐳 Configuração no Render (Docker)

### 1. Criar Web Service no Render

1. Acede ao [Render Dashboard](https://dashboard.render.com/)
2. Clica em **"New +"** → **"Web Service"**
3. Conecta o teu repositório GitHub

### 2. Configurações do Service

```
Name: pulgax-3d-backend
Region: Frankfurt (ou a tua preferência)
Branch: main
Root Directory: backend
Runtime: Docker
```

### 3. Configurações de Build (Docker)

```
Dockerfile Path: backend/Dockerfile
Docker Command: (deixar vazio - usa o CMD do Dockerfile)
```

**IMPORTANTE**: O Render vai automaticamente:
- Fazer build da imagem Docker usando `backend/Dockerfile`
- Passar a variável `$PORT` para o container
- O Dockerfile usa: `CMD uvicorn server:app --host 0.0.0.0 --port ${PORT:-8000}`

### 4. Environment Variables (Variáveis de Ambiente)

Adiciona estas variáveis no Render Dashboard:

```bash
# MongoDB (OBRIGATÓRIO)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/pulgax_3d_store?retryWrites=true&w=majority

# CORS (OBRIGATÓRIO - adiciona o domínio do frontend)
CORS_ORIGINS=https://your-frontend-domain.netlify.app,http://localhost:3000

# JWT Secret (OBRIGATÓRIO - gera uma chave segura)
JWT_SECRET=sua-chave-jwt-super-segura-de-64-caracteres-ou-mais-para-producao

# Database Name (OPCIONAL - default: pulgax_3d_store)
DB_NAME=pulgax_3d_store
```

**Nota**: A variável `PORT` é automaticamente fornecida pelo Render, não precisas adicionar.

---

## 🔍 Validação do Deploy

### 1. Verificar Logs do Deploy

Após o deploy, verifica os logs no Render Dashboard:
- ✅ Build da imagem Docker deve completar sem erros
- ✅ Deve aparecer: `Application startup complete`
- ✅ Deve aparecer: `Uvicorn running on http://0.0.0.0:XXXX`

### 2. Testar Endpoints

Substitui `your-service.onrender.com` pelo URL do teu service:

#### a) Root Endpoint
```bash
curl https://your-service.onrender.com/api/
```

**Resposta esperada:**
```json
{
  "message": "Pulgax 3D Store API",
  "status": "running"
}
```

#### b) Health Check Endpoint
```bash
curl https://your-service.onrender.com/api/health
```

**Resposta esperada:**
```json
{
  "status": "healthy",
  "database": "connected",
  "message": "Pulgax 3D Store API is running"
}
```

#### c) API Documentation (Swagger)
Abre no browser:
```
https://your-service.onrender.com/docs
```

Deves ver a documentação interativa do FastAPI com todos os endpoints.

---

## 🔧 Troubleshooting

### Problema: Build falha com erro de pydantic-core
**Solução**: Verifica que o Render está a usar Docker (não Python runtime). O Dockerfile força Python 3.12.

### Problema: App não arranca ou erro de porta
**Solução**: O Dockerfile usa `${PORT:-8000}` que lê a variável `$PORT` do Render automaticamente.

### Problema: Erro de conexão à base de dados
**Solução**: 
1. Verifica que `MONGODB_URI` está correta no Render
2. Verifica que o MongoDB Atlas permite conexões do IP do Render (ou permite de qualquer IP: `0.0.0.0/0`)

### Problema: CORS errors no frontend
**Solução**: Adiciona o domínio do frontend em `CORS_ORIGINS`:
```
CORS_ORIGINS=https://your-frontend.netlify.app,https://www.your-domain.com
```

---

## 📝 Checklist Final

- [ ] Dockerfile usa `python:3.12-slim`
- [ ] Dockerfile usa `${PORT:-8000}` no CMD
- [ ] `.dockerignore` criado para otimizar build
- [ ] Render configurado com Root Directory: `backend`
- [ ] Render configurado com Runtime: Docker
- [ ] Variáveis de ambiente configuradas (MONGODB_URI, CORS_ORIGINS, JWT_SECRET)
- [ ] MongoDB Atlas permite conexões do Render
- [ ] `/api/` retorna status "running"
- [ ] `/api/health` retorna status "healthy"
- [ ] `/docs` abre a documentação Swagger

---

## 🎯 Próximos Passos

1. **Commit e Push**:
   ```bash
   git add backend/Dockerfile backend/.dockerignore backend/server.py
   git commit -m "Fix: Docker deployment with Python 3.12 for Render"
   git push origin main
   ```

2. **Deploy no Render**: O Render vai automaticamente fazer rebuild quando detectar o push.

3. **Testar**: Usa os comandos curl acima para validar.

4. **Configurar Frontend**: Atualiza a variável `REACT_APP_API_URL` no Netlify para apontar para o URL do Render.

---

## 💡 Vantagens desta Solução

✅ **Python 3.12 garantido** - Sem problemas de compilação do pydantic-core  
✅ **Sem dependências de Node.js** - Backend 100% Python  
✅ **Build rápido** - Docker usa cache de layers  
✅ **Porta dinâmica** - Usa `$PORT` do Render automaticamente  
✅ **Health check** - Endpoint `/api/health` para monitoring  
✅ **Documentação automática** - Swagger UI em `/docs`  

---

**Criado para**: Pulgax 3D Store  
**Data**: 2026-02-05  
**Solução**: Docker + Python 3.12 + FastAPI
