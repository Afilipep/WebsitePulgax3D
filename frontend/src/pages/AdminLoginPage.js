import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { Layout } from '../components/layout/Layout';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { toast } from 'sonner';
import { Lock, Printer } from 'lucide-react';
import api from '../api';

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { login, isAuthenticated } = useAuth();
  
  const [form, setForm] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [registerForm, setRegisterForm] = useState({ email: '', password: '', name: '' });

  // Redirect if already logged in
  if (isAuthenticated) {
    navigate('/admin/dashboard');
    return null;
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      console.log('Attempting admin login with:', { email: form.email });
      const response = await api.adminLogin(form);
      console.log('Admin login response:', response);
      
      // Backend returns: { access_token, token_type, admin }
      login(response.admin, response.access_token);
      toast.success(t('admin.login.success') || 'Login realizado com sucesso!');
      navigate('/admin/dashboard');
    } catch (error) {
      console.error('Admin login error:', error);
      toast.error(error.message || t('admin.login.error') || 'Erro no login');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      console.log('Attempting admin registration with:', { email: registerForm.email, name: registerForm.name });
      const response = await api.adminRegister(registerForm);
      console.log('Admin register response:', response);
      
      // Backend returns: { access_token, token_type, admin }
      login(response.admin, response.access_token);
      toast.success(language === 'pt' ? 'Conta criada com sucesso!' : 'Account created successfully!');
      navigate('/admin/dashboard');
    } catch (error) {
      console.error('Admin register error:', error);
      const message = error.message || (language === 'pt' ? 'Erro ao criar conta' : 'Error creating account');
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
            <div className="w-16 h-16 rounded-2xl overflow-hidden mx-auto mb-4 bg-blue-600 flex items-center justify-center">
              <img 
                src="/logo.jpg" 
                alt="Pulgax 3D Logo" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <Printer className="w-8 h-8 text-white" style={{ display: 'none' }} />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              {t('admin.login.title')}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2">
              Pulgax 3D Store
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8">
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