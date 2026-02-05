import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useCustomerAuth } from '../context/CustomerAuthContext';
import { Layout } from '../components/layout/Layout';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Separator } from '../components/ui/separator';
import { toast } from 'sonner';
import { User, Mail, Lock, Phone } from 'lucide-react';
import GoogleLoginButton from '../components/GoogleLoginButton';
import api from '../api';

export default function CustomerLoginPage() {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { loginCustomer, isCustomerAuthenticated } = useCustomerAuth();
  
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    phone: '',
    address: {
      street: '',
      city: '',
      postal_code: '',
      country: 'Portugal'
    }
  });
  const [showAddressForm, setShowAddressForm] = useState(false);

  // Redirect if already logged in
  if (isCustomerAuthenticated) {
    navigate('/');
    return null;
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      console.log('Attempting customer login with:', { email: loginForm.email });
      const response = await api.customerLogin(loginForm);
      console.log('Customer login response:', response);
      
      // Backend returns: { access_token, token_type, customer }
      loginCustomer(response.customer, response.access_token);
      toast.success(t('customer.login.success') || 'Login realizado com sucesso!');
      navigate('/');
    } catch (error) {
      console.error('Customer login error:', error);
      toast.error(error.message || t('customer.login.error') || 'Erro no login');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      console.log('Attempting customer registration with:', { email: registerForm.email, name: registerForm.name });
      const response = await api.customerRegister(registerForm);
      console.log('Customer register response:', response);
      
      // Backend returns: { access_token, token_type, customer }
      loginCustomer(response.customer, response.access_token);
      toast.success(t('customer.register.success') || 'Conta criada com sucesso!');
      navigate('/');
    } catch (error) {
      console.error('Customer register error:', error);
      toast.error(error.message || t('customer.register.error') || 'Erro ao criar conta');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl overflow-hidden bg-blue-600 flex items-center justify-center mx-auto mb-4">
              <img 
                src="/logo.jpg" 
                alt="Pulgax 3D Logo" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <User className="w-8 h-8 text-white" style={{ display: 'none' }} />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              {isLogin ? t('customer.login.title') : t('customer.register.title')}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2">
              {isLogin ? t('customer.login.subtitle') : t('customer.register.subtitle')}
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8">
            {/* Google Login Button */}
            <GoogleLoginButton />

            <div className="relative mb-6 mt-6">
              <Separator />
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-slate-800 px-2 text-sm text-slate-500">
                ou
              </span>
            </div>

            {isLogin ? (
              /* Login Form */
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">{t('customer.login.email')}</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      id="email"
                      type="email"
                      value={loginForm.email}
                      onChange={(e) => setLoginForm(prev => ({ ...prev, email: e.target.value }))}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">{t('customer.login.password')}</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      id="password"
                      type="password"
                      value={loginForm.password}
                      onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  disabled={isLoading}
                >
                  {isLoading ? t('customer.login.loading') : t('customer.login.submit')}
                </Button>
              </form>
            ) : (
              /* Register Form */
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">{t('customer.register.name')}</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      id="name"
                      value={registerForm.name}
                      onChange={(e) => setRegisterForm(prev => ({ ...prev, name: e.target.value }))}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-email">{t('customer.register.email')}</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      id="reg-email"
                      type="email"
                      value={registerForm.email}
                      onChange={(e) => setRegisterForm(prev => ({ ...prev, email: e.target.value }))}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">{t('customer.register.phone')}</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      id="phone"
                      value={registerForm.phone}
                      onChange={(e) => setRegisterForm(prev => ({ ...prev, phone: e.target.value }))}
                      className="pl-10"
                      placeholder="912 345 678"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-password">{t('customer.register.password')}</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      id="reg-password"
                      type="password"
                      value={registerForm.password}
                      onChange={(e) => setRegisterForm(prev => ({ ...prev, password: e.target.value }))}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                
                {/* Address Section (Optional) */}
                <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddressForm(!showAddressForm)}
                    className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 mb-4"
                  >
                    <span>{showAddressForm ? '▼' : '▶'}</span>
                    {t('customer.register.addressOptional')}
                  </button>
                  
                  {showAddressForm && (
                    <div className="space-y-4 bg-slate-50 dark:bg-slate-700 p-4 rounded-lg">
                      <div className="space-y-2">
                        <Label htmlFor="reg-street">{t('address.street')}</Label>
                        <Input
                          id="reg-street"
                          value={registerForm.address.street}
                          onChange={(e) => setRegisterForm(prev => ({ 
                            ...prev, 
                            address: { ...prev.address, street: e.target.value }
                          }))}
                          placeholder={t('address.streetPlaceholder')}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="reg-city">{t('address.city')}</Label>
                          <Input
                            id="reg-city"
                            value={registerForm.address.city}
                            onChange={(e) => setRegisterForm(prev => ({ 
                              ...prev, 
                              address: { ...prev.address, city: e.target.value }
                            }))}
                            placeholder={t('address.cityPlaceholder')}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="reg-postal">{t('address.postalCode')}</Label>
                          <Input
                            id="reg-postal"
                            value={registerForm.address.postal_code}
                            onChange={(e) => setRegisterForm(prev => ({ 
                              ...prev, 
                              address: { ...prev.address, postal_code: e.target.value }
                            }))}
                            placeholder={t('address.postalPlaceholder')}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  disabled={isLoading}
                >
                  {isLoading ? t('customer.register.loading') : t('customer.register.submit')}
                </Button>
              </form>
            )}

            <div className="mt-6 text-center">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm text-blue-600 hover:underline"
              >
                {isLogin 
                  ? t('customer.login.noAccount')
                  : t('customer.register.hasAccount')
                }
              </button>
            </div>

            <div className="mt-4 text-center">
              <Link
                to="/"
                className="text-sm text-slate-500 hover:text-slate-700"
              >
                {t('customer.login.backToStore')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}