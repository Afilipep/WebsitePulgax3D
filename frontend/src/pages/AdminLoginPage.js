import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { Layout } from '../components/layout/Layout';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { toast } from 'sonner';
import { Lock, Database, AlertCircle } from 'lucide-react';
import api from '../api';

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { login, isAuthenticated } = useAuth();
  
  const [form, setForm] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [registerForm, setRegisterForm] = useState({ email: '', password: '', name: '' });
  const [apiStatus, setApiStatus] = useState('checking');

  // Check API connection on component mount
  useEffect(() => {
    const checkAPI = async () => {
      try {
        await api.healthCheck();
        setApiStatus('connected');
        console.log('✅ API connected successfully');
      } catch (error) {
        setApiStatus('error');
        console.error('❌ API connection failed:', error);
      }
    };
    
    checkAPI();
  }, []);

  // Redirect if already logged in
  if (isAuthenticated) {
    navigate('/admin/dashboard');
    return null;
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await api.adminLogin(form);
      login(response.data.admin, response.data.access_token);
      toast.success(language === 'pt' ? 'Login com sucesso!' : 'Logged in successfully!');
      navigate('/admin/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.detail || error.message || t('admin.login.error'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    console.log('Register attempt:', registerForm);
    
    try {
      const response = await api.adminRegister(registerForm);
      
      console.log('Registration response:', response.data);
      login(response.data.admin, response.data.access_token);
      toast.success(language === 'pt' ? 'Conta criada com sucesso!' : 'Account created successfully!');
      navigate('/admin/dashboard');
    } catch (error) {
      console.error('Registration error:', error);
      const message = error.response?.data?.detail || error.message || (language === 'pt' ? 'Erro ao criar conta' : 'Error creating account');
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout showFooter={false}>
      <div className="min-h-[80vh] flex items-center justify-center px-4" data-testid="admin-login-page">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl overflow-hidden mx-auto mb-4">
              <img 
                src="/logo.jpg" 
                alt="Pulgax 3D Logo" 
                className="w-full h-full object-cover"
              />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              {t('admin.login.title')}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2">
              Pulgax 3D Store
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8">
            {/* API Status */}
            <div className={`mb-6 p-4 rounded-lg border ${
              apiStatus === 'connected' 
                ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                : apiStatus === 'error'
                ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                {apiStatus === 'connected' ? (
                  <Database className="w-4 h-4 text-green-600" />
                ) : apiStatus === 'error' ? (
                  <AlertCircle className="w-4 h-4 text-red-600" />
                ) : (
                  <Database className="w-4 h-4 text-blue-600" />
                )}
                <span className={`text-sm font-medium ${
                  apiStatus === 'connected' 
                    ? 'text-green-800 dark:text-green-200'
                    : apiStatus === 'error'
                    ? 'text-red-800 dark:text-red-200'
                    : 'text-blue-800 dark:text-blue-200'
                }`}>
                  {apiStatus === 'connected' 
                    ? (language === 'pt' ? 'API Conectada' : 'API Connected')
                    : apiStatus === 'error'
                    ? (language === 'pt' ? 'Erro na API' : 'API Error')
                    : (language === 'pt' ? 'Verificando API...' : 'Checking API...')
                  }
                </span>
              </div>
              <p className={`text-xs ${
                apiStatus === 'connected' 
                  ? 'text-green-700 dark:text-green-300'
                  : apiStatus === 'error'
                  ? 'text-red-700 dark:text-red-300'
                  : 'text-blue-700 dark:text-blue-300'
              }`}>
                {apiStatus === 'connected' 
                  ? (language === 'pt' 
                    ? 'Conectado ao servidor FastAPI. Dados guardados na base de dados.'
                    : 'Connected to FastAPI server. Data saved to database.')
                  : apiStatus === 'error'
                  ? (language === 'pt' 
                    ? 'Não foi possível conectar ao servidor. Verifique se o backend está a correr.'
                    : 'Could not connect to server. Please check if backend is running.')
                  : (language === 'pt' 
                    ? 'A verificar disponibilidade da API...'
                    : 'Checking API availability...')
                }
              </p>
            </div>

            {!isRegister ? (
              <form onSubmit={handleLogin} className="space-y-6" data-testid="login-form">
                <div className="space-y-2">
                  <Label htmlFor="email">{t('admin.login.email')}</Label>
                  <Input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm(prev => ({ ...prev, email: e.target.value }))}
                    required
                    data-testid="login-email"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">{t('admin.login.password')}</Label>
                  <Input
                    id="password"
                    type="password"
                    value={form.password}
                    onChange={(e) => setForm(prev => ({ ...prev, password: e.target.value }))}
                    required
                    data-testid="login-password"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  disabled={isLoading}
                  data-testid="login-submit"
                >
                  <Lock className="w-4 h-4 mr-2" />
                  {isLoading ? t('common.loading') : t('admin.login.submit')}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleRegister} className="space-y-6" data-testid="register-form">
                <div className="space-y-2">
                  <Label htmlFor="reg-name">{language === 'pt' ? 'Nome' : 'Name'}</Label>
                  <Input
                    id="reg-name"
                    value={registerForm.name}
                    onChange={(e) => setRegisterForm(prev => ({ ...prev, name: e.target.value }))}
                    required
                    data-testid="register-name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-email">{t('admin.login.email')}</Label>
                  <Input
                    id="reg-email"
                    type="email"
                    value={registerForm.email}
                    onChange={(e) => setRegisterForm(prev => ({ ...prev, email: e.target.value }))}
                    required
                    data-testid="register-email"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-password">{t('admin.login.password')}</Label>
                  <Input
                    id="reg-password"
                    type="password"
                    value={registerForm.password}
                    onChange={(e) => setRegisterForm(prev => ({ ...prev, password: e.target.value }))}
                    required
                    data-testid="register-password"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  disabled={isLoading}
                  data-testid="register-submit"
                >
                  {isLoading ? t('common.loading') : (language === 'pt' ? 'Criar Conta' : 'Create Account')}
                </Button>
              </form>
            )}

            <div className="mt-6 text-center">
              <button
                onClick={() => setIsRegister(!isRegister)}
                className="text-sm text-blue-600 hover:underline"
                data-testid="toggle-auth-mode"
              >
                {isRegister 
                  ? (language === 'pt' ? 'Já tem conta? Fazer login' : 'Already have an account? Login')
                  : (language === 'pt' ? 'Primeira vez? Criar conta admin' : 'First time? Create admin account')
                }
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}