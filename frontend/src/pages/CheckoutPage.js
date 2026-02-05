import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { useCustomerAuth } from '../context/CustomerAuthContext';
import { Layout } from '../components/layout/Layout';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { toast } from 'sonner';
import api from '../api';
import CheckoutSteps from '../components/checkout/CheckoutSteps';
import AddressStep from '../components/checkout/AddressStep';
import ShippingStep from '../components/checkout/ShippingStep';
import PaymentStep from '../components/checkout/PaymentStep';
import { 
  ChevronLeft,
  CheckCircle2,
  Package,
  User
} from 'lucide-react';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { cart, cartTotal, clearCart } = useCart();
  const { customer, isCustomerAuthenticated } = useCustomerAuth();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selectedShipping, setSelectedShipping] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');

  const orderSummary = {
    subtotal: cartTotal,
    shipping: selectedShipping?.price || 0,
    total: cartTotal + (selectedShipping?.price || 0)
  };

  if (cart.length === 0 && !orderComplete) {
    navigate('/cart');
    return null;
  }

  const handleStepComplete = (step) => {
    setCompletedSteps(prev => [...prev, step]);
    setCurrentStep(step + 1);
  };

  const handleAddressSelect = (address) => {
    setSelectedAddress(address);
  };

  const handleShippingSelect = (shipping) => {
    setSelectedShipping(shipping);
  };

  const handlePaymentSelect = (payment) => {
    setSelectedPayment(payment);
  };

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);

    try {
      const orderData = {
        customer_name: customer?.name || 'Guest',
        customer_email: customer?.email || '',
        customer_phone: customer?.phone || '',
        shipping_address: `${selectedAddress.street}, ${selectedAddress.postal_code} ${selectedAddress.city}, ${selectedAddress.country}`,
        payment_method: selectedPayment.method,
        payment_details: selectedPayment.details,
        shipping_method: selectedShipping.id,
        shipping_cost: selectedShipping.price,
        total_amount: orderSummary.total,
        customer_id: customer?.id || null,
        notes: '',
        items: cart.map(item => ({
          product_id: item.product_id,
          quantity: item.quantity,
          selected_color: item.selected_color,
          selected_size: item.selected_size,
          customizations: item.customizations || {}
        }))
      };

      const response = await api.createOrder(orderData);
      setOrderNumber(response.data.order_number || response.data.id);
      setOrderComplete(true);
      clearCart();
      toast.success(t('checkout.success'));
      
      // Redirect to My Orders after a short delay
      setTimeout(() => {
        navigate('/my-orders');
      }, 3000);
    } catch (error) {
      console.error('Order creation error:', error);
      let errorMessage = t('checkout.error');
      
      // Show specific error message if available
      if (error.message && error.message.includes('Total amount mismatch')) {
        errorMessage = 'Erro no cálculo do total. Por favor, tente novamente.';
      } else if (error.message && error.message.includes('not found or inactive')) {
        errorMessage = 'Um dos produtos no carrinho não está mais disponível.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
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
              {t('checkout.orderComplete')}
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mb-2">
              {t('checkout.orderNumber')}:
            </p>
            <p className="text-xl font-mono font-bold text-blue-600 mb-8" data-testid="order-number">
              {orderNumber}
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">
              {t('checkout.orderEmailNote')}
            </p>
            <div className="space-y-3">
              <Link to="/my-orders">
                <Button className="w-full bg-blue-600 hover:bg-blue-700" data-testid="view-orders-btn">
                  Ver Minhas Encomendas
                </Button>
              </Link>
              <Link to="/">
                <Button variant="outline" className="w-full" data-testid="back-home-btn">
                  Voltar à Loja
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // Redirect to login if not authenticated
  if (!isCustomerAuthenticated) {
    return (
      <Layout>
        <div className="min-h-[70vh] flex items-center justify-center px-4">
          <Card className="max-w-md w-full">
            <CardContent className="p-8 text-center">
              <User className="w-16 h-16 text-blue-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                Login Necessário
              </h2>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                {t('checkout.loginRequired')}
              </p>
              <div className="space-y-3">
                <Link to="/login" className="block">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    Fazer Login / Registar
                  </Button>
                </Link>
                <Link to="/cart">
                  <Button variant="outline" className="w-full">
                    {t('checkout.backToCart')}
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

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
            {t('checkout.backToCart')}
          </Link>

          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">
            {t('checkout.title')}
          </h1>

          {/* Progress Steps */}
          <CheckoutSteps currentStep={currentStep} completedSteps={completedSteps} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {currentStep === 1 && (
                <AddressStep
                  customer={customer}
                  onNext={() => handleStepComplete(1)}
                  onAddressSelect={handleAddressSelect}
                />
              )}

              {currentStep === 2 && (
                <ShippingStep
                  selectedAddress={selectedAddress}
                  onNext={() => handleStepComplete(2)}
                  onShippingSelect={handleShippingSelect}
                />
              )}

              {currentStep === 3 && (
                <PaymentStep
                  orderSummary={orderSummary}
                  onNext={() => handleStepComplete(3)}
                  onPaymentSelect={handlePaymentSelect}
                />
              )}

              {currentStep === 4 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                    {t('checkout.orderConfirmation')}
                  </h2>
                  
                  {/* Order Summary */}
                  <div className="space-y-4">
                    <Card>
                      <CardContent className="p-4">
                        <h3 className="font-medium text-slate-900 dark:text-white mb-3">
                          Morada de Entrega
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {selectedAddress?.street}<br />
                          {selectedAddress?.postal_code} {selectedAddress?.city}
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <h3 className="font-medium text-slate-900 dark:text-white mb-3">
                          Método de Envio
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {selectedShipping?.name} - {selectedShipping?.price === 0 ? t('common.free') : `€${selectedShipping?.price.toFixed(2)}`}
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <h3 className="font-medium text-slate-900 dark:text-white mb-3">
                          Método de Pagamento
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {selectedPayment?.method === 'mbway' && 'MB WAY'}
                          {selectedPayment?.method === 'card' && 'Cartão de Crédito/Débito'}
                          {selectedPayment?.method === 'transfer' && 'Transferência Bancária'}
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  <Button
                    onClick={handleFinalSubmit}
                    disabled={isSubmitting}
                    className="w-full bg-green-600 hover:bg-green-700 h-14 text-lg"
                  >
                    {isSubmitting ? t('checkout.processing') : `${t('checkout.confirmOrder')} - €${orderSummary.total.toFixed(2)}`}
                  </Button>
                </div>
              )}
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">
                    {t('checkout.orderSummary')}
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

                  <div className="border-t border-slate-200 dark:border-slate-700 pt-4 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600 dark:text-slate-400">Subtotal:</span>
                      <span className="text-slate-900 dark:text-white">€{orderSummary.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600 dark:text-slate-400">Envio:</span>
                      <span className="text-slate-900 dark:text-white">
                        {orderSummary.shipping === 0 ? t('common.free') : `€${orderSummary.shipping.toFixed(2)}`}
                      </span>
                    </div>
                    <div className="flex items-center justify-between font-semibold text-lg pt-2 border-t border-slate-200 dark:border-slate-700">
                      <span className="text-slate-900 dark:text-white">Total:</span>
                      <span className="text-slate-900 dark:text-white" data-testid="checkout-total">
                        €{orderSummary.total.toFixed(2)}
                      </span>
                    </div>
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
