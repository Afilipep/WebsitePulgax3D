import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { Layout } from '../components/layout/Layout';
import { Button } from '../components/ui/button';
import { 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag,
  ArrowRight 
} from 'lucide-react';

export default function CartPage() {
  const { t, language } = useLanguage();
  const { cart, removeFromCart, updateQuantity, cartTotal } = useCart();

  if (cart.length === 0) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex flex-col items-center justify-center px-4" data-testid="empty-cart">
          <ShoppingBag className="w-20 h-20 text-slate-300 dark:text-slate-600 mb-6" />
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            {t('cart.empty')}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mb-8">
            {language === 'pt' 
              ? 'Adicione produtos ao seu carrinho para continuar'
              : 'Add products to your cart to continue'
            }
          </p>
          <Link to="/products">
            <Button className="bg-blue-600 hover:bg-blue-700" data-testid="continue-shopping-btn">
              {t('cart.continueShopping')}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900" data-testid="cart-page">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">
            {t('cart.title')}
          </h1>

          {/* Cart Items */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm overflow-hidden mb-8">
            {cart.map((item, index) => (
              <div 
                key={index}
                className={`flex gap-4 p-6 ${index !== cart.length - 1 ? 'border-b border-slate-100 dark:border-slate-700' : ''}`}
                data-testid={`cart-item-${index}`}
              >
                {/* Image */}
                <div className="w-24 h-24 flex-shrink-0 bg-slate-100 dark:bg-slate-700 rounded-lg overflow-hidden">
                  {item.image ? (
                    <img 
                      src={item.image} 
                      alt={language === 'pt' ? item.name_pt : item.name_en}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ShoppingBag className="w-8 h-8 text-slate-400" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-slate-900 dark:text-white">
                    {language === 'pt' ? item.name_pt : item.name_en}
                  </h3>
                  
                  {/* Options */}
                  <div className="text-sm text-slate-500 dark:text-slate-400 mt-1 space-y-1">
                    {item.selected_color && (
                      <div className="flex items-center gap-2">
                        <span>{t('products.color')}:</span>
                        <span 
                          className="w-4 h-4 rounded-full border border-slate-200"
                          style={{ backgroundColor: item.selected_color_hex }}
                        />
                        <span>{item.selected_color}</span>
                      </div>
                    )}
                    {item.selected_size && (
                      <div>{t('products.size')}: {item.selected_size}</div>
                    )}
                    {Object.entries(item.customizations || {}).map(([key, value]) => 
                      value && (
                        <div key={key}>{key}: {value}</div>
                      )
                    )}
                  </div>

                  {/* Price & Quantity */}
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(index, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        data-testid={`decrease-qty-${index}`}
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(index, item.quantity + 1)}
                        data-testid={`increase-qty-${index}`}
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <span className="font-semibold text-slate-900 dark:text-white">
                        €{((item.price + (item.size_price_adjustment || 0)) * item.quantity).toFixed(2)}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                        onClick={() => removeFromCart(index)}
                        data-testid={`remove-item-${index}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <span className="text-lg font-semibold text-slate-900 dark:text-white">
                {t('cart.total')}
              </span>
              <span className="text-2xl font-bold text-slate-900 dark:text-white" data-testid="cart-total">
                €{cartTotal.toFixed(2)}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/products" className="flex-1">
                <Button variant="outline" className="w-full" data-testid="continue-shopping-link">
                  {t('cart.continueShopping')}
                </Button>
              </Link>
              <Link to="/checkout" className="flex-1">
                <Button className="w-full bg-blue-600 hover:bg-blue-700" data-testid="checkout-btn">
                  {t('cart.checkout')}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
