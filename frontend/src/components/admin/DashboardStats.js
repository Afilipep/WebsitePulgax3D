import { useLanguage } from '../../context/LanguageContext';

export function DashboardStats({ stats, admin }) {
  const { t } = useLanguage();
  
  const statItems = [
    { label: t('admin.dashboard.products'), value: stats?.total_products || 0, color: 'bg-blue-500' },
    { label: t('admin.dashboard.categories'), value: stats?.total_categories || 0, color: 'bg-emerald-500' },
    { label: t('admin.dashboard.orders'), value: stats?.total_orders || 0, color: 'bg-purple-500' },
    { label: t('admin.dashboard.pending'), value: stats?.pending_orders || 0, color: 'bg-amber-500' },
  ];

  return (
    <div className="space-y-8" data-testid="dashboard-tab">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          {t('admin.dashboard.welcome')}, {admin?.name}!
        </h1>
        <p className="text-slate-500 dark:text-slate-400">{t('admin.dashboard.title')}</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statItems.map((stat, index) => (
          <div key={index} className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm">
            <div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center mb-4`}>
              <span className="text-white text-lg font-bold">{stat.value}</span>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
