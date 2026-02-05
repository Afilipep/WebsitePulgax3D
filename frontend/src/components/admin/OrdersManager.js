import { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { toast } from 'sonner';
import { Eye, Search, Package, User, CreditCard, MapPin } from 'lucide-react';
import { OrderDetailsModal } from './OrderDetailsModal';
import api from '../../api';

export function OrdersManager({ orders, onUpdate }) {
  const { t, language } = useLanguage();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Safe fallback for orders
  const safeOrders = Array.isArray(orders) ? orders : [];

  const handleViewDetails = async (orderId) => {
    try {
      const response = await api.getOrderDetails(orderId);
      // Handle API response - data might be returned directly or in a data property
      const orderData = response?.data || response;
      setSelectedOrder(orderData);
      setShowDetailsModal(true);
    } catch (error) {
      console.error('Error loading order details:', error);
      toast.error('Erro ao carregar detalhes da encomenda');
    }
  };

  const handleCloseModal = () => {
    setShowDetailsModal(false);
    setSelectedOrder(null);
  };

  const handleStatusUpdate = async (orderId, newStatus, note = '') => {
    try {
      await api.updateOrderStatus(orderId, newStatus, note);
      toast.success('Estado da encomenda atualizado com sucesso!');
      // Refresh the orders list
      if (onUpdate) {
        await onUpdate();
      }
      // Update the selected order if it's the same one
      if (selectedOrder && selectedOrder.id === orderId) {
        const updatedOrderResponse = await api.getOrderDetails(orderId);
        const updatedOrderData = updatedOrderResponse?.data || updatedOrderResponse;
        setSelectedOrder(updatedOrderData);
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Erro ao atualizar estado da encomenda');
    }
  };

  const filteredOrders = safeOrders.filter(order => {
    const searchLower = searchQuery.toLowerCase();
    return (
      order.order_number?.toLowerCase().includes(searchLower) ||
      order.customer?.name?.toLowerCase().includes(searchLower) ||
      order.customer?.email?.toLowerCase().includes(searchLower) ||
      order.customer_name?.toLowerCase().includes(searchLower) ||
      order.customer_email?.toLowerCase().includes(searchLower)
    );
  });

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    confirmed: 'bg-blue-100 text-blue-800 border-blue-200',
    processing: 'bg-purple-100 text-purple-800 border-purple-200',
    shipped: 'bg-green-100 text-green-800 border-green-200',
    delivered: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    cancelled: 'bg-red-100 text-red-800 border-red-200',
    refunded: 'bg-gray-100 text-gray-800 border-gray-200'
  };

  const getStatusText = (status) => {
    const statusMap = {
      pending: 'Pendente',
      confirmed: 'Confirmada',
      processing: 'Em Processamento',
      shipped: 'Enviada',
      delivered: 'Entregue',
      cancelled: 'Cancelada',
      refunded: 'Reembolsada'
    };
    return statusMap[status] || status;
  };

  return (
    <div className="space-y-6" data-testid="orders-tab">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          Gestão de Encomendas
        </h2>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Pesquisar encomendas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 dark:bg-slate-700">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">
                  Encomenda
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">
                  Cliente
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">
                  Pagamento
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">
                  Total
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">
                  Estado
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">
                  Data
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                    <Package className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                    <p>Nenhuma encomenda encontrada</p>
                  </td>
                </tr>
              ) : filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Package className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="font-mono text-sm font-medium text-slate-900 dark:text-white">
                          {order.order_number || `#${order.id.slice(-6)}`}
                        </p>
                        <p className="text-xs text-slate-500">
                          {Array.isArray(order.items) ? order.items.length : 1} {Array.isArray(order.items) && order.items.length === 1 ? 'item' : 'itens'}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <User className="w-4 h-4 text-slate-400" />
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">
                          {order.customer?.name || order.customer_name}
                        </p>
                        <p className="text-sm text-slate-500">
                          {order.customer?.email || order.customer_email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-slate-400" />
                      <div>
                        <p className="text-sm font-medium text-slate-900 dark:text-white">
                          {order.payment?.method || 'N/A'}
                        </p>
                        <Badge className={`text-xs ${
                          order.payment?.status === 'paid' ? 'bg-green-100 text-green-800' :
                          order.payment?.status === 'refunded' ? 'bg-gray-100 text-gray-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {order.payment?.status?.toUpperCase() || 'PENDING'}
                        </Badge>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                    €{(order.totals?.total || order.total_amount || 0).toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    <Badge className={`${statusColors[order.status]} border`}>
                      {getStatusText(order.status)}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">
                    {new Date(order.created_at).toLocaleDateString('pt-PT')}
                  </td>
                  <td className="px-6 py-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleViewDetails(order.id)}
                      className="flex items-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      Ver Detalhes
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      <OrderDetailsModal
        order={selectedOrder}
        isOpen={showDetailsModal}
        onClose={handleCloseModal}
        onUpdate={onUpdate}
        onStatusUpdate={handleStatusUpdate}
      />
    </div>
  );
}