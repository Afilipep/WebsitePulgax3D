# Configuração para Produção - Pulgax 3D Store

## 1. Google OAuth Setup

### Passo 1: Criar projeto no Google Cloud Console
1. Acesse [Google Cloud Console](https://console.cloud.google.com/)
2. Crie um novo projeto ou selecione um existente
3. Ative a Google Identity API

### Passo 2: Configurar OAuth 2.0
1. Vá para "APIs & Services" > "Credentials"
2. Clique em "Create Credentials" > "OAuth 2.0 Client IDs"
3. Selecione "Web application"
4. Adicione os domínios autorizados:
   - Para desenvolvimento: `http://localhost:3000`
   - Para produção: `https://seu-dominio.com`
5. Copie o Client ID gerado

### Passo 3: Configurar variáveis de ambiente
1. Copie `.env.example` para `.env`
2. Substitua `your-google-client-id-here` pelo Client ID real
3. Configure a URL do backend para produção

```bash
# Frontend (.env)
REACT_APP_BACKEND_URL=https://api.seu-dominio.com
REACT_APP_GOOGLE_CLIENT_ID=123456789-abc123.apps.googleusercontent.com
```

## 2. Backend Security

### Configurações de Segurança
1. **JWT Secret**: Altere a chave JWT no backend para uma chave segura de 64+ caracteres
2. **CORS**: Configure os domínios permitidos para produção
3. **HTTPS**: Use sempre HTTPS em produção
4. **Database**: Migre de JSON para PostgreSQL/MongoDB para produção

### Variáveis de Ambiente do Backend
```bash
# Backend
JWT_SECRET=sua-chave-jwt-super-segura-de-64-caracteres-ou-mais
GOOGLE_CLIENT_ID=123456789-abc123.apps.googleusercontent.com
DATABASE_URL=postgresql://user:pass@localhost/pulgax3d
FRONTEND_URL=https://seu-dominio.com
```

## 3. Pagamentos Seguros

### MB WAY
- Integração com API oficial MB WAY (SIBS)
- Validação de números de telefone
- Confirmação de pagamento em tempo real

### Cartões de Crédito
- Integração com Stripe, PayPal ou Easypay
- Tokenização de cartões (nunca armazenar dados completos)
- Compliance PCI DSS

### Exemplo de integração Stripe:
```javascript
// Frontend
import { loadStripe } from '@stripe/stripe-js';

const stripe = await loadStripe('pk_live_...');
const { error } = await stripe.redirectToCheckout({
  sessionId: 'cs_live_...'
});
```

## 4. Deployment

### Frontend (Netlify/Vercel)
```bash
npm run build
# Deploy pasta build/
```

### Backend (Railway/Heroku/DigitalOcean)
```bash
# Dockerfile já incluído
docker build -t pulgax3d-api .
docker run -p 8000:8000 pulgax3d-api
```

## 5. Monitorização

### Logs de Segurança
- Tentativas de login falhadas
- Transações de pagamento
- Alterações de dados sensíveis

### Backup
- Backup automático da base de dados
- Backup de imagens de produtos
- Backup de configurações

## 6. Compliance GDPR

### Dados Pessoais
- Consentimento explícito para recolha de dados
- Direito ao esquecimento (delete account)
- Portabilidade de dados
- Encriptação de dados sensíveis

### Cookies
- Banner de consentimento
- Política de privacidade
- Gestão de preferências

## 7. Performance

### CDN
- Imagens de produtos via CDN
- Cache de assets estáticos
- Compressão gzip/brotli

### Database
- Índices otimizados
- Connection pooling
- Query optimization

## 8. Testes

### Testes de Segurança
```bash
# Testes de penetração
npm run test:security

# Auditoria de dependências
npm audit
```

### Testes de Pagamento
- Testes com cartões de teste
- Simulação de falhas de pagamento
- Testes de reembolso

## 9. Contactos de Emergência

### Suporte Técnico
- Email: tech@pulgax3d.com
- Telefone: +351 XXX XXX XXX

### Fornecedores de Pagamento
- Stripe Support
- PayPal Business Support
- SIBS (MB WAY)