import { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import api from '../../api';

export function ProductsManager({ products, categories, onUpdate }) {
  const { t, language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name_pt: '', name_en: '', description_pt: '', description_en: '',
    base_price: 0, category_id: '', featured: false, active: true,
    images: '', colors: '', sizes: '', customization_options: ''
  });

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const data = {
        name_pt: formData.name_pt,
        name_en: formData.name_en,
        description_pt: formData.description_pt,
        description_en: formData.description_en,
        base_price: parseFloat(formData.base_price) || 0,
        category_id: formData.category_id,
        featured: formData.featured,
        active: formData.active,
        images: formData.images ? formData.images.split(',').map(s => s.trim()).filter(Boolean) : [],
        colors: [],
        sizes: [],
        customization_options: []
      };
      
      // Parse colors JSON if provided
      if (formData.colors) {
        try { data.colors = JSON.parse(formData.colors); } catch(e) { data.colors = []; }
      }
      if (formData.sizes) {
        try { data.sizes = JSON.parse(formData.sizes); } catch(e) { data.sizes = []; }
      }
      if (formData.customization_options) {
        try { data.customization_options = JSON.parse(formData.customization_options); } catch(e) { data.customization_options = []; }
      }

      console.log('💾 Saving product:', data, 'using FastAPI');
      
      if (editingId) {
        await api.updateProduct(editingId, data);
      } else {
        await api.createProduct(data);
      }
      
      toast.success(language === 'pt' ? 'Produto guardado!' : 'Product saved!');
      closeDialog();
      onUpdate();
    } catch (err) {
      console.error('Error saving product:', err);
      toast.error(language === 'pt' ? 'Erro ao guardar produto' : 'Error saving product');
    }
  }

  async function handleDelete(id) {
    if (!window.confirm(language === 'pt' ? 'Eliminar produto?' : 'Delete product?')) return;
    try {
      await api.deleteProduct(id);
      
      toast.success(language === 'pt' ? 'Produto eliminado!' : 'Product deleted!');
      onUpdate();
    } catch (err) {
      console.error('Error deleting product:', err);
      toast.error(language === 'pt' ? 'Erro ao eliminar' : 'Error deleting');
    }
  }

  function openEdit(product) {
    setEditingId(product.id);
    setFormData({
      name_pt: product.name_pt || '',
      name_en: product.name_en || '',
      description_pt: product.description_pt || '',
      description_en: product.description_en || '',
      base_price: product.base_price || 0,
      category_id: product.category_id || '',
      featured: product.featured || false,
      active: product.active !== false,
      images: (product.images || []).join(', '),
      colors: JSON.stringify(product.colors || []),
      sizes: JSON.stringify(product.sizes || []),
      customization_options: JSON.stringify(product.customization_options || [])
    });
    setIsOpen(true);
  }

  function openNew() {
    setEditingId(null);
    setFormData({
      name_pt: '', name_en: '', description_pt: '', description_en: '',
      base_price: 0, category_id: '', featured: false, active: true,
      images: '', colors: '[]', sizes: '[]', customization_options: '[]'
    });
    setIsOpen(true);
  }

  function closeDialog() {
    setIsOpen(false);
    setEditingId(null);
  }

  function updateField(field, value) {
    setFormData(prev => ({ ...prev, [field]: value }));
  }

  function getCatName(id) {
    const c = categories.find(x => x.id === id);
    return c ? (language === 'pt' ? c.name_pt : c.name_en) : '-';
  }

  return (
    <div className="space-y-6" data-testid="products-tab">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{t('admin.dashboard.products')}</h2>
        <Button className="bg-blue-600 hover:bg-blue-700" onClick={openNew}>
          <Plus className="w-4 h-4 mr-2" />{t('admin.products.add')}
        </Button>
      </div>

      <Dialog open={isOpen} onOpenChange={v => { if (!v) closeDialog(); }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editingId ? t('admin.products.edit') : t('admin.products.add')}</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Nome (PT) *</Label><Input value={formData.name_pt} onChange={e => updateField('name_pt', e.target.value)} required /></div>
              <div><Label>Name (EN) *</Label><Input value={formData.name_en} onChange={e => updateField('name_en', e.target.value)} required /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Descrição (PT) *</Label><Textarea value={formData.description_pt} onChange={e => updateField('description_pt', e.target.value)} rows={2} required /></div>
              <div><Label>Description (EN) *</Label><Textarea value={formData.description_en} onChange={e => updateField('description_en', e.target.value)} rows={2} required /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Preço (€) *</Label><Input type="number" step="0.01" value={formData.base_price} onChange={e => updateField('base_price', parseFloat(e.target.value) || 0)} required /></div>
              <div><Label>Categoria *</Label>
                <Select value={formData.category_id} onValueChange={v => updateField('category_id', v)}>
                  <SelectTrigger><SelectValue placeholder="..." /></SelectTrigger>
                  <SelectContent>
                    {categories.map(c => <SelectItem key={c.id} value={c.id}>{language === 'pt' ? c.name_pt : c.name_en}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div><Label>Imagens (URLs separados por vírgula)</Label><Textarea value={formData.images} onChange={e => updateField('images', e.target.value)} rows={2} placeholder="https://..., https://..." /></div>
            <div><Label>Cores (JSON)</Label><Textarea value={formData.colors} onChange={e => updateField('colors', e.target.value)} rows={2} placeholder='[{"name_pt":"Vermelho","name_en":"Red","hex_code":"#ff0000","image_url":""}]' /></div>
            <div><Label>Tamanhos (JSON)</Label><Textarea value={formData.sizes} onChange={e => updateField('sizes', e.target.value)} rows={2} placeholder='[{"name":"M","price_adjustment":0}]' /></div>
            <div><Label>Personalizações (JSON)</Label><Textarea value={formData.customization_options} onChange={e => updateField('customization_options', e.target.value)} rows={2} placeholder='[{"name_pt":"Nome","name_en":"Name","type":"text","required":true}]' /></div>
            <div className="flex gap-4">
              <div className="flex items-center gap-2"><Switch checked={formData.featured} onCheckedChange={v => updateField('featured', v)} /><Label>Destaque</Label></div>
              <div className="flex items-center gap-2"><Switch checked={formData.active} onCheckedChange={v => updateField('active', v)} /><Label>Ativo</Label></div>
            </div>
            <Button type="submit" className="w-full bg-blue-600">{t('common.save')}</Button>
          </form>
        </DialogContent>
      </Dialog>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 dark:bg-slate-700"><tr>
            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Nome</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Categoria</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Preço</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Estado</th>
            <th className="px-4 py-3"></th>
          </tr></thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
            {products.length === 0 && <tr><td colSpan={5} className="px-4 py-8 text-center text-slate-500">{language === 'pt' ? 'Sem produtos' : 'No products'}</td></tr>}
            {products.map(renderProductRow)}
          </tbody>
        </table>
      </div>
    </div>
  );

  function renderProductRow(p) {
    const img = p.images && p.images[0];
    return (
      <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
        <td className="px-4 py-3">
          <div className="flex items-center gap-2">
            {img && <img src={img} alt="" className="w-10 h-10 rounded object-cover"/>}
            <span className="font-medium">{language === 'pt' ? p.name_pt : p.name_en}</span>
          </div>
        </td>
        <td className="px-4 py-3 text-sm text-slate-500">{getCatName(p.category_id)}</td>
        <td className="px-4 py-3 font-medium">€{p.base_price.toFixed(2)}</td>
        <td className="px-4 py-3"><Badge className={p.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>{p.active ? 'Ativo' : 'Inativo'}</Badge></td>
        <td className="px-4 py-3 text-right">
          <Button variant="ghost" size="icon" onClick={() => openEdit(p)}><Pencil className="w-4 h-4"/></Button>
          <Button variant="ghost" size="icon" className="text-red-500" onClick={() => handleDelete(p.id)}><Trash2 className="w-4 h-4"/></Button>
        </td>
      </tr>
    );
  }
}
