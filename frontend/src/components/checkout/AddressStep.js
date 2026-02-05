import { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { toast } from 'sonner';
import { MapPin, Plus, Edit } from 'lucide-react';
import api from '../../api';

const AddressStep = ({ customer, onNext, onAddressSelect }) => {
  const { t } = useLanguage();
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    street: '',
    city: '',
    postal_code: '',
    country: 'Portugal'
  });

  useEffect(() => {
    if (customer?.address && Object.keys(customer.address).length > 0) {
      setAddresses([{ id: 'default', ...customer.address, isDefault: true }]);
      setSelectedAddress('default');
    } else {
      setShowNewAddressForm(true);
    }
  }, [customer]);

  const handleNewAddressSubmit = async (e) => {
    e.preventDefault();
    
    if (!newAddress.street || !newAddress.city || !newAddress.postal_code) {
      toast.error(t('address.fillRequired'));
      return;
    }

    try {
      const response = await api.updateCustomerAddress(newAddress);
      const addressWithId = { id: 'new', ...newAddress, isDefault: false };
      setAddresses(prev => [...prev, addressWithId]);
      setSelectedAddress('new');
      setShowNewAddressForm(false);
      toast.success(t('address.addSuccess'));
    } catch (error) {
      toast.error(t('address.addError'));
    }
  };

  const handleNext = () => {
    if (!selectedAddress) {
      toast.error(t('address.selectAddress'));
      return;
    }

    const address = addresses.find(addr => addr.id === selectedAddress);
    onAddressSelect(address);
    onNext();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <MapPin className="w-5 h-5 text-blue-600" />
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
          {t('checkout.shipping')}
        </h2>
      </div>

      {/* Existing Addresses */}
      {addresses.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-medium text-slate-900 dark:text-white">{t('address.savedAddresses')}</h3>
          <RadioGroup value={selectedAddress} onValueChange={setSelectedAddress}>
            {addresses.map((address) => (
              <Card key={address.id} className={`cursor-pointer transition-colors ${
                selectedAddress === address.id ? 'ring-2 ring-blue-600' : ''
              }`}>
                <CardContent className="p-4">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <RadioGroupItem value={address.id} className="mt-1" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-slate-900 dark:text-white">
                          {address.isDefault ? t('address.mainAddress') : t('address.address')}
                        </span>
                        {address.isDefault && (
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            {t('address.main')}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                        {address.street}
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {address.postal_code} {address.city}, {address.country}
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.preventDefault();
                        // TODO: Implement edit address
                        toast.info(t('address.editInDevelopment'));
                      }}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  </label>
                </CardContent>
              </Card>
            ))}
          </RadioGroup>
        </div>
      )}

      {/* Add New Address */}
      <div>
        {!showNewAddressForm ? (
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowNewAddressForm(true)}
            className="w-full"
          >
            <Plus className="w-4 h-4 mr-2" />
            {t('address.addAddress')}
          </Button>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t('address.newAddress')}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleNewAddressSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="street">{t('address.street')} *</Label>
                  <Input
                    id="street"
                    value={newAddress.street}
                    onChange={(e) => setNewAddress(prev => ({ ...prev, street: e.target.value }))}
                    placeholder={t('address.streetPlaceholder')}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">{t('address.city')} *</Label>
                    <Input
                      id="city"
                      value={newAddress.city}
                      onChange={(e) => setNewAddress(prev => ({ ...prev, city: e.target.value }))}
                      placeholder={t('address.cityPlaceholder')}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="postal_code">{t('address.postalCode')} *</Label>
                    <Input
                      id="postal_code"
                      value={newAddress.postal_code}
                      onChange={(e) => setNewAddress(prev => ({ ...prev, postal_code: e.target.value }))}
                      placeholder={t('address.postalPlaceholder')}
                      required
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button type="submit" className="flex-1">
                    {t('address.saveAddress')}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowNewAddressForm(false)}
                  >
                    {t('common.cancel')}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Continue Button */}
      {selectedAddress && (
        <Button onClick={handleNext} className="w-full bg-blue-600 hover:bg-blue-700">
          {t('checkout.continueToShipping')}
        </Button>
      )}
    </div>
  );
};

export default AddressStep;