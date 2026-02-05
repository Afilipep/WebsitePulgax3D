# 🛠️ Guia do Administrador - Pulgax 3D

## 🔐 Acesso ao Painel Admin

### Credenciais de Login:
- **Email**: `admin@pulgax.com`
- **Password**: `admin123`

### Como Aceder:
1. Vá para: `http://localhost:3001/admin`
2. Introduza as credenciais acima
3. Clique em "Entrar"

---

## 📦 Como Atualizar Produtos

### 1. Aceder à Gestão de Produtos:
1. Faça login no painel admin
2. Clique em "Produtos" no menu lateral
3. Verá a lista de todos os produtos

### 2. Editar um Produto Existente:
1. Encontre o produto que quer editar
2. Clique no botão "Editar" (ícone de lápis)
3. O editor de produtos abrirá com uma interface amigável

### 3. Interface do Editor de Produtos:
- **Nome**: Nome do produto em PT e EN
- **Descrição**: Descrição detalhada em PT e EN
- **Preço Base**: Preço inicial do produto
- **Categoria**: Selecione a categoria apropriada
- **Cores**: Adicione/edite cores com:
  - Nome da cor
  - Código hexadecimal (#FFFFFF)
  - URL da imagem (opcional)
- **Tamanhos**: Adicione/edite tamanhos com:
  - Nome do tamanho
  - Dimensões
  - Modificador de preço (+€)
  - URL da imagem (opcional)
- **Personalizações**: Opções de personalização
- **Imagens**: URLs das imagens principais
- **Destaque**: Marcar como produto em destaque
- **Ativo**: Ativar/desativar produto

### 4. Funcionalidades Especiais:
- **Imagens por Cor/Tamanho**: Pode associar imagens específicas a cores e tamanhos
- **Preços Dinâmicos**: Tamanhos podem ter modificadores de preço
- **Pré-visualização**: Vê como o produto aparecerá na loja

### 5. Guardar Alterações:
1. Após fazer as alterações, clique em "Guardar"
2. O produto será atualizado imediatamente
3. As alterações aparecerão na loja instantaneamente

---

## 🎨 Gestão de Cores e Imagens

### Adicionar Nova Cor:
1. No editor de produtos, vá à secção "Cores"
2. Clique em "Adicionar Cor"
3. Preencha:
   - **Nome**: Nome da cor (ex: "Azul Oceano")
   - **Código Hex**: Código da cor (ex: "#3B82F6")
   - **Imagem**: URL da imagem do produto nesta cor (opcional)

### Adicionar Novo Tamanho:
1. No editor de produtos, vá à secção "Tamanhos"
2. Clique em "Adicionar Tamanho"
3. Preencha:
   - **Nome**: Nome do tamanho (ex: "Grande (15cm)")
   - **Dimensões**: Dimensões físicas (ex: "15x15x20cm")
   - **Modificador**: Preço adicional (ex: "+5" para +€5)
   - **Imagem**: URL da imagem do produto neste tamanho (opcional)

---

## 📊 Outras Funcionalidades Admin

### Gestão de Encomendas:
- Ver todas as encomendas
- Atualizar estado das encomendas
- Processar reembolsos
- Ver detalhes completos dos clientes

### Gestão de Categorias:
- Criar novas categorias
- Editar categorias existentes
- Associar produtos a categorias

### Mensagens de Contacto:
- Ver mensagens dos clientes
- Marcar como lidas
- Responder (via email manual)

### Estatísticas:
- Total de produtos
- Total de encomendas
- Encomendas pendentes
- Mensagens não lidas

---

## 🚀 Dicas Importantes

1. **Backup**: Sempre faça backup dos dados antes de grandes alterações
2. **Imagens**: Use URLs de imagens de alta qualidade
3. **Preços**: Verifique sempre os preços antes de guardar
4. **Traduções**: Mantenha sempre as versões PT e EN atualizadas
5. **Testes**: Teste os produtos na loja após alterações

---

## 🔧 Resolução de Problemas

### Se o login não funcionar:
1. Verifique se o backend está a correr (`http://localhost:8000`)
2. Confirme as credenciais: `admin@pulgax.com` / `admin123`
3. Limpe o cache do browser (Ctrl+F5)

### Se as alterações não aparecerem:
1. Recarregue a página da loja
2. Verifique se o produto está marcado como "Ativo"
3. Confirme se guardou as alterações

### Contacto para Suporte:
- Verifique os logs do backend para erros
- Consulte a documentação técnica em `GUIA_COMPLETO.md`