import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { Layout } from '../components/layout/Layout';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { toast } from 'sonner';
import axios from 'axios';
import { 
  ArrowRight, 
  Gift, 
  Palette, 
  Building2, 
  MessageSquare,
  Layers,
  Printer,
  Truck,
  Smartphone,
  CreditCard,
  Banknote,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

// TODO: Adicionar mais opções de pagamento (PayPal, Multibanco)
// FIXME: Melhorar a responsividade em tablets
export default function HomePage() {
  const { t } = useLanguage();
  const location = useLocation();
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle hash navigation when component mounts or hash changes
  useEffect(() => {
    if (location.hash) {
      const elementId = location.hash.substring(1);
      setTimeout(() => {
        const element = document.getElementById(elementId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
    
    // Easter egg: Console message for curious developers
    console.log('🎯 Olá, desenvolvedor curioso! 👋');
    console.log('Este site foi feito com muito carinho para a Pulgax 3D Store.');
    console.log('Se estás a ver isto, provavelmente gostas de código tanto quanto nós! 😄');
    console.log('Contacta-nos se quiseres colaborar: @pulgaxstore');
  }, [location.hash]);

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await axios.post(`${API}/contact`, contactForm);
      toast.success('Mensagem enviada! Vamos responder em breve 😊');
      setContactForm({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (error) {
      // NOTE: Melhorar as mensagens de erro mais tarde
      toast.error('Ups! Algo correu mal. Tenta novamente ou contacta-nos pelo Instagram.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    setContactForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden" data-testid="hero-section">
        {/* Background */}
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1736667117808-d8e33a51cd7f?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Nzd8MHwxfHNlYXJjaHwxfHwzZCUyMHByaW50ZXIlMjBwcmludGluZyUyMGNsb3NlJTIwdXAlMjB0ZWNobm9sb2d5fGVufDB8fHx8MTc3MDEzNTY4MHww&ixlib=rb-4.1.0&q=85"
            alt="Impressora 3D em funcionamento"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-slate-900/80 to-slate-900/60" />
        </div>

        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600/20 rounded-full mb-6 animate-fade-in">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span className="text-blue-300 text-sm font-medium">Impressão 3D Artesanal</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight mb-6 animate-slide-up">
              Criamos o que imaginas em <span className="text-blue-400">3D</span>
            </h1>
            
            <p className="text-lg text-slate-300 mb-8 leading-relaxed animate-slide-up stagger-1">
              Da ideia à realidade. Especializamo-nos em impressão 3D personalizada para decoração, utilitários e presentes únicos. Cada peça é criada com paixão e atenção ao detalhe.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 animate-slide-up stagger-2">
              <Link to="/products">
                <Button 
                  size="lg" 
                  className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/30 group"
                  data-testid="hero-cta-products"
                >
                  Ver Produtos
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <a href="#contact">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-slate-500 text-white hover:bg-white/10"
                  data-testid="hero-cta-contact"
                >
                  Falar Connosco
                </Button>
              </a>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-2 bg-white/50 rounded-full" />
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 md:py-28 bg-slate-50 dark:bg-slate-900" data-testid="about-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Image */}
            <div className="relative">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden">
                <img 
                  src="https://inovasocial.com.br/wp-content/uploads/2023/08/inovacao-impressao-3d-impacto-inovasocial-inovacao-social-01-1200x675.jpg"
                  alt="Workshop"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Floating badge */}
              <div className="absolute -bottom-6 -right-6 bg-blue-600 text-white px-6 py-4 rounded-xl shadow-xl">
                <div className="text-2xl font-bold">+500</div>
                <div className="text-sm text-blue-200">Peças Criadas</div>
              </div>
            </div>

            {/* Content */}
            <div>
              <span className="text-blue-600 font-medium text-sm uppercase tracking-wider">
                A Nossa História
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mt-2 mb-6">
                Paixão pela Impressão 3D
              </h2>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-8">
                Começámos como um hobby e transformámos a nossa paixão pela tecnologia 3D num negócio. 
                Cada peça que criamos é única, pensada especialmente para ti. Desde pequenos detalhes decorativos 
                até utilitários do dia-a-dia, trabalhamos com materiais de qualidade e atenção ao pormenor.
              </p>

              {/* Values */}
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-white">
                      Inovação Constante
                    </h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Sempre a explorar novas técnicas e materiais para criar peças ainda melhores
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-white">
                      Qualidade Garantida
                    </h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Cada peça passa por controlo de qualidade rigoroso antes de chegar às tuas mãos
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Palette className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-white">
                      100% Personalizado
                    </h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Tens uma ideia? Nós tornamo-la realidade. Personalizações sem limites
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 md:py-28" data-testid="services-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-blue-600 font-medium text-sm uppercase tracking-wider">
              O Que Fazemos
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mt-2">
              Os Nossos Serviços
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="group bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-8 hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-slate-900/50 transition-shadow">
              <div className="w-14 h-14 bg-pink-100 dark:bg-pink-900/30 text-pink-600 rounded-xl flex items-center justify-center mb-6">
                <Gift className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                Presentes Únicos
              </h3>
              <p className="text-slate-500 dark:text-slate-400">
                Cria presentes verdadeiramente especiais. Desde porta-chaves personalizados a decorações temáticas, 
                cada presente conta uma história única.
              </p>
            </div>
            
            <div className="group bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-8 hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-slate-900/50 transition-shadow">
              <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-xl flex items-center justify-center mb-6">
                <Palette className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                Peças Personalizadas
              </h3>
              <p className="text-slate-500 dark:text-slate-400">
                Tens uma ideia específica? Trabalhamos contigo desde o conceito até à peça final. 
                Cores, tamanhos e detalhes completamente à tua medida.
              </p>
            </div>
            
            <div className="group bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-8 hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-slate-900/50 transition-shadow">
              <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-xl flex items-center justify-center mb-6">
                <Building2 className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                Soluções para Empresas
              </h3>
              <p className="text-slate-500 dark:text-slate-400">
                Protótipos, peças promocionais ou soluções técnicas. Ajudamos empresas a materializar 
                as suas ideias com rapidez e qualidade.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 md:py-28 bg-slate-900" data-testid="process-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-blue-400 font-medium text-sm uppercase tracking-wider">
              Como Trabalhamos
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mt-2">
              Do Conceito à Realidade
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="relative bg-slate-800 rounded-2xl p-6 group hover:bg-slate-700 transition-colors">
              <span className="absolute top-4 right-4 text-4xl font-bold text-slate-700 group-hover:text-slate-600 transition-colors">
                01
              </span>
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-4">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Conversa Inicial
              </h3>
              <p className="text-slate-400 text-sm">
                Falamos sobre a tua ideia, necessidades e preferências. Sem compromisso.
              </p>
            </div>
            
            <div className="relative bg-slate-800 rounded-2xl p-6 group hover:bg-slate-700 transition-colors">
              <span className="absolute top-4 right-4 text-4xl font-bold text-slate-700 group-hover:text-slate-600 transition-colors">
                02
              </span>
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-4">
                <Layers className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Design & Orçamento
              </h3>
              <p className="text-slate-400 text-sm">
                Criamos o design 3D e apresentamos um orçamento transparente e justo.
              </p>
            </div>
            
            <div className="relative bg-slate-800 rounded-2xl p-6 group hover:bg-slate-700 transition-colors">
              <span className="absolute top-4 right-4 text-4xl font-bold text-slate-700 group-hover:text-slate-600 transition-colors">
                03
              </span>
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-4">
                <Printer className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Impressão 3D
              </h3>
              <p className="text-slate-400 text-sm">
                Imprimimos a tua peça com materiais de qualidade e acabamentos perfeitos.
              </p>
            </div>
            
            <div className="relative bg-slate-800 rounded-2xl p-6 group hover:bg-slate-700 transition-colors">
              <span className="absolute top-4 right-4 text-4xl font-bold text-slate-700 group-hover:text-slate-600 transition-colors">
                04
              </span>
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-4">
                <Truck className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Entrega Rápida
              </h3>
              <p className="text-slate-400 text-sm">
                Enviamos ou entregamos a tua peça com todo o cuidado e rapidez.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Payment Methods */}
      <section className="py-20 md:py-28" data-testid="payment-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-blue-600 font-medium text-sm uppercase tracking-wider">
              Formas de Pagamento
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mt-2">
              Paga Como Preferires
            </h2>
          </div>

          <div className="flex flex-wrap justify-center gap-6">
            <div className="flex items-center gap-3 bg-slate-100 dark:bg-slate-800 px-6 py-4 rounded-xl">
              <Smartphone className="w-6 h-6 text-blue-600" />
              <span className="font-medium text-slate-900 dark:text-white">MB WAY</span>
            </div>
            <div className="flex items-center gap-3 bg-slate-100 dark:bg-slate-800 px-6 py-4 rounded-xl">
              <Banknote className="w-6 h-6 text-blue-600" />
              <span className="font-medium text-slate-900 dark:text-white">Transferência</span>
            </div>
            <div className="flex items-center gap-3 bg-slate-100 dark:bg-slate-800 px-6 py-4 rounded-xl">
              <CreditCard className="w-6 h-6 text-blue-600" />
              <span className="font-medium text-slate-900 dark:text-white">Vinted</span>
            </div>
          </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 md:py-28 bg-slate-50 dark:bg-slate-900" data-testid="contact-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Info */}
            <div>
              <span className="text-blue-600 font-medium text-sm uppercase tracking-wider">
                Vamos Conversar
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mt-2 mb-6">
                Tens uma Ideia? Fala Connosco!
              </h2>
              <p className="text-slate-600 dark:text-slate-400 mb-8">
                Estamos sempre disponíveis para ouvir as tuas ideias e ajudar-te a torná-las realidade. 
                Seja um projeto simples ou complexo, adoramos novos desafios!
              </p>

              {/* Social Links */}
              <div>
                <h4 className="font-semibold text-slate-900 dark:text-white mb-4">
                  Segue-nos nas Redes Sociais
                </h4>
                <div className="flex gap-4">
                  <a 
                    href="https://www.instagram.com/pulgaxstore/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white hover:scale-105 transition-transform"
                    data-testid="contact-instagram"
                  >
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </a>
                  <a 
                    href="https://www.tiktok.com/@pulgaxstore" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-slate-900 dark:bg-white dark:text-slate-900 rounded-xl flex items-center justify-center text-white hover:scale-105 transition-transform"
                    data-testid="contact-tiktok"
                  >
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50">
              <form onSubmit={handleContactSubmit} className="space-y-6" data-testid="contact-form">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome *</Label>
                    <Input
                      id="name"
                      name="name"
                      value={contactForm.name}
                      onChange={handleInputChange}
                      required
                      data-testid="contact-name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={contactForm.email}
                      onChange={handleInputChange}
                      required
                      data-testid="contact-email"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telemóvel</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={contactForm.phone}
                      onChange={handleInputChange}
                      data-testid="contact-phone"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">Assunto *</Label>
                    <Input
                      id="subject"
                      name="subject"
                      value={contactForm.subject}
                      onChange={handleInputChange}
                      required
                      data-testid="contact-subject"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Mensagem *</Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={contactForm.message}
                    onChange={handleInputChange}
                    rows={5}
                    required
                    placeholder="Conta-nos a tua ideia... Quanto mais detalhes, melhor!"
                    data-testid="contact-message"
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  disabled={isSubmitting}
                  data-testid="contact-submit"
                >
                  {isSubmitting ? 'A enviar...' : 'Enviar Mensagem'}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
