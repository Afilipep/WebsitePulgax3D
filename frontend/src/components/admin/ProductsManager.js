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

const initialForm = {
  name_pt: '', name_en: '', description_pt: '', description_en: '',
  base_price: 0, category_id: '', colors: [], sizes: [],
  customization_options: [], images: [], featured: false, active: true
};

export function ProductsManager({ products, categories, token, onUpdate }) {
  const { t, language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form, setForm] = useState({...initialForm});
  const [colorInput, setColorInput] = useState({ name_pt: '', name_en: '', hex_code: '#000000', image_url: '' });
  const [sizeInput, setSizeInput] = useState({ name: '', price_adjustment: 0 });
  const [customInput, setCustomInput] = useState({ name_pt: '', name_en: '', type: 'text', required: false });
  const [imageInput, setImageInput] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const headers = { Authorization: `Bearer ${token}` };
      if (editingProduct) {
        await axios.put(`${API}/products/${editingProduct.id}`, form, { headers });
        toast.success(language === 'pt' ? 'Atualizado!' : 'Updated!');
      } else {
        await axios.post(`${API}/products`, form, { headers });
        toast.success(language === 'pt' ? 'Criado!' : 'Created!');
      }
      closeDialog();
      onUpdate();
    } catch (err) {
      toast.error(language === 'pt' ? 'Erro' : 'Error');
    }
  }

  async function handleDelete(id) {
    if (!window.confirm(language === 'pt' ? 'Eliminar?' : 'Delete?')) return;
    try {
      await axios.delete(`${API}/products/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      toast.success(language === 'pt' ? 'Eliminado!' : 'Deleted!');
      onUpdate();
    } catch (err) {
      toast.error(language === 'pt' ? 'Erro' : 'Error');
    }
  }

  function openEdit(product) {
    setEditingProduct(product);
    setForm({
      name_pt: product.name_pt || '', name_en: product.name_en || '',
      description_pt: product.description_pt || '', description_en: product.description_en || '',
      base_price: product.base_price || 0, category_id: product.category_id || '',
      colors: product.colors || [], sizes: product.sizes || [],
      customization_options: product.customization_options || [],
      images: product.images || [], featured: product.featured || false, active: product.active !== false
    });
    setIsOpen(true);
  }

  function closeDialog() {
    setIsOpen(false);
    setEditingProduct(null);
    setForm({...initialForm});
  }

  function addColor() {
    if (!colorInput.name_pt) return;
    setForm(f => ({...f, colors: [...f.colors, {...colorInput}]}));
    setColorInput({ name_pt: '', name_en: '', hex_code: '#000000', image_url: '' });
  }

  function addSize() {
    if (!sizeInput.name) return;
    setForm(f => ({...f, sizes: [...f.sizes, {...sizeInput}]}));
    setSizeInput({ name: '', price_adjustment: 0 });
  }

  function addCustom() {
    if (!customInput.name_pt) return;
    setForm(f => ({...f, customization_options: [...f.customization_options, {...customInput}]}));
    setCustomInput({ name_pt: '', name_en: '', type: 'text', required: false });
  }

  function addImg() {
    if (!imageInput) return;
    setForm(f => ({...f, images: [...f.images, imageInput]}));
    setImageInput('');
  }

  function removeFromArray(key, idx) {
    setForm(f => ({...f, [key]: f[key].filter((_, i) => i !== idx)}));
  }

  const catName = (id) => {
    const c = categories.find(x => x.id === id);
    return c ? (language === 'pt' ? c.name_pt : c.name_en) : '-';
  };

  return (
    <div className="space-y-6" data-testid="products-tab">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{t('admin.dashboard.products')}</h2>
        <Dialog open={isOpen} onOpenChange={v => { if (!v) closeDialog(); else setIsOpen(true); }}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => { setEditingProduct(null); setForm({...initialForm}); setIsOpen(true); }}>
              <Plus className="w-4 h-4 mr-2" />{t('admin.products.add')}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>{editingProduct ? t('admin.products.edit') : t('admin.products.add')}</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Nome (PT) *</Label><Input value={form.name_pt} onChange={e => setForm(f => ({...f, name_pt: e.target.value}))} required /></div>
                <div><Label>Name (EN) *</Label><Input value={form.name_en} onChange={e => setForm(f => ({...f, name_en: e.target.value}))} required /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Descrição (PT) *</Label><Textarea value={form.description_pt} onChange={e => setForm(f => ({...f, description_pt: e.target.value}))} rows={2} required /></div>
                <div><Label>Description (EN) *</Label><Textarea value={form.description_en} onChange={e => setForm(f => ({...f, description_en: e.target.value}))} rows={2} required /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Preço (€) *</Label><Input type="number" step="0.01" value={form.base_price} onChange={e => setForm(f => ({...f, base_price: parseFloat(e.target.value) || 0}))} required /></div>
                <div><Label>Categoria *</Label>
                  <Select value={form.category_id} onValueChange={v => setForm(f => ({...f, category_id: v}))}>
                    <SelectTrigger><SelectValue placeholder="..." /></SelectTrigger>
                    <SelectContent>{categories.map(c => <SelectItem key={c.id} value={c.id}>{language === 'pt' ? c.name_pt : c.name_en}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
              
              {/* Colors */}
              <div><Label className="font-semibold">Cores</Label>
                <div className="flex flex-wrap gap-2 my-2">{form.colors.map((c, i) => <span key={i} className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded text-sm"><span className="w-3 h-3 rounded-full" style={{background: c.hex_code}}/>{c.name_pt}<button type="button" onClick={() => removeFromArray('colors', i)} className="text-red-500"><X className="w-3 h-3"/></button></span>)}</div>
                <div className="flex gap-2"><Input placeholder="Nome PT" value={colorInput.name_pt} onChange={e => setColorInput(c => ({...c, name_pt: e.target.value}))} className="w-24"/><Input placeholder="EN" value={colorInput.name_en} onChange={e => setColorInput(c => ({...c, name_en: e.target.value}))} className="w-20"/><Input type="color" value={colorInput.hex_code} onChange={e => setColorInput(c => ({...c, hex_code: e.target.value}))} className="w-12 p-1"/><Input placeholder="Img URL" value={colorInput.image_url} onChange={e => setColorInput(c => ({...c, image_url: e.target.value}))} className="flex-1"/><Button type="button" onClick={addColor} variant="outline" size="sm">+</Button></div>
              </div>
              
              {/* Sizes */}
              <div><Label className="font-semibold">Tamanhos</Label>
                <div className="flex flex-wrap gap-2 my-2">{form.sizes.map((s, i) => <span key={i} className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded text-sm">{s.name} +€{s.price_adjustment}<button type="button" onClick={() => removeFromArray('sizes', i)} className="text-red-500"><X className="w-3 h-3"/></button></span>)}</div>
                <div className="flex gap-2"><Input placeholder="S,M,L" value={sizeInput.name} onChange={e => setSizeInput(s => ({...s, name: e.target.value}))} className="w-24"/><Input type="number" step="0.01" placeholder="+€" value={sizeInput.price_adjustment} onChange={e => setSizeInput(s => ({...s, price_adjustment: parseFloat(e.target.value) || 0}))} className="w-24"/><Button type="button" onClick={addSize} variant="outline" size="sm">+</Button></div>
              </div>
              
              {/* Customizations */}
              <div><Label className="font-semibold">Personalizações</Label>
                <div className="space-y-1 my-2">{form.customization_options.map((o, i) => <div key={i} className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded text-sm">{o.name_pt} ({o.type}){o.required && '*'}<button type="button" onClick={() => removeFromArray('customization_options', i)} className="text-red-500 ml-auto"><X className="w-3 h-3"/></button></div>)}</div>
                <div className="flex gap-2 items-center"><Input placeholder="Nome PT" value={customInput.name_pt} onChange={e => setCustomInput(c => ({...c, name_pt: e.target.value}))} className="w-24"/><Input placeholder="EN" value={customInput.name_en} onChange={e => setCustomInput(c => ({...c, name_en: e.target.value}))} className="w-20"/>
                  <Select value={customInput.type} onValueChange={v => setCustomInput(c => ({...c, type: v}))}><SelectTrigger className="w-20"><SelectValue/></SelectTrigger><SelectContent><SelectItem value="text">Text</SelectItem><SelectItem value="number">Num</SelectItem></SelectContent></Select>
                  <Switch checked={customInput.required} onCheckedChange={v => setCustomInput(c => ({...c, required: v}))}/><span className="text-xs">Obrig.</span><Button type="button" onClick={addCustom} variant="outline" size="sm">+</Button>
                </div>
              </div>
              
              {/* Images */}
              <div><Label className="font-semibold">Imagens</Label>
                <div className="flex flex-wrap gap-2 my-2">{form.images.map((img, i) => <div key={i} className="relative w-16 h-16 rounded overflow-hidden group"><img src={img} alt="" className="w-full h-full object-cover"/><button type="button" onClick={() => removeFromArray('images', i)} className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100"><X className="w-4 h-4 text-white"/></button></div>)}</div>
                <div className="flex gap-2"><Input placeholder="https://..." value={imageInput} onChange={e => setImageInput(e.target.value)} className="flex-1"/><Button type="button" onClick={addImg} variant="outline" size="sm">+</Button></div>
              </div>
              
              <div className="flex gap-4"><Switch checked={form.featured} onCheckedChange={v => setForm(f => ({...f, featured: v}))}/><Label>Destaque</Label><Switch checked={form.active} onCheckedChange={v => setForm(f => ({...f, active: v}))}/><Label>Ativo</Label></div>
              <Button type="submit" className="w-full bg-blue-600">{t('common.save')}</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

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
            {products.length === 0 ? <tr><td colSpan={5} className="px-4 py-8 text-center text-slate-500">{language === 'pt' ? 'Sem produtos' : 'No products'}</td></tr> : products.map(p => (
              <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                <td className="px-4 py-3"><div className="flex items-center gap-2">{(p.images && p.images[0]) && <img src={p.images[0]} alt="" className="w-10 h-10 rounded object-cover"/>}<span className="font-medium">{language === 'pt' ? p.name_pt : p.name_en}</span></div></td>
                <td className="px-4 py-3 text-sm text-slate-500">{catName(p.category_id)}</td>
                <td className="px-4 py-3 font-medium">€{p.base_price.toFixed(2)}</td>
                <td className="px-4 py-3"><Badge className={p.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>{p.active ? 'Ativo' : 'Inativo'}</Badge></td>
                <td className="px-4 py-3 text-right"><Button variant="ghost" size="icon" onClick={() => openEdit(p)}><Pencil className="w-4 h-4"/></Button><Button variant="ghost" size="icon" className="text-red-500" onClick={() => handleDelete(p.id)}><Trash2 className="w-4 h-4"/></Button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
