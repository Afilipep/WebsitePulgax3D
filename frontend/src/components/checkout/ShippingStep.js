import { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Package, Truck, Clock, MapPin } from 'lucide-react';

const ShippingStep = ({ onNext, onShippingSelect, selectedAddress }) => {
  const { t } = useLanguage();
  const [selectedShipping, setSelectedShipping] = useState('ctt_normal');

  const shippingMethods = [
    {
      id: 'ctt_normal',
      name: t('shipping.methods.ctt_normal.name'),
      description: t('shipping.methods.ctt_normal.description'),
      price: 3.99,
      icon: Package,
      estimatedDays: t('shipping.methods.ctt_normal.estimatedDays')
    },
    {
      id: 'ctt_expresso',
      name: t('shipping.methods.ctt_expresso.name'),
      description: t('shipping.methods.ctt_expresso.description'),
      price: 5.99,
      icon: Truck,
      estimatedDays: t('shipping.methods.ctt_expresso.estimatedDays')
    },
    {
      id: 'ctt_24h',
      name: t('shipping.methods.ctt_24h.name'),
      description: t('shipping.methods.ctt_24h.description'),
      price: 8.99,
      icon: Clock,
      estimatedDays: t('shipping.methods.ctt_24h.estimatedDays')
    },
    {
      id: 'pickup',
      name: t('shipping.methods.pickup.name'),
      description: t('shipping.methods.pickup.description'),
      price: 0,
      icon: MapPin,
      estimatedDays: t('shipping.methods.pickup.estimatedDays')
    }
  ];

  const handleNext = () => {
    const shipping = shippingMethods.find(method => method.id === selectedShipping);
    onShippingSelect(shipping);
    onNext();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Package className="w-5 h-5 text-blue-600" />
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
          {t('checkout.shippingMethod')}
        </h2>
      </div>

      {/* Selected Address Summary */}
      {selectedAddress && (
        <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <p className="font-medium text-blue-900 dark:text-blue-100">
                  {t('checkout.deliverTo')}
                </p>
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  {selectedAddress.street}
                </p>
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  {selectedAddress.postal_code} {selectedAddress.city}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Shipping Methods */}
      <RadioGroup value={selectedShipping} onValueChange={setSelectedShipping}>
        <div className="space-y-3">
          {shippingMethods.map((method) => (
            <Card key={method.id} className={`cursor-pointer transition-colors ${
              selectedShipping === method.id ? 'ring-2 ring-blue-600' : ''
            }`}>
              <CardContent className="p-4">
                <label className="flex items-center gap-4 cursor-pointer">
                  <RadioGroupItem value={method.id} />
                  <method.icon className="w-6 h-6 text-slate-600 dark:text-slate-400" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-slate-900 dark:text-white">
                        {method.name}
                      </h3>
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {method.price === 0 ? t('common.free') : `€${method.price.toFixed(2)}`}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                      {method.description}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Clock className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-green-600 font-medium">
                        {method.estimatedDays}
                      </span>
                    </div>
                  </div>
                </label>
              </CardContent>
            </Card>
          ))}
        </div>
      </RadioGroup>

      {/* Special Instructions for Pickup */}
      {selectedShipping === 'pickup' && (
        <Card className="bg-amber-50 dark:bg-amber-900/20 border-amber-200">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-amber-600 mt-0.5" />
              <div>
                <p className="font-medium text-amber-900 dark:text-amber-100 mb-2">
                  {t('shipping.pickupInfo')}
                </p>
                <div className="text-sm text-amber-800 dark:text-amber-200 space-y-1">
                  <p><strong>{t('shipping.pickupAddress')}</strong> {t('shipping.pickupLocation')}</p>
                  <p><strong>{t('shipping.pickupHours')}</strong> {t('shipping.pickupSchedule')}</p>
                  <p><strong>{t('shipping.pickupContact')}</strong> {t('shipping.pickupPhone')}</p>
                  <p className="mt-2 text-xs">
                    {t('shipping.pickupNote')}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Button onClick={handleNext} className="w-full bg-blue-600 hover:bg-blue-700">
        {t('checkout.continueToPayment')}
      </Button>
    </div>
  );
};

export default ShippingStep;