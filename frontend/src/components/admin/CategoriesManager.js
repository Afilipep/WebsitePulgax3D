import { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { toast } from 'sonner';
import axios from 'axios';
import { Plus, Pencil, Trash2 } from 'lucide-react';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export function CategoriesManager({ categories, token, onUpdate }) {
  const { t, language } = useLanguage();
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

  const openNew = () => {
    setEditingCategory(null);
    setForm({ name_pt: '', name_en: '', description_pt: '', description_en: '', image_url: '' });
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
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={openNew} data-testid="add-category-btn">
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
                <th className="px-6 py-4 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {categories.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
                    {language === 'pt' ? 'Nenhuma categoria encontrada' : 'No categories found'}
                  </td>
                </tr>
              ) : categories.map((category) => (
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
                      <Button variant="ghost" size="icon" onClick={() => openEdit(category)}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600" onClick={() => handleDelete(category.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
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
