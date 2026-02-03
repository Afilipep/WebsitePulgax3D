import { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { toast } from 'sonner';
import axios from 'axios';
import { Plus, Pencil, Trash2, X } from 'lucide-react';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export function ProductsManager({ products, categories, token, onUpdate }) {
  const { t, language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form, setForm] = useState({
    name_pt: '', name_en: '', description_pt: '', description_en: '',
    base_price: 0, category_id: '', colors: [], sizes: [],
    customization_options: [], images: [], featured: false, active: true
  });
  const [newColor, setNewColor] = useState({ name_pt: '', name_en: '', hex_code: '#000000', image_url: '' });
  const [newSize, setNewSize] = useState({ name: '', price_adjustment: 0 });
  const [newCustomization, setNewCustomization] = useState({ name_pt: '', name_en: '', type: 'text', required: false });
  const [newImage, setNewImage] = useState('');

  const resetForm = () => {
    setForm({
      name_pt: '', name_en: '', description_pt: '', description_en: '',
      base_price: 0, category_id: '', colors: [], sizes: [],
      customization_options: [], images: [], featured: false, active: true
    });
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
      name_pt: product.name_pt, name_en: product.name_en,
      description_pt: product.description_pt, description_en: product.description_en,
      base_price: product.base_price, category_id: product.category_id,
      colors: product.colors || [], sizes: product.sizes || [],
      customization_options: product.customization_options || [],
      images: product.images || [], featured: product.featured, active: product.active
    });
    setIsOpen(true);
  };

  const openNew = () => {
    setEditingProduct(null);
    resetForm();
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
      setNewCustomization({ name_pt: '', name_en: '', type: 'text', required: false });
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
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={openNew} data-testid="add-product-btn">
              <Plus className="w-4 h-4 mr-2" />
              {t('admin.products.add')}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingProduct ? t('admin.products.edit') : t('admin.products.add')}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t('admin.products.name')} (PT) *</Label>
                  <Input value={form.name_pt} onChange={(e) => setForm(p => ({ ...p, name_pt: e.target.value }))} required />
                </div>
                <div className="space-y-2">
                  <Label>{t('admin.products.name')} (EN) *</Label>
                  <Input value={form.name_en} onChange={(e) => setForm(p => ({ ...p, name_en: e.target.value }))} required />
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
                  <Input type="number" step="0.01" min="0" value={form.base_price} onChange={(e) => setForm(p => ({ ...p, base_price: parseFloat(e.target.value) || 0 }))} required />
                </div>
                <div className="space-y-2">
                  <Label>{t('admin.products.category')} *</Label>
                  <Select value={form.category_id} onValueChange={(v) => setForm(p => ({ ...p, category_id: v }))}>
                    <SelectTrigger>
                      <SelectValue placeholder={language === 'pt' ? 'Selecionar' : 'Select'} />
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
              <div className="space-y-3">
                <Label className="font-semibold">{t('admin.products.colors')}</Label>
                <div className="flex flex-wrap gap-2">
                  {form.colors.map((color, i) => (
                    <div key={i} className="flex items-center gap-2 bg-slate-100 dark:bg-slate-700 px-3 py-1 rounded-lg">
                      <span className="w-4 h-4 rounded-full" style={{ backgroundColor: color.hex_code }} />
                      <span className="text-sm">{color.name_pt}</span>
                      <button type="button" onClick={() => setForm(p => ({ ...p, colors: p.colors.filter((_, idx) => idx !== i) }))} className="text-red-500"><X className="w-3 h-3" /></button>
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
              <div className="space-y-3">
                <Label className="font-semibold">{t('admin.products.sizes')}</Label>
                <div className="flex flex-wrap gap-2">
                  {form.sizes.map((size, i) => (
                    <div key={i} className="flex items-center gap-2 bg-slate-100 dark:bg-slate-700 px-3 py-1 rounded-lg">
                      <span className="text-sm">{size.name} (+€{size.price_adjustment})</span>
                      <button type="button" onClick={() => setForm(p => ({ ...p, sizes: p.sizes.filter((_, idx) => idx !== i) }))} className="text-red-500"><X className="w-3 h-3" /></button>
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
              <div className="space-y-3">
                <Label className="font-semibold">{t('admin.products.customizations')}</Label>
                <div className="space-y-2">
                  {form.customization_options.map((opt, i) => (
                    <div key={i} className="flex items-center gap-2 bg-slate-100 dark:bg-slate-700 px-3 py-2 rounded-lg">
                      <span className="text-sm">{opt.name_pt} ({opt.type}) {opt.required && '*'}</span>
                      <button type="button" onClick={() => setForm(p => ({ ...p, customization_options: p.customization_options.filter((_, idx) => idx !== i) }))} className="text-red-500 ml-auto"><X className="w-3 h-3" /></button>
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
                  <div className="flex items-center gap-1">
                    <Switch checked={newCustomization.required} onCheckedChange={(v) => setNewCustomization(p => ({ ...p, required: v }))} />
                    <span className="text-xs">*</span>
                  </div>
                  <Button type="button" onClick={addCustomization} variant="outline">+</Button>
                </div>
              </div>

              {/* Images */}
              <div className="space-y-3">
                <Label className="font-semibold">{t('admin.products.images')}</Label>
                <div className="flex flex-wrap gap-2">
                  {form.images.map((img, i) => (
                    <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden group">
                      <img src={img} alt="" className="w-full h-full object-cover" />
                      <button type="button" onClick={() => setForm(p => ({ ...p, images: p.images.filter((_, idx) => idx !== i) }))} className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100">
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
                  <Switch checked={form.featured} onCheckedChange={(v) => setForm(p => ({ ...p, featured: v }))} />
                  <Label>{t('admin.products.featured')}</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch checked={form.active} onCheckedChange={(v) => setForm(p => ({ ...p, active: v }))} />
                  <Label>{t('admin.products.active')}</Label>
                </div>
              </div>

              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
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
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">{t('admin.products.name')}</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">{t('admin.products.category')}</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">{t('admin.products.price')}</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">Status</th>
                <th className="px-6 py-4 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    {language === 'pt' ? 'Nenhum produto' : 'No products'}
                  </td>
                </tr>
              ) : products.map((product) => {
                const category = categories.find(c => c.id === product.category_id);
                const productImg = product.images?.[0] || product.colors?.[0]?.image_url;
                return (
                  <tr key={product.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {productImg && <img src={productImg} alt="" className="w-12 h-12 rounded-lg object-cover" />}
                        <p className="font-medium text-slate-900 dark:text-white">
                          {language === 'pt' ? product.name_pt : product.name_en}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      {category ? (language === 'pt' ? category.name_pt : category.name_en) : '-'}
                    </td>
                    <td className="px-6 py-4 font-medium">€{product.base_price.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <Badge className={product.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>
                        {product.active ? (language === 'pt' ? 'Ativo' : 'Active') : (language === 'pt' ? 'Inativo' : 'Inactive')}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => openEdit(product)}>
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-red-500" onClick={() => handleDelete(product.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
