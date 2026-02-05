import { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useCustomerAuth } from '../context/CustomerAuthContext';
import { Layout } from '../components/layout/Layout';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { toast } from 'sonner';
import api from '../api';
import { 
  Package, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Truck, 
  Eye,
  ArrowLeft,
  Calendar,
  CreditCard,
  MapPin
} from 'lucide-react';

export default function MyOrdersPage() {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { customer, isCustomerAuthenticated } = useCustomerAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchOrders = useCallback(async () => {
    if (!isCustomerAuthenticated) {
      console.log('Customer not authenticated, skipping order fetch');
      return;
    }
    
    try {
      setLoading(true);
      console.log('Fetching customer orders...');
      
      const response = await api.getCustomerOrders();
      console.log('Orders response:', response);
      
      // Backend returns array directly
      const ordersData = Array.isArray(response) ? response : [];
      setOrders(ordersData);
      
    } catch (error) {
      console.error('Error fetching orders:', error);
      
      if (error.message.includes('401') || error.message.includes('Unauthorized')) {
        toast.error(t('orders.authError') || 'Sessão expirada. Por favor, faça login novamente.');
        // Redirect to login after a short delay
        setTimeout(() => navigate('/login'), 2000);
      } else {
        toast.error(t('orders.loadError') || 'Erro ao carregar encomendas');
      }
      
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [t, isCustomerAuthenticated, navigate]);

  useEffect(() => {
    if (!isCustomerAuthenticated) {
      navigate('/login');
      return;
    }
    fetchOrders();
  }, [isCustomerAuthenticated, navigate, fetchOrders]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'confirmed':
        return <CheckCircle2 className="w-4 h-4" />;
      case 'processing':
        return <Package className="w-4 h-4" />;
      case 'shipped':
        return <Truck className="w-4 h-4" />;
      case 'delivered':
        return <CheckCircle2 className="w-4 h-4" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4" />;
      case 'refunded':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'processing':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'shipped':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'refunded':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getStatusText = (status) => {
    return t(`orders.statuses.${status}`) || status;
  };

  const formatDate = (dateString) => {
    const locale = language === 'pt' ? 'pt-PT' : 'en-US';
    return new Date(dateString).toLocaleDateString(locale, {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <Package className="w-12 h-12 text-slate-400 mx-auto mb-4 animate-pulse" />
            <p className="text-slate-600 dark:text-slate-400">{t('orders.loading')}</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (selectedOrder) {
    return (
      <Layout>
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <Button
              variant="ghost"
              onClick={() => setSelectedOrder(null)}
              className="mb-6"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t('orders.backToOrders')}
            </Button>

            <div className="space-y-6">
              {/* Order Header */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-2xl">
                        {t('orders.orderNumber')}{selectedOrder.order_number}
                      </CardTitle>
                      <p className="text-slate-600 dark:text-slate-400 mt-1">
                        {t('orders.createdAt')} {formatDate(selectedOrder.created_at)}
                      </p>
                    </div>
                    <Badge className={`${getStatusColor(selectedOrder.status)} flex items-center gap-2`}>
                      {getStatusIcon(selectedOrder.status)}
                      {getStatusText(selectedOrder.status)}
                    </Badge>
                  </div>
                </CardHeader>
              </Card>

              {/* Order Timeline */}
              <Card>
                <CardHeader>
                  <CardTitle>{t('orders.orderStatus')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {selectedOrder.status_history?.map((status, index) => (
                      <div key={index} className="flex items-center gap-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          index === 0 ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'
                        }`}>
                          {getStatusIcon(status.status)}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-slate-900 dark:text-white">
                            {getStatusText(status.status)}
                          </p>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            {formatDate(status.updated_at)}
                          </p>
                          {status.note && (
                            <p className="text-sm text-slate-500 mt-1">{status.note}</p>
                          )}
                        </div>
                      </div>
                    )) || (
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center bg-blue-600 text-white">
                          {getStatusIcon(selectedOrder.status)}
                        </div>
                        <div>
                          <p className="font-medium text-slate-900 dark:text-white">
                            {getStatusText(selectedOrder.status)}
                          </p>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            {formatDate(selectedOrder.updated_at || selectedOrder.created_at)}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Shipping Info */}
              {selectedOrder.shipping && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="w-5 h-5" />
                      {t('orders.shippingInfo')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">{t('orders.address')}:</p>
                        <p className="text-slate-600 dark:text-slate-400">
                          {selectedOrder.shipping.address}
                        </p>
                      </div>
                      {selectedOrder.shipping.tracking_number && (
                        <div>
                          <p className="font-medium text-slate-900 dark:text-white">{t('orders.trackingNumber')}:</p>
                          <p className="text-blue-600 font-mono">
                            {selectedOrder.shipping.tracking_number}
                          </p>
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">{t('orders.method')}:</p>
                        <p className="text-slate-600 dark:text-slate-400">
                          {selectedOrder.shipping.method}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Payment Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    {t('orders.paymentInfo')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-400">{t('orders.method')}:</span>
                      <span className="font-medium text-slate-900 dark:text-white">
                        {selectedOrder.payment?.method === 'mbway' && 'MB WAY'}
                        {selectedOrder.payment?.method === 'card' && 'Cartão'}
                        {selectedOrder.payment?.method === 'transfer' && 'Transferência'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-400">{t('orders.status')}:</span>
                      <Badge className={selectedOrder.payment?.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                        {selectedOrder.payment?.status === 'paid' ? t('orders.paid') : t('orders.pending')}
                      </Badge>
                    </div>
                    <div className="flex justify-between font-semibold text-lg">
                      <span className="text-slate-900 dark:text-white">{t('orders.total')}:</span>
                      <span className="text-slate-900 dark:text-white">
                        €{selectedOrder.totals?.total?.toFixed(2) || selectedOrder.total_amount?.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Order Items */}
              <Card>
                <CardHeader>
                  <CardTitle>{t('orders.orderProducts')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {selectedOrder.items?.map((item, index) => (
                      <div key={index} className="flex gap-4 p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                        <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-lg overflow-hidden flex-shrink-0">
                          {item.image_url ? (
                            <img src={item.image_url} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package className="w-6 h-6 text-slate-400" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-slate-900 dark:text-white">
                            {item.product_name}
                          </h4>
                          <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                            {item.selected_color && <span>{t('orders.color')}: {item.selected_color}</span>}
                            {item.selected_size && <span className="ml-3">{t('orders.size')}: {item.selected_size}</span>}
                          </div>
                          <div className="flex justify-between items-center mt-2">
                            <span className="text-sm text-slate-600 dark:text-slate-400">
                              {t('orders.quantity')}: {item.quantity}
                            </span>
                            <span className="font-medium text-slate-900 dark:text-white">
                              €{((item.unit_price + (item.size_price_adjustment || 0)) * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              {t('orders.title')}
            </h1>
            <Link to="/">
              <Button variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t('orders.backToStore')}
              </Button>
            </Link>
          </div>

          {orders.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Package className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                  {t('orders.noOrders')}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-6">
                  {t('orders.noOrdersDesc')}
                </p>
                <Link to="/products">
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    {t('orders.viewProducts')}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <Card key={order.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                          #{order.order_number}
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          <Calendar className="w-4 h-4 inline mr-1" />
                          {formatDate(order.created_at)}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge className={`${getStatusColor(order.status)} flex items-center gap-2 mb-2`}>
                          {getStatusIcon(order.status)}
                          {getStatusText(order.status)}
                        </Badge>
                        <p className="font-semibold text-slate-900 dark:text-white">
                          €{order.totals?.total?.toFixed(2) || order.total_amount?.toFixed(2)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-sm text-slate-600 dark:text-slate-400">
                        {order.items?.length || 0} {order.items?.length === 1 ? t('orders.product') : t('orders.products')}
                        {order.payment?.method && (
                          <span className="ml-3">
                            {t('orders.payment')}: {order.payment.method === 'mbway' ? 'MB WAY' : 
                                      order.payment.method === 'card' ? t('payment.card') : t('payment.transfer')}
                          </span>
                        )}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedOrder(order)}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        {t('orders.viewDetails')}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}