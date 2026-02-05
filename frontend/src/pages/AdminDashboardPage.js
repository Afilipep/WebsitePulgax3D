import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Button } from '../components/ui/button';
import { Toaster } from '../components/ui/sonner';
import {
  LayoutDashboard, Package, FolderOpen, ShoppingCart, MessageSquare,
  LogOut, Printer, Moon, Sun, Globe, Shield
} from 'lucide-react';
import { DashboardStats } from '../components/admin/DashboardStats';
import { CategoriesManager } from '../components/admin/CategoriesManager';
import { ProductsManager } from '../components/admin/ProductsManager';
import { OrdersManager } from '../components/admin/OrdersManager';
import { MessagesManager } from '../components/admin/MessagesManager';
import { DataValidation } from '../components/admin/DataValidation';
import api from '../api';

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const { t, toggleLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { admin, token, logout, isAuthenticated } = useAuth();
  
  const [stats, setStats] = useState(null);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [messages, setMessages] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');

  const fetchAllData = useCallback(async () => {
    if (!token) return;
    try {
      const results = await Promise.all([
        api.getStats(),
        api.getCategories(),
        api.getAllProducts(),
        api.getOrders(),
        api.getMessages()
      ]);
      
      // Handle API responses safely - some APIs might return data directly, others in a data property
      setStats(results[0]?.data || results[0] || null);
      setCategories(Array.isArray(results[1]?.data) ? results[1].data : Array.isArray(results[1]) ? results[1] : []);
      setProducts(Array.isArray(results[2]?.data) ? results[2].data : Array.isArray(results[2]) ? results[2] : []);
      setOrders(Array.isArray(results[3]?.data) ? results[3].data : Array.isArray(results[3]) ? results[3] : []);
      setMessages(Array.isArray(results[4]?.data) ? results[4].data : Array.isArray(results[4]) ? results[4] : []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      if (error.response?.status === 401) {
        logout();
        navigate('/admin');
      }
    }
  }, [token, logout, navigate]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const handleLogout = () => {
    logout();
    navigate('/admin');
  };

  if (!isAuthenticated) return null;

  const navItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: t('admin.dashboard.stats') },
    { id: 'categories', icon: FolderOpen, label: t('admin.dashboard.categories') },
    { id: 'products', icon: Package, label: t('admin.dashboard.products') },
    { id: 'orders', icon: ShoppingCart, label: t('admin.dashboard.orders') },
    { id: 'messages', icon: MessageSquare, label: t('admin.dashboard.messages') },
    { id: 'validation', icon: Shield, label: 'Validação de Dados' },
  ];

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900" data-testid="admin-dashboard">
      <Toaster position="top-right" richColors />
      
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-slate-900 text-white p-6 hidden md:block">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl overflow-hidden bg-blue-600 flex items-center justify-center">
            <img 
              src="/logo.jpg" 
              alt="Pulgax 3D Logo" 
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <Printer className="w-5 h-5 text-white" style={{ display: 'none' }} />
          </div>
          <div>
            <h1 className="font-semibold">Pulgax 3D</h1>
            <p className="text-xs text-slate-400">Admin Panel</p>
          </div>
        </div>

        <nav className="space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === item.id
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
              data-testid={`nav-${item.id}`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="absolute bottom-6 left-6 right-6 space-y-4">
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" onClick={toggleLanguage} className="text-slate-400 hover:text-white">
              <Globe className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={toggleTheme} className="text-slate-400 hover:text-white">
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </Button>
          </div>
          <Button
            variant="ghost"
            className="w-full justify-start text-slate-400 hover:text-white hover:bg-slate-800"
            onClick={handleLogout}
            data-testid="logout-btn"
          >
            <LogOut className="w-5 h-5 mr-3" />
            {t('admin.dashboard.logout')}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="md:ml-64 p-6 md:p-8">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl overflow-hidden bg-blue-600 flex items-center justify-center">
              <img 
                src="/logo.jpg" 
                alt="Pulgax 3D Logo" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <Printer className="w-5 h-5 text-white" style={{ display: 'none' }} />
            </div>
            <span className="font-semibold text-slate-900 dark:text-white">Admin</span>
          </div>
          <Button variant="ghost" onClick={handleLogout}>
            <LogOut className="w-5 h-5" />
          </Button>
        </div>

        {/* Mobile Tabs */}
        <div className="md:hidden mb-6 overflow-x-auto">
          <div className="flex gap-2">
            {navItems.map((item) => (
              <Button
                key={item.id}
                variant={activeTab === item.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveTab(item.id)}
                className={activeTab === item.id ? 'bg-blue-600' : ''}
              >
                <item.icon className="w-4 h-4" />
              </Button>
            ))}
          </div>
        </div>

        {/* Content */}
        {activeTab === 'dashboard' && <DashboardStats stats={stats} admin={admin} />}
        {activeTab === 'categories' && <CategoriesManager categories={categories} onUpdate={fetchAllData} />}
        {activeTab === 'products' && <ProductsManager products={products} categories={categories} onUpdate={fetchAllData} />}
        {activeTab === 'orders' && <OrdersManager orders={orders} onUpdate={fetchAllData} />}
        {activeTab === 'messages' && <MessagesManager messages={messages} onUpdate={fetchAllData} />}
        {activeTab === 'validation' && <DataValidation />}
      </main>
    </div>
  );
}
