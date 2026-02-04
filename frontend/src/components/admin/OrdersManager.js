import { useLanguage } from '../../context/LanguageContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { toast } from 'sonner';
import api from '../../api';

export function OrdersManager({ orders, onUpdate }) {
  const { t, language } = useLanguage();

  const updateStatus = async (orderId, status) => {
    try {
      await api.updateOrderStatus(orderId, status);
      toast.success(language === 'pt' ? 'Estado atualizado!' : 'Status updated!');
      onUpdate();
    } catch (error) {
      toast.error(language === 'pt' ? 'Erro' : 'Error');
    }
  };

  const statusColors = {
    pending: 'bg-amber-100 text-amber-700',
    confirmed: 'bg-blue-100 text-blue-700',
    processing: 'bg-purple-100 text-purple-700',
    shipped: 'bg-indigo-100 text-indigo-700',
    delivered: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
  };

  return (
    <div className="space-y-6" data-testid="orders-tab">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
        {t('admin.dashboard.orders')}
      </h2>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 dark:bg-slate-700">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">{t('admin.orders.number')}</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">{t('admin.orders.customer')}</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">{t('admin.orders.total')}</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">{t('admin.orders.status')}</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">{t('admin.orders.date')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    {language === 'pt' ? 'Nenhuma encomenda' : 'No orders'}
                  </td>
                </tr>
              ) : orders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                  <td className="px-6 py-4 font-mono text-sm font-medium text-slate-900 dark:text-white">
                    {order.order_number}
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-slate-900 dark:text-white">{order.customer_name}</p>
                    <p className="text-sm text-slate-500">{order.customer_email}</p>
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                    €{order.total_amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    <Select value={order.status} onValueChange={(v) => updateStatus(order.id, v)}>
                      <SelectTrigger className="w-[130px]">
                        <Badge className={statusColors[order.status] || ''}>
                          {t(`admin.orders.statuses.${order.status}`)}
                        </Badge>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">{t('admin.orders.statuses.pending')}</SelectItem>
                        <SelectItem value="confirmed">{t('admin.orders.statuses.confirmed')}</SelectItem>
                        <SelectItem value="processing">{t('admin.orders.statuses.processing')}</SelectItem>
                        <SelectItem value="shipped">{t('admin.orders.statuses.shipped')}</SelectItem>
                        <SelectItem value="delivered">{t('admin.orders.statuses.delivered')}</SelectItem>
                        <SelectItem value="cancelled">{t('admin.orders.statuses.cancelled')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">
                    {new Date(order.created_at).toLocaleDateString(language === 'pt' ? 'pt-PT' : 'en-US')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
