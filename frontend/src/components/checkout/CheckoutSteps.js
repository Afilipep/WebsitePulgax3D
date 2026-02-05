import { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { CheckCircle2, Package, CreditCard, MapPin } from 'lucide-react';

const CheckoutSteps = ({ currentStep, completedSteps }) => {
  const { t } = useLanguage();
  
  const steps = [
    { id: 1, name: t('checkout.steps.personal'), icon: MapPin },
    { id: 2, name: t('checkout.steps.shipping'), icon: Package },
    { id: 3, name: t('checkout.steps.payment'), icon: CreditCard },
    { id: 4, name: t('checkout.steps.confirmation'), icon: CheckCircle2 }
  ];

  return (
    <div className="flex items-center justify-between mb-8">
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-center">
          <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
            completedSteps.includes(step.id) 
              ? 'bg-green-600 border-green-600 text-white'
              : currentStep === step.id
              ? 'bg-blue-600 border-blue-600 text-white'
              : 'border-slate-300 text-slate-400'
          }`}>
            {completedSteps.includes(step.id) ? (
              <CheckCircle2 className="w-5 h-5" />
            ) : (
              <step.icon className="w-5 h-5" />
            )}
          </div>
          <div className="ml-3 hidden sm:block">
            <p className={`text-sm font-medium ${
              completedSteps.includes(step.id) || currentStep === step.id
                ? 'text-slate-900 dark:text-white'
                : 'text-slate-500'
            }`}>
              {step.name}
            </p>
          </div>
          {index < steps.length - 1 && (
            <div className={`w-12 h-0.5 mx-4 ${
              completedSteps.includes(step.id) ? 'bg-green-600' : 'bg-slate-300'
            }`} />
          )}
        </div>
      ))}
    </div>
  );
};

export default CheckoutSteps;