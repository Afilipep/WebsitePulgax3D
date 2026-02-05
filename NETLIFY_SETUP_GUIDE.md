# 🚀 Guia de Configuração Netlify - Pulgax 3D Store Frontend

## ✅ Auditoria Completa Realizada

### 📋 Ficheiros Verificados e Status:

1. ✅ **frontend/src/api.js** - Usa `process.env.REACT_APP_BACKEND_URL` corretamente
2. ✅ **frontend/.env.example** - Atualizado com URL de produção
3. ✅ **frontend/.env.production.example** - Atualizado com URL de produção
4. ✅ **Nenhum fetch/axios direto** - Todas as chamadas passam por api.js
5. ✅ **Sem localhost hardcoded** - Tudo usa variáveis de ambiente

---

## 🔧 Configuração no Netlify

### 1. Build Settings

No Netlify Dashboard, configura:

```
Base directory: frontend
Build command: npm run build
Publish directory: frontend/build
```

### 2. Environment Variables (OBRIGATÓRIO)

Vai a: **Site Settings > Environment Variables** e adiciona:

```bash
# Backend API URL (OBRIGATÓRIO)
REACT_APP_BACKEND_URL=https://websitepulgax3d.onrender.com

# Google OAuth (OPCIONAL - se usares Google Login)
REACT_APP_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

**IMPORTANTE**: 
- ⚠️ Sem esta variável, o frontend vai tentar usar `http://localhost:8000` e falhar em produção
- ✅ Com esta variável, todas as chamadas API vão para o Render

### 3. Deploy Settings

```
Node version: 20 (já configurado em frontend/.nvmrc)
Package manager: npm (ou yarn se preferires)
```

---

## 📝 Como Funciona

### Estrutura de API Centralizada

O ficheiro `frontend/src/api.js` centraliza TODAS as chamadas ao backend:

```javascript
// frontend/src/api.js
const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';

const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}/api${endpoint}`;
  // ... resto do código
};
```

### Fluxo de Chamadas:

1. **Desenvolvimento Local**: 
   - `.env` tem `REACT_APP_BACKEND_URL=http://localhost:8000`
   - Frontend chama `http://localhost:8000/api/*`

2. **Produção (Netlify)**:
   - Netlify injeta `REACT_APP_BACKEND_URL=https://websitepulgax3d.onrender.com`
   - Frontend chama `https://websitepulgax3d.onrender.com/api/*`

---

## 🔍 Validação

### 1. Verificar Build no Netlify

Após deploy, verifica os logs:
- ✅ Build deve completar sem erros
- ✅ Deve criar a pasta `build/`
- ✅ Variáveis de ambiente devem aparecer nos logs (mascaradas)

### 2. Testar no Browser

Abre o site no Netlify e:

#### a) Abre DevTools (F12) > Console
Não deve haver erros de "Failed to fetch" ou "CORS"

#### b) Abre DevTools > Network
Filtra por "Fetch/XHR" e verifica:
- ✅ Todas as chamadas devem ir para `https://websitepulgax3d.onrender.com/api/*`
- ❌ Nenhuma chamada deve ir para `localhost`

#### c) Testa Funcionalidades
- Login de admin
- Visualização de produtos
- Criação de categorias
- Todas devem funcionar sem "Failed to fetch"

---

## 🐛 Troubleshooting

### Problema: "Failed to fetch" em produção

**Causa**: Variável de ambiente não configurada no Netlify

**Solução**:
1. Vai a Netlify Dashboard > Site Settings > Environment Variables
2. Adiciona: `REACT_APP_BACKEND_URL=https://websitepulgax3d.onrender.com`
3. Faz redeploy: Deploys > Trigger deploy > Clear cache and deploy site

### Problema: CORS errors

**Causa**: Backend não permite o domínio do Netlify

**Solução no Render**:
1. Vai ao Render Dashboard > Backend Service > Environment
2. Atualiza `CORS_ORIGINS` para incluir o domínio do Netlify:
   ```
   CORS_ORIGINS=https://your-site.netlify.app,https://www.your-domain.com
   ```
3. Redeploy do backend

### Problema: Chamadas ainda vão para localhost

**Causa**: Cache do browser ou build antigo

**Solução**:
1. No Netlify: Clear cache and redeploy
2. No browser: Hard refresh (Ctrl+Shift+R ou Cmd+Shift+R)
3. Verifica que a variável está configurada no Netlify

---

## 📊 Checklist Final

### Netlify Configuration:
- [ ] Base directory: `frontend`
- [ ] Build command: `npm run build`
- [ ] Publish directory: `frontend/build`
- [ ] Node version: 20 (via `.nvmrc`)
- [ ] Environment variable: `REACT_APP_BACKEND_URL=https://websitepulgax3d.onrender.com`

### Backend (Render) Configuration:
- [ ] `CORS_ORIGINS` inclui o domínio do Netlify
- [ ] Backend está a correr em `https://websitepulgax3d.onrender.com`
- [ ] Endpoint `/api/health` retorna status "healthy"

### Validação:
- [ ] Build do Netlify completa sem erros
- [ ] Site abre sem erros no console
- [ ] Network tab mostra chamadas para Render (não localhost)
- [ ] Login funciona
- [ ] Produtos carregam
- [ ] Admin panel funciona

---

## 🎯 Resumo da Solução

### O que foi feito:

1. ✅ **Auditoria completa** - Verificados todos os ficheiros do frontend
2. ✅ **API centralizada** - Todas as chamadas passam por `api.js`
3. ✅ **Variável de ambiente** - Usa `REACT_APP_BACKEND_URL`
4. ✅ **Sem localhost hardcoded** - Tudo configurável via env vars
5. ✅ **Documentação atualizada** - `.env.example` e `.env.production.example`

### O que NÃO precisas fazer:

- ❌ Não precisas modificar código do frontend
- ❌ Não precisas criar novos ficheiros
- ❌ Não precisas mudar a estrutura do projeto

### O que DEVES fazer no Netlify:

1. ✅ Configurar `REACT_APP_BACKEND_URL=https://websitepulgax3d.onrender.com`
2. ✅ Fazer deploy
3. ✅ Validar que funciona

---

## 💡 Dica Pro

Para testar localmente com o backend de produção:

```bash
# frontend/.env.local (criar este ficheiro)
REACT_APP_BACKEND_URL=https://websitepulgax3d.onrender.com
```

Depois:
```bash
cd frontend
npm start
```

O frontend local vai usar o backend de produção! 🚀

---

**Criado para**: Pulgax 3D Store  
**Data**: 2026-02-05  
**Status**: ✅ Pronto para produção
