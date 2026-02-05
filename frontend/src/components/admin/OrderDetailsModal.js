import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { toast } from 'sonner';
import { 
  X, Package, User, MapPin, CreditCard, Truck, 
  RefreshCw, AlertTriangle, CheckCircle, Clock
} from 'lucide-react';
import api from '../../api';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  confirmed: 'bg-blue-100 text-blue-800 border-blue-200',
  processing: 'bg-purple-100 text-purple-800 border-purple-200',
  shipped: 'bg-green-100 text-green-800 border-green-200',
  delivered: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  cancelled: 'bg-red-100 text-red-800 border-red-200',
  refunded: 'bg-gray-100 text-gray-800 border-gray-200'
};

const statusIcons = {
  pending: Clock,
  confirmed: CheckCircle,
  processing: RefreshCw,
  shipped: Truck,
  delivered: Package,
  cancelled: X,
  refunded: AlertTriangle
};

export function OrderDetailsModal({ order, isOpen, onClose, onUpdate, onStatusUpdate }) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [showRefundForm, setShowRefundForm] = useState(false);
  const [showStatusForm, setShowStatusForm] = useState(false);
  const [statusNote, setStatusNote] = useState('');
  const [newStatus, setNewStatus] = useState('');
  const [refundData, setRefundData] = useState({
    amount: 0,
    reason: '',
    method: ''
  });

  // Update refundData when order changes
  useEffect(() => {
    if (order) {
      setRefundData({
        amount: order.totals?.total || order.total_amount || 0,
        reason: '',
        method: order.payment?.method || ''
      });
    }
  }, [order]);

  if (!isOpen || !order) return null;

  // Safe access to order properties with defaults
  const safeOrder = {
    id: order.id || '',
    order_number: order.order_number || `#${order.id?.slice(-6) || 'N/A'}`,
    status: order.status || 'pending',
    created_at: order.created_at || new Date().toISOString(),
    customer: {
      name: order.customer?.name || order.customer_name || 'N/A',
      email: order.customer?.email || order.customer_email || 'N/A',
      phone: order.customer?.phone || order.customer_phone || 'N/A',
      address: {
        street: order.customer?.address?.street || order.shipping?.address || 'N/A',
        city: order.customer?.address?.city || 'N/A',
        postal_code: order.customer?.address?.postal_code || 'N/A',
        country: order.customer?.address?.country || 'Portugal'
      }
    },
    payment: {
      method: order.payment?.method || 'N/A',
      status: order.payment?.status || 'pending',
      transaction_id: order.payment?.transaction_id || 'N/A',
      paid_at: order.payment?.paid_at || order.created_at || new Date().toISOString()
    },
    shipping: {
      method: order.shipping?.method || 'N/A',
      cost: order.shipping?.cost || 0,
      tracking_number: order.shipping?.tracking_number || null
    },
    totals: {
      subtotal: order.totals?.subtotal || order.total_amount || 0,
      shipping: order.totals?.shipping || order.shipping?.cost || 0,
      total: order.totals?.total || order.total_amount || 0
    },
    items: order.items || [],
    notes: order.notes || '',
    refund: order.refund || null
  };

  const handleStatusUpdate = async (status, note = '') => {
    setIsUpdating(true);
    try {
      if (onStatusUpdate) {
        await onStatusUpdate(safeOrder.id, status, note);
      } else {
        await api.updateOrderStatus(safeOrder.id, status, note);
      }
      toast.success('Estado da encomenda atualizado com sucesso!');
      if (onUpdate) {
        await onUpdate(); // Refresh the orders list
      }
      onClose();
      setShowStatusForm(false);
      setStatusNote('');
      setNewStatus('');
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Erro ao atualizar estado da encomenda');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleStatusFormSubmit = () => {
    handleStatusUpdate(newStatus, statusNote);
  };

  const handleRefund = async () => {
    if (!refundData.reason.trim()) {
      toast.error('Por favor, indique o motivo do reembolso');
      return;
    }

    setIsUpdating(true);
    try {
      await api.processRefund(safeOrder.id, refundData);
      toast.success('Reembolso processado com sucesso!');
      if (onUpdate) {
        await onUpdate(); // Refresh the orders list
      }
      onClose();
      setShowRefundForm(false);
      setRefundData({
        amount: 0,
        reason: '',
        method: ''
      });
    } catch (error) {
      console.error('Error processing refund:', error);
      toast.error(error.message || 'Erro ao processar reembolso');
    } finally {
      setIsUpdating(false);
    }
  };

  const StatusIcon = statusIcons[safeOrder.status] || Clock;
  const canRefund = safeOrder.status !== 'refunded' && safeOrder.status !== 'cancelled';

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <Package className="w-6 h-6 text-blue-600" />
            <div>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                Encomenda {safeOrder.order_number}
              </h2>
              <p className="text-sm text-slate-500">
                {new Date(safeOrder.created_at).toLocaleDateString('pt-PT')}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <StatusIcon className="w-5 h-5" />
              <Badge className={`${statusColors[safeOrder.status]} border`}>
                {safeOrder.status.toUpperCase()}
              </Badge>
            </div>
            
            {!showRefundForm && (
              <div className="flex gap-2">
                {safeOrder.status === 'pending' && (
                  <Button
                    size="sm"
                    onClick={() => {
                      setNewStatus('confirmed');
                      setShowStatusForm(true);
                    }}
                    disabled={isUpdating}
                  >
                    Confirmar
                  </Button>
                )}
                {safeOrder.status === 'confirmed' && (
                  <Button
                    size="sm"
                    onClick={() => {
                      setNewStatus('processing');
                      setShowStatusForm(true);
                    }}
                    disabled={isUpdating}
                  >
                    Processar
                  </Button>
                )}
                {safeOrder.status === 'processing' && (
                  <Button
                    size="sm"
                    onClick={() => {
                      setNewStatus('shipped');
                      setShowStatusForm(true);
                    }}
                    disabled={isUpdating}
                  >
                    Enviar
                  </Button>
                )}
                {safeOrder.status === 'shipped' && (
                  <Button
                    size="sm"
                    onClick={() => {
                      setNewStatus('delivered');
                      setShowStatusForm(true);
                    }}
                    disabled={isUpdating}
                  >
                    Entregar
                  </Button>
                )}
                {canRefund && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setShowRefundForm(true)}
                    className="text-red-600 border-red-200 hover:bg-red-50"
                  >
                    Reembolsar
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* Status Update Form */}
          {showStatusForm && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-3">
                Atualizar Estado da Encomenda
              </h3>
              <div className="space-y-3">
                <div>
                  <Label>Novo Estado</Label>
                  <p className="font-medium text-slate-900 dark:text-white">
                    {newStatus === 'confirmed' && 'Confirmada'}
                    {newStatus === 'processing' && 'Em Processamento'}
                    {newStatus === 'shipped' && 'Enviada'}
                    {newStatus === 'delivered' && 'Entregue'}
                  </p>
                </div>
                <div>
                  <Label>Nota (opcional)</Label>
                  <Textarea
                    value={statusNote}
                    onChange={(e) => setStatusNote(e.target.value)}
                    placeholder="Adicione uma nota sobre esta atualização..."
                    rows={3}
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={handleStatusFormSubmit}
                    disabled={isUpdating}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {isUpdating ? 'A atualizar...' : 'Confirmar Atualização'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowStatusForm(false);
                      setStatusNote('');
                      setNewStatus('');
                    }}
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Refund Form */}
          {showRefundForm && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <h3 className="font-semibold text-red-800 dark:text-red-200 mb-3">
                Processar Reembolso
              </h3>
              <div className="space-y-3">
                <div>
                  <Label>Valor (€)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={refundData.amount}
                    onChange={(e) => setRefundData(prev => ({ ...prev, amount: parseFloat(e.target.value) }))}
                  />
                </div>
                <div>
                  <Label>Método de reembolso</Label>
                  <Input
                    value={refundData.method}
                    onChange={(e) => setRefundData(prev => ({ ...prev, method: e.target.value }))}
                    placeholder="MB WAY, Transferência, etc."
                  />
                </div>
                <div>
                  <Label>Motivo *</Label>
                  <Textarea
                    value={refundData.reason}
                    onChange={(e) => setRefundData(prev => ({ ...prev, reason: e.target.value }))}
                    placeholder="Descreva o motivo do reembolso..."
                    rows={3}
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={handleRefund}
                    disabled={isUpdating}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Confirmar Reembolso
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowRefundForm(false)}
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Status History */}
          {safeOrder.status_history && safeOrder.status_history.length > 0 && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-3">
                Histórico de Estados
              </h3>
              <div className="space-y-2">
                {safeOrder.status_history.map((history, index) => (
                  <div key={index} className="flex justify-between items-start text-sm">
                    <div>
                      <span className="font-medium">{history.status.toUpperCase()}</span>
                      {history.note && <p className="text-slate-600 dark:text-slate-400">{history.note}</p>}
                    </div>
                    <div className="text-right text-xs text-slate-500">
                      <p>{new Date(history.updated_at).toLocaleString('pt-PT')}</p>
                      <p>{history.updated_by}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Refund Info */}
          {safeOrder.refund && (
            <div className="bg-gray-50 dark:bg-gray-900/20 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
                Informações do Reembolso
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Valor:</span>
                  <span className="ml-2 font-medium">€{safeOrder.refund.amount?.toFixed(2) || '0.00'}</span>
                </div>
                <div>
                  <span className="text-gray-500">Método:</span>
                  <span className="ml-2">{safeOrder.refund.method || 'N/A'}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-gray-500">Motivo:</span>
                  <span className="ml-2">{safeOrder.refund.reason || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-gray-500">Processado em:</span>
                  <span className="ml-2">
                    {safeOrder.refund.processed_at 
                      ? new Date(safeOrder.refund.processed_at).toLocaleString('pt-PT')
                      : 'N/A'
                    }
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Por:</span>
                  <span className="ml-2">{safeOrder.refund.processed_by || 'N/A'}</span>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Customer Info */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-slate-900 dark:text-white">
                  Dados do Cliente
                </h3>
              </div>
              <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4 space-y-2">
                <div>
                  <span className="text-sm text-slate-500">Nome:</span>
                  <p className="font-medium">{safeOrder.customer.name}</p>
                </div>
                <div>
                  <span className="text-sm text-slate-500">Email:</span>
                  <p className="font-medium">{safeOrder.customer.email}</p>
                </div>
                <div>
                  <span className="text-sm text-slate-500">Telefone:</span>
                  <p className="font-medium">{safeOrder.customer.phone}</p>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-green-600" />
                <h3 className="font-semibold text-slate-900 dark:text-white">
                  Morada de Envio
                </h3>
              </div>
              <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4">
                <p className="font-medium">{safeOrder.customer.address.street}</p>
                <p>{safeOrder.customer.address.postal_code} {safeOrder.customer.address.city}</p>
                <p>{safeOrder.customer.address.country}</p>
              </div>

              {safeOrder.notes && (
                <>
                  <h3 className="font-semibold text-slate-900 dark:text-white">Notas</h3>
                  <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4">
                    <p>{safeOrder.notes}</p>
                  </div>
                </>
              )}
            </div>

            {/* Payment & Shipping */}
            <div className="space-y-4">
              {/* Payment Info */}
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-purple-600" />
                <h3 className="font-semibold text-slate-900 dark:text-white">
                  Pagamento
                </h3>
              </div>
              <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4 space-y-2">
                <div>
                  <span className="text-sm text-slate-500">Método:</span>
                  <p className="font-medium">{safeOrder.payment.method}</p>
                </div>
                <div>
                  <span className="text-sm text-slate-500">Estado:</span>
                  <Badge className={`ml-2 ${
                    safeOrder.payment.status === 'paid' ? 'bg-green-100 text-green-800' :
                    safeOrder.payment.status === 'refunded' ? 'bg-gray-100 text-gray-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {safeOrder.payment.status.toUpperCase()}
                  </Badge>
                </div>
                <div>
                  <span className="text-sm text-slate-500">ID Transação:</span>
                  <p className="font-medium text-xs">{safeOrder.payment.transaction_id}</p>
                </div>
                <div>
                  <span className="text-sm text-slate-500">Pago em:</span>
                  <p className="font-medium">{new Date(safeOrder.payment.paid_at).toLocaleString('pt-PT')}</p>
                </div>
              </div>

              {/* Shipping Info */}
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-orange-600" />
                <h3 className="font-semibold text-slate-900 dark:text-white">
                  Envio
                </h3>
              </div>
              <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4 space-y-2">
                <div>
                  <span className="text-sm text-slate-500">Método:</span>
                  <p className="font-medium">{safeOrder.shipping.method}</p>
                </div>
                <div>
                  <span className="text-sm text-slate-500">Custo:</span>
                  <p className="font-medium">€{safeOrder.shipping.cost.toFixed(2)}</p>
                </div>
                {safeOrder.shipping.tracking_number && (
                  <div>
                    <span className="text-sm text-slate-500">Tracking:</span>
                    <p className="font-medium text-xs">{safeOrder.shipping.tracking_number}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4">
              Produtos Encomendados
            </h3>
            <div className="space-y-3">
              {safeOrder.items.map((item, index) => (
                <div key={index} className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-medium text-slate-900 dark:text-white">
                        {item.product_name || 'Produto sem nome'}
                      </h4>
                      <div className="text-sm text-slate-500 space-y-1 mt-2">
                        <p>Quantidade: {item.quantity || 1}</p>
                        {item.selected_color && <p>Cor: {item.selected_color}</p>}
                        {item.selected_size && <p>Tamanho: {item.selected_size}</p>}
                        {Object.keys(item.customizations || {}).length > 0 && (
                          <div>
                            <p>Personalizações:</p>
                            <ul className="ml-4 list-disc">
                              {Object.entries(item.customizations).map(([key, value]) => (
                                <li key={key}>{key}: {value}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">€{(item.total_price || item.unit_price || 0).toFixed(2)}</p>
                      <p className="text-sm text-slate-500">€{(item.unit_price || 0).toFixed(2)} cada</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Totals */}
          <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>€{safeOrder.totals.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Envio:</span>
                <span>€{safeOrder.totals.shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-semibold text-lg border-t border-slate-200 dark:border-slate-600 pt-2">
                <span>Total:</span>
                <span>€{safeOrder.totals.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}