import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { Layout } from '../components/layout/Layout';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { toast } from 'sonner';
import axios from 'axios';
import { 
  ChevronLeft,
  Smartphone,
  CreditCard,
  Banknote,
  CheckCircle2,
  Package
} from 'lucide-react';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { cart, cartTotal, clearCart } = useCart();
  
  const [form, setForm] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    shipping_address: '',
    notes: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('mbway');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');

  if (cart.length === 0 && !orderComplete) {
    navigate('/cart');
    return null;
  }

  const handleInputChange = (e) => {
    setForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const orderData = {
        ...form,
        payment_method: paymentMethod,
        total_amount: cartTotal,
        items: cart.map(item => ({
          product_id: item.product_id,
          quantity: item.quantity,
          selected_color: item.selected_color,
          selected_size: item.selected_size,
          customizations: item.customizations
        }))
      };

      const response = await axios.post(`${API}/orders`, orderData);
      setOrderNumber(response.data.order_number);
      setOrderComplete(true);
      clearCart();
      toast.success(t('checkout.success'));
    } catch (error) {
      toast.error(language === 'pt' ? 'Erro ao processar encomenda' : 'Error processing order');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (orderComplete) {
    return (
      <Layout>
        <div className="min-h-[70vh] flex items-center justify-center px-4" data-testid="order-success">
          <div className="text-center max-w-md">
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
              {t('checkout.success')}
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mb-2">
              {t('checkout.orderNumber')}:
            </p>
            <p className="text-xl font-mono font-bold text-blue-600 mb-8" data-testid="order-number">
              {orderNumber}
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">
              {language === 'pt' 
                ? 'Entraremos em contacto consigo em breve para confirmar a sua encomenda e os detalhes de pagamento.'
                : 'We will contact you soon to confirm your order and payment details.'
              }
            </p>
            <Link to="/">
              <Button className="bg-blue-600 hover:bg-blue-700" data-testid="back-home-btn">
                {t('nav.home')}
              </Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  const paymentMethods = [
    { id: 'mbway', label: t('payment.mbway'), icon: Smartphone },
    { id: 'transfer', label: t('payment.transfer'), icon: Banknote },
    { id: 'vinted', label: t('payment.vinted'), icon: CreditCard },
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900" data-testid="checkout-page">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Back */}
          <Link 
            to="/cart"
            className="inline-flex items-center text-slate-600 dark:text-slate-400 hover:text-blue-600 mb-8"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            {t('common.back')}
          </Link>

          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">
            {t('checkout.title')}
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-8" data-testid="checkout-form">
                {/* Shipping Info */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm">
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">
                    {t('checkout.shipping')}
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="customer_name">{t('checkout.form.name')} *</Label>
                      <Input
                        id="customer_name"
                        name="customer_name"
                        value={form.customer_name}
                        onChange={handleInputChange}
                        required
                        data-testid="checkout-name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="customer_email">{t('checkout.form.email')} *</Label>
                      <Input
                        id="customer_email"
                        name="customer_email"
                        type="email"
                        value={form.customer_email}
                        onChange={handleInputChange}
                        required
                        data-testid="checkout-email"
                      />
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="customer_phone">{t('checkout.form.phone')} *</Label>
                      <Input
                        id="customer_phone"
                        name="customer_phone"
                        value={form.customer_phone}
                        onChange={handleInputChange}
                        required
                        data-testid="checkout-phone"
                      />
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="shipping_address">{t('checkout.form.address')} *</Label>
                      <Textarea
                        id="shipping_address"
                        name="shipping_address"
                        value={form.shipping_address}
                        onChange={handleInputChange}
                        rows={3}
                        required
                        data-testid="checkout-address"
                      />
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="notes">{t('checkout.form.notes')}</Label>
                      <Textarea
                        id="notes"
                        name="notes"
                        value={form.notes}
                        onChange={handleInputChange}
                        rows={2}
                        data-testid="checkout-notes"
                      />
                    </div>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm">
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">
                    {t('checkout.payment')}
                  </h2>
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                    <div className="space-y-3">
                      {paymentMethods.map((method) => (
                        <label
                          key={method.id}
                          className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-colors ${
                            paymentMethod === method.id
                              ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                              : 'border-slate-200 dark:border-slate-700 hover:border-blue-300'
                          }`}
                          data-testid={`payment-${method.id}`}
                        >
                          <RadioGroupItem value={method.id} />
                          <method.icon className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                          <span className="font-medium text-slate-900 dark:text-white">
                            {method.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </RadioGroup>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 h-14 text-lg"
                  disabled={isSubmitting}
                  data-testid="place-order-btn"
                >
                  {isSubmitting ? t('common.loading') : t('checkout.placeOrder')}
                </Button>
              </form>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm sticky top-24">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">
                  {t('checkout.review')}
                </h2>
                
                <div className="space-y-4 mb-6">
                  {cart.map((item, index) => (
                    <div key={index} className="flex gap-3">
                      <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-lg overflow-hidden flex-shrink-0">
                        {item.image ? (
                          <img src={item.image} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="w-6 h-6 text-slate-400" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-slate-900 dark:text-white text-sm truncate">
                          {language === 'pt' ? item.name_pt : item.name_en}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {item.quantity}x €{(item.price + (item.size_price_adjustment || 0)).toFixed(2)}
                        </p>
                      </div>
                      <span className="font-medium text-slate-900 dark:text-white text-sm">
                        €{((item.price + (item.size_price_adjustment || 0)) * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {t('cart.total')}
                    </span>
                    <span className="text-xl font-bold text-slate-900 dark:text-white" data-testid="checkout-total">
                      €{cartTotal.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
