import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Switch } from '../components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Badge } from '../components/ui/badge';
import { Toaster } from '../components/ui/sonner';
import { toast } from 'sonner';
import axios from 'axios';
import {
  LayoutDashboard,
  Package,
  FolderOpen,
  ShoppingCart,
  MessageSquare,
  LogOut,
  Plus,
  Pencil,
  Trash2,
  X,
  Printer,
  Moon,
  Sun,
  Globe
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const { t, language, toggleLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { admin, token, logout, isAuthenticated } = useAuth();
  
  const [stats, setStats] = useState(null);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [messages, setMessages] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);

  // Auth check
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin');
    }
  }, [isAuthenticated, navigate]);

  // Fetch data
  useEffect(() => {
    if (token) {
      fetchAllData();
    }
  }, [token]);

  const fetchAllData = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const [statsRes, categoriesRes, productsRes, ordersRes, messagesRes] = await Promise.all([
        axios.get(`${API}/stats`, { headers }),
        axios.get(`${API}/categories`),
        axios.get(`${API}/products/all`, { headers }),
        axios.get(`${API}/orders`, { headers }),
        axios.get(`${API}/contact`, { headers })
      ]);
      setStats(statsRes.data);
      setCategories(categoriesRes.data);
      setProducts(productsRes.data);
      setOrders(ordersRes.data);
      setMessages(messagesRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      if (error.response?.status === 401) {
        logout();
        navigate('/admin');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/admin');
  };

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900" data-testid="admin-dashboard">
      <Toaster position="top-right" richColors />
      
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-slate-900 text-white p-6 hidden md:block">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
            <Printer className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-semibold">Pulgax 3D</h1>
            <p className="text-xs text-slate-400">Admin Panel</p>
          </div>
        </div>

        <nav className="space-y-2">
          {[
            { id: 'dashboard', icon: LayoutDashboard, label: t('admin.dashboard.stats') },
            { id: 'categories', icon: FolderOpen, label: t('admin.dashboard.categories') },
            { id: 'products', icon: Package, label: t('admin.dashboard.products') },
            { id: 'orders', icon: ShoppingCart, label: t('admin.dashboard.orders') },
            { id: 'messages', icon: MessageSquare, label: t('admin.dashboard.messages') },
          ].map((item) => (
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
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <Printer className="w-5 h-5 text-white" />
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
            {[
              { id: 'dashboard', icon: LayoutDashboard },
              { id: 'categories', icon: FolderOpen },
              { id: 'products', icon: Package },
              { id: 'orders', icon: ShoppingCart },
              { id: 'messages', icon: MessageSquare },
            ].map((item) => (
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
        {activeTab === 'dashboard' && (
          <DashboardTab stats={stats} t={t} language={language} admin={admin} />
        )}
        {activeTab === 'categories' && (
          <CategoriesTab 
            categories={categories} 
            token={token} 
            onUpdate={fetchAllData}
            t={t}
            language={language}
          />
        )}
        {activeTab === 'products' && (
          <ProductsTab 
            products={products}
            categories={categories}
            token={token}
            onUpdate={fetchAllData}
            t={t}
            language={language}
          />
        )}
        {activeTab === 'orders' && (
          <OrdersTab 
            orders={orders}
            token={token}
            onUpdate={fetchAllData}
            t={t}
            language={language}
          />
        )}
        {activeTab === 'messages' && (
          <MessagesTab 
            messages={messages}
            token={token}
            onUpdate={fetchAllData}
            t={t}
            language={language}
          />
        )}
      </main>
    </div>
  );
}

// Dashboard Tab
const DashboardTab = ({ stats, t, language, admin }) => (
  <div className="space-y-8" data-testid="dashboard-tab">
    <div>
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
        {t('admin.dashboard.welcome')}, {admin?.name}!
      </h1>
      <p className="text-slate-500 dark:text-slate-400">{t('admin.dashboard.title')}</p>
    </div>

    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {[
        { label: t('admin.dashboard.products'), value: stats?.total_products || 0, color: 'bg-blue-500' },
        { label: t('admin.dashboard.categories'), value: stats?.total_categories || 0, color: 'bg-emerald-500' },
        { label: t('admin.dashboard.orders'), value: stats?.total_orders || 0, color: 'bg-purple-500' },
        { label: t('admin.dashboard.pending'), value: stats?.pending_orders || 0, color: 'bg-amber-500' },
      ].map((stat, index) => (
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

// Categories Tab
const CategoriesTab = ({ categories, token, onUpdate, t, language }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [form, setForm] = useState({ name_pt: '', name_en: '', description_pt: '', description_en: '', image_url: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const headers = { Authorization: `Bearer ${token}` };
      if (editingCategory) {
        await axios.put(`${API}/categories/${editingCategory.id}`, form, { headers });
        toast.success(language === 'pt' ? 'Categoria atualizada!' : 'Category updated!');
      } else {
        await axios.post(`${API}/categories`, form, { headers });
        toast.success(language === 'pt' ? 'Categoria criada!' : 'Category created!');
      }
      setIsOpen(false);
      setEditingCategory(null);
      setForm({ name_pt: '', name_en: '', description_pt: '', description_en: '', image_url: '' });
      onUpdate();
    } catch (error) {
      toast.error(language === 'pt' ? 'Erro ao guardar categoria' : 'Error saving category');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(language === 'pt' ? 'Eliminar esta categoria?' : 'Delete this category?')) return;
    try {
      await axios.delete(`${API}/categories/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      toast.success(language === 'pt' ? 'Categoria eliminada!' : 'Category deleted!');
      onUpdate();
    } catch (error) {
      toast.error(language === 'pt' ? 'Erro ao eliminar categoria' : 'Error deleting category');
    }
  };

  const openEdit = (category) => {
    setEditingCategory(category);
    setForm({
      name_pt: category.name_pt,
      name_en: category.name_en,
      description_pt: category.description_pt,
      description_en: category.description_en,
      image_url: category.image_url
    });
    setIsOpen(true);
  };

  return (
    <div className="space-y-6" data-testid="categories-tab">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          {t('admin.dashboard.categories')}
        </h2>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => { setEditingCategory(null); setForm({ name_pt: '', name_en: '', description_pt: '', description_en: '', image_url: '' }); }} data-testid="add-category-btn">
              <Plus className="w-4 h-4 mr-2" />
              {t('admin.categories.add')}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingCategory ? t('admin.categories.edit') : t('admin.categories.add')}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t('admin.categories.name')} (PT)</Label>
                  <Input value={form.name_pt} onChange={(e) => setForm(p => ({ ...p, name_pt: e.target.value }))} required data-testid="category-name-pt" />
                </div>
                <div className="space-y-2">
                  <Label>{t('admin.categories.name')} (EN)</Label>
                  <Input value={form.name_en} onChange={(e) => setForm(p => ({ ...p, name_en: e.target.value }))} required data-testid="category-name-en" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t('admin.categories.description')} (PT)</Label>
                  <Textarea value={form.description_pt} onChange={(e) => setForm(p => ({ ...p, description_pt: e.target.value }))} rows={2} />
                </div>
                <div className="space-y-2">
                  <Label>{t('admin.categories.description')} (EN)</Label>
                  <Textarea value={form.description_en} onChange={(e) => setForm(p => ({ ...p, description_en: e.target.value }))} rows={2} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>{t('admin.categories.image')} URL</Label>
                <Input value={form.image_url} onChange={(e) => setForm(p => ({ ...p, image_url: e.target.value }))} placeholder="https://..." />
              </div>
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" data-testid="save-category-btn">
                {t('common.save')}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 dark:bg-slate-700">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t('admin.categories.name')}</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t('admin.categories.description')}</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {categories.map((category) => (
                <tr key={category.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {category.image_url && (
                        <img src={category.image_url} alt="" className="w-10 h-10 rounded-lg object-cover" />
                      )}
                      <span className="font-medium text-slate-900 dark:text-white">
                        {language === 'pt' ? category.name_pt : category.name_en}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                    {language === 'pt' ? category.description_pt : category.description_en}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(category)} data-testid={`edit-category-${category.id}`}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600" onClick={() => handleDelete(category.id)} data-testid={`delete-category-${category.id}`}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {categories.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
                    {language === 'pt' ? 'Nenhuma categoria encontrada' : 'No categories found'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Products Tab
const ProductsTab = ({ products, categories, token, onUpdate, t, language }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form, setForm] = useState({
    name_pt: '', name_en: '', description_pt: '', description_en: '',
    base_price: 0, category_id: '', colors: [], sizes: [],
    customization_options: [], images: [], featured: false, active: true
  });
  const [newColor, setNewColor] = useState({ name_pt: '', name_en: '', hex_code: '#000000', image_url: '' });
  const [newSize, setNewSize] = useState({ name: '', price_adjustment: 0 });
  const [newCustomization, setNewCustomization] = useState({ name_pt: '', name_en: '', type: 'text', required: false, max_length: null });
  const [newImage, setNewImage] = useState('');

  const resetForm = () => {
    setForm({
      name_pt: '', name_en: '', description_pt: '', description_en: '',
      base_price: 0, category_id: '', colors: [], sizes: [],
      customization_options: [], images: [], featured: false, active: true
    });
    setNewColor({ name_pt: '', name_en: '', hex_code: '#000000', image_url: '' });
    setNewSize({ name: '', price_adjustment: 0 });
    setNewCustomization({ name_pt: '', name_en: '', type: 'text', required: false, max_length: null });
    setNewImage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const headers = { Authorization: `Bearer ${token}` };
      if (editingProduct) {
        await axios.put(`${API}/products/${editingProduct.id}`, form, { headers });
        toast.success(language === 'pt' ? 'Produto atualizado!' : 'Product updated!');
      } else {
        await axios.post(`${API}/products`, form, { headers });
        toast.success(language === 'pt' ? 'Produto criado!' : 'Product created!');
      }
      setIsOpen(false);
      setEditingProduct(null);
      resetForm();
      onUpdate();
    } catch (error) {
      toast.error(language === 'pt' ? 'Erro ao guardar produto' : 'Error saving product');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(language === 'pt' ? 'Eliminar este produto?' : 'Delete this product?')) return;
    try {
      await axios.delete(`${API}/products/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      toast.success(language === 'pt' ? 'Produto eliminado!' : 'Product deleted!');
      onUpdate();
    } catch (error) {
      toast.error(language === 'pt' ? 'Erro ao eliminar produto' : 'Error deleting product');
    }
  };

  const openEdit = (product) => {
    setEditingProduct(product);
    setForm({
      name_pt: product.name_pt,
      name_en: product.name_en,
      description_pt: product.description_pt,
      description_en: product.description_en,
      base_price: product.base_price,
      category_id: product.category_id,
      colors: product.colors || [],
      sizes: product.sizes || [],
      customization_options: product.customization_options || [],
      images: product.images || [],
      featured: product.featured,
      active: product.active
    });
    setIsOpen(true);
  };

  const addColor = () => {
    if (newColor.name_pt && newColor.hex_code) {
      setForm(p => ({ ...p, colors: [...p.colors, { ...newColor }] }));
      setNewColor({ name_pt: '', name_en: '', hex_code: '#000000', image_url: '' });
    }
  };

  const addSize = () => {
    if (newSize.name) {
      setForm(p => ({ ...p, sizes: [...p.sizes, { ...newSize }] }));
      setNewSize({ name: '', price_adjustment: 0 });
    }
  };

  const addCustomization = () => {
    if (newCustomization.name_pt) {
      setForm(p => ({ ...p, customization_options: [...p.customization_options, { ...newCustomization }] }));
      setNewCustomization({ name_pt: '', name_en: '', type: 'text', required: false, max_length: null });
    }
  };

  const addImage = () => {
    if (newImage) {
      setForm(p => ({ ...p, images: [...p.images, newImage] }));
      setNewImage('');
    }
  };

  return (
    <div className="space-y-6" data-testid="products-tab">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          {t('admin.dashboard.products')}
        </h2>
        <Dialog open={isOpen} onOpenChange={(open) => { setIsOpen(open); if (!open) { setEditingProduct(null); resetForm(); } }}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700" data-testid="add-product-btn">
              <Plus className="w-4 h-4 mr-2" />
              {t('admin.products.add')}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingProduct ? t('admin.products.edit') : t('admin.products.add')}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t('admin.products.name')} (PT) *</Label>
                  <Input value={form.name_pt} onChange={(e) => setForm(p => ({ ...p, name_pt: e.target.value }))} required data-testid="product-name-pt" />
                </div>
                <div className="space-y-2">
                  <Label>{t('admin.products.name')} (EN) *</Label>
                  <Input value={form.name_en} onChange={(e) => setForm(p => ({ ...p, name_en: e.target.value }))} required data-testid="product-name-en" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t('admin.products.description')} (PT) *</Label>
                  <Textarea value={form.description_pt} onChange={(e) => setForm(p => ({ ...p, description_pt: e.target.value }))} rows={3} required />
                </div>
                <div className="space-y-2">
                  <Label>{t('admin.products.description')} (EN) *</Label>
                  <Textarea value={form.description_en} onChange={(e) => setForm(p => ({ ...p, description_en: e.target.value }))} rows={3} required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t('admin.products.price')} (€) *</Label>
                  <Input type="number" step="0.01" min="0" value={form.base_price} onChange={(e) => setForm(p => ({ ...p, base_price: parseFloat(e.target.value) || 0 }))} required data-testid="product-price" />
                </div>
                <div className="space-y-2">
                  <Label>{t('admin.products.category')} *</Label>
                  <Select value={form.category_id} onValueChange={(v) => setForm(p => ({ ...p, category_id: v }))}>
                    <SelectTrigger data-testid="product-category">
                      <SelectValue placeholder={language === 'pt' ? 'Selecionar categoria' : 'Select category'} />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {language === 'pt' ? cat.name_pt : cat.name_en}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Colors */}
              <div className="space-y-4">
                <Label className="text-base font-semibold">{t('admin.products.colors')}</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {form.colors.map((color, i) => (
                    <div key={i} className="flex items-center gap-2 bg-slate-100 dark:bg-slate-700 px-3 py-1 rounded-lg">
                      <span className="w-4 h-4 rounded-full" style={{ backgroundColor: color.hex_code }} />
                      <span className="text-sm">{color.name_pt}</span>
                      <button type="button" onClick={() => setForm(p => ({ ...p, colors: p.colors.filter((_, idx) => idx !== i) }))} className="text-red-500">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-5 gap-2">
                  <Input placeholder="Nome (PT)" value={newColor.name_pt} onChange={(e) => setNewColor(p => ({ ...p, name_pt: e.target.value }))} />
                  <Input placeholder="Name (EN)" value={newColor.name_en} onChange={(e) => setNewColor(p => ({ ...p, name_en: e.target.value }))} />
                  <Input type="color" value={newColor.hex_code} onChange={(e) => setNewColor(p => ({ ...p, hex_code: e.target.value }))} className="h-10 p-1" />
                  <Input placeholder="Image URL" value={newColor.image_url} onChange={(e) => setNewColor(p => ({ ...p, image_url: e.target.value }))} />
                  <Button type="button" onClick={addColor} variant="outline">+</Button>
                </div>
              </div>

              {/* Sizes */}
              <div className="space-y-4">
                <Label className="text-base font-semibold">{t('admin.products.sizes')}</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {form.sizes.map((size, i) => (
                    <div key={i} className="flex items-center gap-2 bg-slate-100 dark:bg-slate-700 px-3 py-1 rounded-lg">
                      <span className="text-sm">{size.name} (+€{size.price_adjustment})</span>
                      <button type="button" onClick={() => setForm(p => ({ ...p, sizes: p.sizes.filter((_, idx) => idx !== i) }))} className="text-red-500">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <Input placeholder="S, M, L..." value={newSize.name} onChange={(e) => setNewSize(p => ({ ...p, name: e.target.value }))} />
                  <Input type="number" step="0.01" placeholder="+€0.00" value={newSize.price_adjustment} onChange={(e) => setNewSize(p => ({ ...p, price_adjustment: parseFloat(e.target.value) || 0 }))} />
                  <Button type="button" onClick={addSize} variant="outline">+</Button>
                </div>
              </div>

              {/* Customizations */}
              <div className="space-y-4">
                <Label className="text-base font-semibold">{t('admin.products.customizations')}</Label>
                <div className="space-y-2 mb-2">
                  {form.customization_options.map((opt, i) => (
                    <div key={i} className="flex items-center gap-2 bg-slate-100 dark:bg-slate-700 px-3 py-2 rounded-lg">
                      <span className="text-sm">{opt.name_pt} ({opt.type}) {opt.required && '*'}</span>
                      <button type="button" onClick={() => setForm(p => ({ ...p, customization_options: p.customization_options.filter((_, idx) => idx !== i) }))} className="text-red-500 ml-auto">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-5 gap-2 items-center">
                  <Input placeholder="Nome (PT)" value={newCustomization.name_pt} onChange={(e) => setNewCustomization(p => ({ ...p, name_pt: e.target.value }))} />
                  <Input placeholder="Name (EN)" value={newCustomization.name_en} onChange={(e) => setNewCustomization(p => ({ ...p, name_en: e.target.value }))} />
                  <Select value={newCustomization.type} onValueChange={(v) => setNewCustomization(p => ({ ...p, type: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="text">Text</SelectItem>
                      <SelectItem value="number">Number</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="flex items-center gap-2">
                    <Switch checked={newCustomization.required} onCheckedChange={(v) => setNewCustomization(p => ({ ...p, required: v }))} />
                    <span className="text-sm">{language === 'pt' ? 'Obrigatório' : 'Required'}</span>
                  </div>
                  <Button type="button" onClick={addCustomization} variant="outline">+</Button>
                </div>
              </div>

              {/* Images */}
              <div className="space-y-4">
                <Label className="text-base font-semibold">{t('admin.products.images')}</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {form.images.map((img, i) => (
                    <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden group">
                      <img src={img} alt="" className="w-full h-full object-cover" />
                      <button type="button" onClick={() => setForm(p => ({ ...p, images: p.images.filter((_, idx) => idx !== i) }))} className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <X className="w-5 h-5 text-white" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input placeholder="https://..." value={newImage} onChange={(e) => setNewImage(e.target.value)} className="flex-1" />
                  <Button type="button" onClick={addImage} variant="outline">+</Button>
                </div>
              </div>

              {/* Toggles */}
              <div className="flex gap-6">
                <div className="flex items-center gap-2">
                  <Switch checked={form.featured} onCheckedChange={(v) => setForm(p => ({ ...p, featured: v }))} data-testid="product-featured" />
                  <Label>{t('admin.products.featured')}</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch checked={form.active} onCheckedChange={(v) => setForm(p => ({ ...p, active: v }))} data-testid="product-active" />
                  <Label>{t('admin.products.active')}</Label>
                </div>
              </div>

              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" data-testid="save-product-btn">
                {t('common.save')}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Products Table */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 dark:bg-slate-700">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">{t('admin.products.name')}</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">{t('admin.products.category')}</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">{t('admin.products.price')}</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Status</th>
                <th className="px-6 py-4 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {products.map((product) => {
                const category = categories.find(c => c.id === product.category_id);
                return (
                  <tr key={product.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {(product.images?.[0] || product.colors?.[0]?.image_url) && (
                          <img src={product.images?.[0] || product.colors?.[0]?.image_url} alt="" className="w-12 h-12 rounded-lg object-cover" />
                        )}
                        <div>
                          <p className="font-medium text-slate-900 dark:text-white">
                            {language === 'pt' ? product.name_pt : product.name_en}
                          </p>
                          <div className="flex gap-1 mt-1">
                            {product.colors?.slice(0, 4).map((c, i) => (
                              <span key={i} className="w-3 h-3 rounded-full border border-slate-200" style={{ backgroundColor: c.hex_code }} />
                            ))}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                      {category ? (language === 'pt' ? category.name_pt : category.name_en) : '-'}
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                      €{product.base_price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        {product.featured && <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">{t('products.featured')}</Badge>}
                        <Badge className={product.active ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' : 'bg-red-100 text-red-700'}>
                          {product.active ? (language === 'pt' ? 'Ativo' : 'Active') : (language === 'pt' ? 'Inativo' : 'Inactive')}
                        </Badge>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => openEdit(product)} data-testid={`edit-product-${product.id}`}>
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600" onClick={() => handleDelete(product.id)} data-testid={`delete-product-${product.id}`}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {products.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
                    {language === 'pt' ? 'Nenhum produto encontrado' : 'No products found'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Orders Tab
const OrdersTab = ({ orders, token, onUpdate, t, language }) => {
  const [selectedOrder, setSelectedOrder] = useState(null);

  const updateStatus = async (orderId, status) => {
    try {
      await axios.put(`${API}/orders/${orderId}/status?status=${status}`, {}, { headers: { Authorization: `Bearer ${token}` } });
      toast.success(language === 'pt' ? 'Estado atualizado!' : 'Status updated!');
      onUpdate();
    } catch (error) {
      toast.error(language === 'pt' ? 'Erro ao atualizar estado' : 'Error updating status');
    }
  };

  const statusColors = {
    pending: 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300',
    confirmed: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
    processing: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
    shipped: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300',
    delivered: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
    cancelled: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
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
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">{t('admin.orders.number')}</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">{t('admin.orders.customer')}</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">{t('admin.orders.total')}</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">{t('admin.orders.status')}</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">{t('admin.orders.date')}</th>
                <th className="px-6 py-4 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                  <td className="px-6 py-4 font-mono text-sm font-medium text-slate-900 dark:text-white">
                    {order.order_number}
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">{order.customer_name}</p>
                      <p className="text-sm text-slate-500">{order.customer_email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                    €{order.total_amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    <Select value={order.status} onValueChange={(v) => updateStatus(order.id, v)}>
                      <SelectTrigger className="w-[140px]">
                        <Badge className={statusColors[order.status]}>
                          {t(`admin.orders.statuses.${order.status}`)}
                        </Badge>
                      </SelectTrigger>
                      <SelectContent>
                        {['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => (
                          <SelectItem key={status} value={status}>
                            {t(`admin.orders.statuses.${status}`)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">
                    {new Date(order.created_at).toLocaleDateString(language === 'pt' ? 'pt-PT' : 'en-US')}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm" onClick={() => setSelectedOrder(order)}>
                          {language === 'pt' ? 'Ver' : 'View'}
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>{t('admin.orders.number')}: {order.order_number}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-semibold mb-2">{t('admin.orders.customer')}</h4>
                              <p>{order.customer_name}</p>
                              <p className="text-sm text-slate-500">{order.customer_email}</p>
                              <p className="text-sm text-slate-500">{order.customer_phone}</p>
                            </div>
                            <div>
                              <h4 className="font-semibold mb-2">{language === 'pt' ? 'Morada' : 'Address'}</h4>
                              <p className="text-sm text-slate-600 dark:text-slate-400">{order.shipping_address}</p>
                            </div>
                          </div>
                          <div>
                            <h4 className="font-semibold mb-2">{language === 'pt' ? 'Itens' : 'Items'}</h4>
                            <div className="space-y-2">
                              {order.items.map((item, i) => (
                                <div key={i} className="bg-slate-50 dark:bg-slate-700 p-3 rounded-lg">
                                  <p className="font-medium">{item.product_id}</p>
                                  <p className="text-sm text-slate-500">
                                    Qty: {item.quantity}
                                    {item.selected_color && ` | ${language === 'pt' ? 'Cor' : 'Color'}: ${item.selected_color}`}
                                    {item.selected_size && ` | ${language === 'pt' ? 'Tamanho' : 'Size'}: ${item.selected_size}`}
                                  </p>
                                  {item.customizations && Object.keys(item.customizations).length > 0 && (
                                    <p className="text-sm text-slate-500">
                                      {Object.entries(item.customizations).map(([k, v]) => v && `${k}: ${v}`).filter(Boolean).join(' | ')}
                                    </p>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                          {order.notes && (
                            <div>
                              <h4 className="font-semibold mb-2">{language === 'pt' ? 'Notas' : 'Notes'}</h4>
                              <p className="text-sm text-slate-600 dark:text-slate-400">{order.notes}</p>
                            </div>
                          )}
                          <div className="flex justify-between items-center pt-4 border-t">
                            <span className="font-semibold">{t('admin.orders.total')}</span>
                            <span className="text-xl font-bold">€{order.total_amount.toFixed(2)}</span>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
                    {language === 'pt' ? 'Nenhuma encomenda encontrada' : 'No orders found'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Messages Tab
const MessagesTab = ({ messages, token, onUpdate, t, language }) => {
  const markAsRead = async (id) => {
    try {
      await axios.put(`${API}/contact/${id}/read`, {}, { headers: { Authorization: `Bearer ${token}` } });
      onUpdate();
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const deleteMessage = async (id) => {
    if (!window.confirm(language === 'pt' ? 'Eliminar esta mensagem?' : 'Delete this message?')) return;
    try {
      await axios.delete(`${API}/contact/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      toast.success(language === 'pt' ? 'Mensagem eliminada!' : 'Message deleted!');
      onUpdate();
    } catch (error) {
      toast.error(language === 'pt' ? 'Erro ao eliminar mensagem' : 'Error deleting message');
    }
  };

  return (
    <div className="space-y-6" data-testid="messages-tab">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
        {t('admin.dashboard.messages')}
      </h2>

      <div className="space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm ${!msg.read ? 'ring-2 ring-blue-500' : ''}`}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-slate-900 dark:text-white">{msg.name}</h3>
                  {!msg.read && (
                    <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                      {language === 'pt' ? 'Novo' : 'New'}
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-slate-500">{msg.email} {msg.phone && `• ${msg.phone}`}</p>
              </div>
              <div className="flex gap-2">
                {!msg.read && (
                  <Button variant="ghost" size="sm" onClick={() => markAsRead(msg.id)}>
                    {language === 'pt' ? 'Marcar como lida' : 'Mark as read'}
                  </Button>
                )}
                <Button variant="ghost" size="icon" className="text-red-500" onClick={() => deleteMessage(msg.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <h4 className="font-medium text-slate-900 dark:text-white mb-2">{msg.subject}</h4>
            <p className="text-slate-600 dark:text-slate-400">{msg.message}</p>
            <p className="text-xs text-slate-400 mt-4">
              {new Date(msg.created_at).toLocaleString(language === 'pt' ? 'pt-PT' : 'en-US')}
            </p>
          </div>
        ))}
        {messages.length === 0 && (
          <div className="bg-white dark:bg-slate-800 rounded-xl p-12 text-center">
            <MessageSquare className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600 mb-4" />
            <p className="text-slate-500 dark:text-slate-400">
              {language === 'pt' ? 'Nenhuma mensagem encontrada' : 'No messages found'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
