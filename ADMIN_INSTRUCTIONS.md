# � Admin Panel - Integração com API Emergent

## ✅ **Sistema Configurado para Emergent!**

O sistema agora **detecta automaticamente** se está no ambiente Emergent e usa a API real quando disponível.

## � **Como Funciona:**

### **Detecção Automática:**
- ✅ **No Emergent**: Usa a API real (FastAPI + MongoDB)
- ✅ **Local**: Usa API local como fallback
- ✅ **Fallback inteligente**: Se API real falhar, usa local automaticamente

### **Indicador Visual:**
- 🟢 **"API Emergent Conectada"** - Usando API real
- 🔵 **"API Local Ativa"** - Usando API local
- 🟡 **"Verificando API..."** - A testar conexão

## 📋 **Como Usar:**

### **1. No Emergent (Produção):**
```
http://localhost:3000/admin
```
- ✅ **Detecção automática** da API real
- ✅ **Dados guardados** na base de dados MongoDB
- ✅ **Autenticação real** com JWT
- ✅ **Sem configuração** necessária

### **2. Localmente (Desenvolvimento):**
```
http://localhost:3000/admin
```
- ✅ **API local** como fallback
- ✅ **Dados no navegador** para testes
- ✅ **Funciona offline**

## 🎯 **Funcionalidades Integradas:**

| Funcionalidade | Emergent API | Local API |
|----------------|--------------|-----------|
| ✅ **Autenticação** | JWT real | JWT simulado |
| ✅ **Produtos CRUD** | MongoDB | localStorage |
| ✅ **Categorias CRUD** | MongoDB | localStorage |
| ✅ **Estatísticas** | Base de dados | Dados locais |
| ✅ **Mensagens** | MongoDB | localStorage |
| ✅ **Persistência** | Permanente | Sessão browser |

## 🔧 **Configuração Emergent:**

### **Variáveis de Ambiente:**
```env
REACT_APP_BACKEND_URL=http://localhost:8000
REACT_APP_USE_EMERGENT_API=true
```

### **API Endpoints Suportados:**
- `POST /api/admin/register` - Criar admin
- `POST /api/admin/login` - Login
- `GET /api/stats` - Estatísticas
- `GET /api/products/all` - Listar produtos
- `POST /api/products` - Criar produto
- `PUT /api/products/{id}` - Atualizar produto
- `DELETE /api/products/{id}` - Eliminar produto
- `GET /api/categories` - Listar categorias
- `POST /api/categories` - Criar categoria
- `PUT /api/categories/{id}` - Atualizar categoria
- `DELETE /api/categories/{id}` - Eliminar categoria

## 🚀 **Vantagens da Integração:**

### ✅ **Automática:**
- Detecta ambiente automaticamente
- Sem configuração manual necessária
- Fallback inteligente se API falhar

### ✅ **Flexível:**
- Funciona no Emergent e localmente
- Mesma interface para ambas APIs
- Transição transparente

### ✅ **Robusta:**
- Tratamento de erros
- Retry automático
- Logs detalhados

## 🎯 **Como Testar:**

### **No Emergent:**
1. **Aceder**: `http://localhost:3000/admin`
2. **Verificar**: Caixa verde "API Emergent Conectada"
3. **Criar conta**: Dados guardados na base de dados
4. **Testar CRUD**: Produtos e categorias persistem

### **Localmente:**
1. **Aceder**: `http://localhost:3000/admin`
2. **Verificar**: Caixa azul "API Local Ativa"
3. **Testar**: Funcionalidades completas offline

## 🎉 **Resultado:**

Agora tens um sistema que:
- ✅ **Funciona perfeitamente no Emergent** com a tua API real
- ✅ **Detecta automaticamente** o ambiente
- ✅ **Usa a API correta** sem configuração
- ✅ **Tem fallback local** para desenvolvimento
- ✅ **Interface única** para ambos os modos

**O sistema está pronto para o Emergent!** 🚀