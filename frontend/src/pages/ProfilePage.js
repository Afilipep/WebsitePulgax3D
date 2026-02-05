import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCustomerAuth } from '../context/CustomerAuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Layout } from '../components/layout/Layout';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Separator } from '../components/ui/separator';
import { toast } from 'sonner';
import api from '../api';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  ArrowLeft, 
  Save,
  Edit,
  Plus,
  Package,
  ShoppingBag,
  LogOut
} from 'lucide-react';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { customer, isCustomerAuthenticated, loginCustomer } = useCustomerAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      postal_code: '',
      country: 'Portugal'
    }
  });

  useEffect(() => {
    if (!isCustomerAuthenticated) {
      navigate('/login');
      return;
    }
    
    if (customer) {
      setProfileData({
        name: customer.name || '',
        email: customer.email || '',
        phone: customer.phone || '',
        address: customer.address || {
          street: '',
          city: '',
          postal_code: '',
          country: 'Portugal'
        }
      });
    }
  }, [customer, isCustomerAuthenticated, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setProfileData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value
        }
      }));
    } else {
      setProfileData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSaveProfile = async () => {
    setIsLoading(true);
    try {
      // Update address if provided
      if (profileData.address.street || profileData.address.city || profileData.address.postal_code) {
        await api.updateCustomerAddress(profileData.address);
      }
      
      // Refresh customer data
      const response = await api.getCustomerProfile();
      loginCustomer(response.data, customer.token || localStorage.getItem('pulgax-customer-token'));
      
      toast.success(t('profile.updateSuccess'));
      setIsEditing(false);
      setShowAddressForm(false);
    } catch (error) {
      toast.error(t('profile.updateError'));
      console.error('Profile update error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const hasAddress = profileData.address.street || profileData.address.city || profileData.address.postal_code;

  return (
    <Layout>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Link to="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  {t('common.back')}
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                  {t('profile.title')}
                </h1>
                <p className="text-slate-600 dark:text-slate-400">
                  {t('profile.subtitle')}
                </p>
              </div>
            </div>
            
            {!isEditing ? (
              <Button onClick={() => setIsEditing(true)} className="bg-blue-600 hover:bg-blue-700">
                <Edit className="w-4 h-4 mr-2" />
                {t('profile.editProfile')}
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button onClick={handleSaveProfile} disabled={isLoading} className="bg-green-600 hover:bg-green-700">
                  <Save className="w-4 h-4 mr-2" />
                  {isLoading ? t('profile.saving') : t('profile.saveProfile')}
                </Button>
                <Button variant="outline" onClick={() => {
                  setIsEditing(false);
                  setShowAddressForm(false);
                  // Reset form
                  if (customer) {
                    setProfileData({
                      name: customer.name || '',
                      email: customer.email || '',
                      phone: customer.phone || '',
                      address: customer.address || {
                        street: '',
                        city: '',
                        postal_code: '',
                        country: 'Portugal'
                      }
                    });
                  }
                }}>
                  {t('profile.cancel')}
                </Button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Profile Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Personal Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    {t('profile.personalInfo')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">{t('contact.form.name')} *</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input
                          id="name"
                          name="name"
                          value={profileData.name}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone">{t('contact.form.phone')}</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input
                          id="phone"
                          name="phone"
                          value={profileData.phone}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="pl-10"
                          placeholder="912 345 678"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">{t('contact.form.email')}</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={profileData.email}
                        disabled={true}
                        className="pl-10 bg-slate-100 dark:bg-slate-800"
                      />
                    </div>
                    <p className="text-xs text-slate-500">
                      {t('profile.emailNote')}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Address Information */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="w-5 h-5" />
                      {t('profile.shippingAddress')}
                    </CardTitle>
                    {!hasAddress && !showAddressForm && isEditing && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowAddressForm(true)}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        {t('profile.addAddress')}
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {!hasAddress && !showAddressForm ? (
                    <div className="text-center py-8">
                      <MapPin className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                      <p className="text-slate-600 dark:text-slate-400 mb-4">
                        {t('profile.noAddress')}
                      </p>
                      {isEditing && (
                        <Button
                          variant="outline"
                          onClick={() => setShowAddressForm(true)}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          {t('profile.addAddress')}
                        </Button>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="address.street">{t('address.street')}</Label>
                        <Input
                          id="address.street"
                          name="address.street"
                          value={profileData.address.street}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          placeholder="Rua das Flores, 123, 2º Esq"
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="address.city">{t('address.city')}</Label>
                          <Input
                            id="address.city"
                            name="address.city"
                            value={profileData.address.city}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            placeholder="Lisboa"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="address.postal_code">{t('address.postalCode')}</Label>
                          <Input
                            id="address.postal_code"
                            name="address.postal_code"
                            value={profileData.address.postal_code}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            placeholder="1000-001"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="address.country">{t('address.country')}</Label>
                        <Input
                          id="address.country"
                          name="address.country"
                          value={profileData.address.country}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>{t('profile.quickActions')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Link to="/my-orders" className="block">
                    <Button variant="outline" className="w-full justify-start">
                      <Package className="w-4 h-4 mr-2" />
                      {t('orders.title')}
                    </Button>
                  </Link>
                  
                  <Link to="/products" className="block">
                    <Button variant="outline" className="w-full justify-start">
                      <ShoppingBag className="w-4 h-4 mr-2" />
                      {t('profile.continueShopping')}
                    </Button>
                  </Link>
                  
                  <Separator />
                  
                  <Button 
                    variant="outline" 
                    className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50"
                    onClick={() => {
                      if (window.confirm(t('profile.logoutConfirm'))) {
                        // logout logic handled by navbar
                        navigate('/');
                      }
                    }}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    {t('profile.logout')}
                  </Button>
                </CardContent>
              </Card>

              {/* Account Info */}
              <Card>
                <CardHeader>
                  <CardTitle>{t('profile.accountInfo')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div>
                    <span className="text-slate-500">{t('profile.memberSince')}:</span>
                    <p className="font-medium">
                      {customer?.created_at ? 
                        new Date(customer.created_at).toLocaleDateString('pt-PT', {
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric'
                        }) : 
                        'N/A'
                      }
                    </p>
                  </div>
                  
                  <div>
                    <span className="text-slate-500">{t('profile.accountType')}:</span>
                    <p className="font-medium">
                      {customer?.google_id ? t('profile.googleAccount') : t('profile.localAccount')}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}