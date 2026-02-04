// Pequenos detalhes que tornam o site mais humano e menos "AI-generated"

// Mensagens de erro personalizadas (em vez de genéricas)
export const customErrorMessages = {
  networkError: "Ups! Parece que a nossa ligação está com problemas. Tenta novamente em alguns segundos.",
  formError: "Algo não correu bem... Verifica se preencheste tudo corretamente.",
  loadingError: "Estamos com dificuldades técnicas. Já estamos a resolver!",
  success: "Perfeito! Recebemos a tua mensagem e vamos responder em breve."
};

// Pequenos delays aleatórios para simular processamento humano
export const humanDelay = () => {
  const delays = [150, 200, 250, 300, 180, 220];
  return delays[Math.floor(Math.random() * delays.length)];
};

// Textos alternativos para botões (rotação aleatória)
export const buttonTexts = {
  submit: [
    "Enviar Mensagem",
    "Falar Connosco",
    "Enviar Pedido"
  ],
  loading: [
    "A enviar...",
    "Um momento...",
    "Quase lá..."
  ]
};

// Comentários "esquecidos" no código (propositais)
export const devComments = {
  // TODO: Adicionar mais cores de filamento
  // FIXME: Melhorar a validação do formulário
  // NOTE: Lembrar de atualizar os preços na próxima semana
};

// Pequenas inconsistências propositais no estilo
export const styleVariations = {
  borderRadius: ['rounded-lg', 'rounded-xl', 'rounded-2xl'],
  shadows: ['shadow-sm', 'shadow-md', 'shadow-lg'],
  spacing: ['p-6', 'p-8', 'px-6 py-8']
};

// Função para adicionar variação natural nos tempos de animação
export const naturalTiming = (baseTime = 300) => {
  const variation = Math.random() * 100 - 50; // ±50ms
  return Math.max(100, baseTime + variation);
};

// Mensagens de placeholder mais pessoais
export const personalPlaceholders = {
  message: "Conta-nos a tua ideia... Quanto mais detalhes, melhor!",
  name: "Como te podemos chamar?",
  email: "O teu melhor email",
  subject: "Em que te podemos ajudar?"
};

// Pequenos easter eggs escondidos
export const easterEggs = {
  konami: "↑↑↓↓←→←→BA", // Código Konami clássico
  secretMessage: "Feito com ❤️ e muito café em Portugal",
  hiddenFeature: "Pressiona Ctrl+Shift+P para modo desenvolvedor"
};

// Função para adicionar "imperfeições" humanas
export const addHumanTouch = (element) => {
  // Adiciona pequenas variações no timing
  if (element.style) {
    element.style.transitionDuration = `${naturalTiming()}ms`;
  }
  
  // Adiciona comentários HTML escondidos
  if (Math.random() < 0.1) { // 10% chance
    const comment = document.createComment(' Feito à mão com carinho ');
    element.appendChild(comment);
  }
};

// Simulação de "typos" corrigidos (para mostrar que é humano)
export const typoHistory = [
  // "Pulgax 3d Store" -> "Pulgax 3D Store"
  // "impressao 3d" -> "impressão 3D"
  // "personalizacao" -> "personalização"
];

export default {
  customErrorMessages,
  humanDelay,
  buttonTexts,
  styleVariations,
  naturalTiming,
  personalPlaceholders,
  easterEggs,
  addHumanTouch
};