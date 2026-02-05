import { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent } from '../ui/card';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { toast } from 'sonner';
import { CreditCard, Smartphone, Banknote, Shield, Lock } from 'lucide-react';

const PaymentStep = ({ onNext, onPaymentSelect, orderSummary }) => {
  const { t } = useLanguage();
  const [selectedPayment, setSelectedPayment] = useState('mbway');
  const [paymentDetails, setPaymentDetails] = useState({
    mbway_phone: '',
    card_number: '',
    card_expiry: '',
    card_cvv: '',
    card_name: ''
  });

  const paymentMethods = [
    { 
      id: 'mbway', 
      name: t('paymentMethods.mbway.name'), 
      icon: Smartphone, 
      secure: true,
      description: t('paymentMethods.mbway.description')
    },
    { 
      id: 'card', 
      name: t('paymentMethods.card.name'), 
      icon: CreditCard, 
      secure: true,
      description: t('paymentMethods.card.description')
    },
    { 
      id: 'transfer', 
      name: t('paymentMethods.transfer.name'), 
      icon: Banknote, 
      secure: false,
      description: t('paymentMethods.transfer.description')
    },
  ];

  const handlePaymentDetailsChange = (e) => {
    setPaymentDetails(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const validatePaymentDetails = () => {
    if (selectedPayment === 'mbway') {
      if (!paymentDetails.mbway_phone) {
        toast.error(t('paymentErrors.mbwayPhone'));
        return false;
      }
      if (!/^9[1236]\d{7}$/.test(paymentDetails.mbway_phone.replace(/\s/g, ''))) {
        toast.error(t('paymentErrors.mbwayInvalid'));
        return false;
      }
    } else if (selectedPayment === 'card') {
      if (!paymentDetails.card_number || !paymentDetails.card_expiry || !paymentDetails.card_cvv || !paymentDetails.card_name) {
        toast.error(t('paymentErrors.cardDetails'));
        return false;
      }
      if (paymentDetails.card_number.replace(/\s/g, '').length < 13) {
        toast.error(t('paymentErrors.cardInvalid'));
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (!validatePaymentDetails()) {
      return;
    }

    const payment = {
      method: selectedPayment,
      details: paymentDetails
    };
    
    onPaymentSelect(payment);
    onNext();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <CreditCard className="w-5 h-5 text-blue-600" />
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
          {t('checkout.paymentMethod')}
        </h2>
      </div>

      {/* Order Summary */}
      <Card className="bg-slate-50 dark:bg-slate-800">
        <CardContent className="p-4">
          <h3 className="font-medium text-slate-900 dark:text-white mb-3">
            {t('checkout.orderSummary')}
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-600 dark:text-slate-400">{t('checkout.subtotal')}:</span>
              <span className="text-slate-900 dark:text-white">€{orderSummary.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600 dark:text-slate-400">{t('checkout.shipping')}:</span>
              <span className="text-slate-900 dark:text-white">
                {orderSummary.shipping === 0 ? t('common.free') : `€${orderSummary.shipping.toFixed(2)}`}
              </span>
            </div>
            <div className="border-t border-slate-200 dark:border-slate-700 pt-2 flex justify-between font-semibold">
              <span className="text-slate-900 dark:text-white">{t('checkout.total')}:</span>
              <span className="text-slate-900 dark:text-white">€{orderSummary.total.toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Methods */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-green-600" />
          <span className="text-sm text-slate-600 dark:text-slate-400">
            {t('checkout.securePayment')}
          </span>
        </div>

        <RadioGroup value={selectedPayment} onValueChange={setSelectedPayment}>
          <div className="space-y-3">
            {paymentMethods.map((method) => (
              <Card key={method.id} className={`cursor-pointer transition-colors ${
                selectedPayment === method.id ? 'ring-2 ring-blue-600' : ''
              }`}>
                <CardContent className="p-4">
                  <label className="flex items-center gap-4 cursor-pointer">
                    <RadioGroupItem value={method.id} />
                    <method.icon className="w-6 h-6 text-slate-600 dark:text-slate-400" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-slate-900 dark:text-white">
                          {method.name}
                        </h3>
                        {method.secure && (
                          <div className="flex items-center gap-1">
                            <Lock className="w-3 h-3 text-green-600" />
                            <span className="text-xs text-green-600">{t('checkout.secure')}</span>
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {method.description}
                      </p>
                    </div>
                  </label>
                </CardContent>
              </Card>
            ))}
          </div>
        </RadioGroup>
      </div>

      {/* Payment Details Forms */}
      {selectedPayment === 'mbway' && (
        <Card>
          <CardContent className="p-4">
            <div className="space-y-4">
              <Label htmlFor="mbway_phone">{t('paymentLabels.mbwayPhone')} *</Label>
              <Input
                id="mbway_phone"
                name="mbway_phone"
                value={paymentDetails.mbway_phone}
                onChange={handlePaymentDetailsChange}
                placeholder="912 345 678"
                required
              />
              <p className="text-xs text-slate-500">
                {t('checkout.mbwayNotification')} €{orderSummary.total.toFixed(2)}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {selectedPayment === 'card' && (
        <Card>
          <CardContent className="p-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="card_name">{t('paymentLabels.cardName')} *</Label>
                <Input
                  id="card_name"
                  name="card_name"
                  value={paymentDetails.card_name}
                  onChange={handlePaymentDetailsChange}
                  placeholder="João Silva"
                  required
                />
              </div>
              <div>
                <Label htmlFor="card_number">{t('paymentLabels.cardNumber')} *</Label>
                <Input
                  id="card_number"
                  name="card_number"
                  value={paymentDetails.card_number}
                  onChange={handlePaymentDetailsChange}
                  placeholder="1234 5678 9012 3456"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="card_expiry">{t('paymentLabels.cardExpiry')} *</Label>
                  <Input
                    id="card_expiry"
                    name="card_expiry"
                    value={paymentDetails.card_expiry}
                    onChange={handlePaymentDetailsChange}
                    placeholder="MM/AA"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="card_cvv">{t('paymentLabels.cardCvv')} *</Label>
                  <Input
                    id="card_cvv"
                    name="card_cvv"
                    value={paymentDetails.card_cvv}
                    onChange={handlePaymentDetailsChange}
                    placeholder="123"
                    required
                  />
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Lock className="w-3 h-3" />
                <span>{t('checkout.cardDataSecure')}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {selectedPayment === 'transfer' && (
        <Card className="bg-amber-50 dark:bg-amber-900/20 border-amber-200">
          <CardContent className="p-4">
            <p className="text-sm text-amber-800 dark:text-amber-200">
              {t('paymentLabels.transferNote')} €{orderSummary.total.toFixed(2)}.
              {t('paymentLabels.orderProcessed')}
            </p>
          </CardContent>
        </Card>
      )}

      <Button onClick={handleNext} className="w-full bg-blue-600 hover:bg-blue-700">
        {t('checkout.continueToConfirmation')}
      </Button>
    </div>
  );
};

export default PaymentStep;