import { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, Package } from 'lucide-react';
import { ProductEditor } from './ProductEditor';
import api from '../../api';

export function ProductsManager({ products, categories, onUpdate }) {
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Safe fallbacks for arrays
  const safeProducts = Array.isArray(products) ? products : [];
  const safeCategories = Array.isArray(categories) ? categories : [];

  const handleSave = async (productData) => {
    try {
      if (editingProduct) {
        await api.updateProduct(editingProduct.id, productData);
        toast.success('Produto atualizado com sucesso!');
      } else {
        await api.createProduct(productData);
        toast.success('Produto criado com sucesso!');
      }
      
      setIsOpen(false);
      setEditingProduct(null);
      onUpdate();
    } catch (error) {
      console.error('Error saving product:', error);
      throw error;
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setIsOpen(true);
  };

  const handleNew = () => {
    setEditingProduct(null);
    setIsOpen(true);
  };

  const handleCancel = () => {
    setIsOpen(false);
    setEditingProduct(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Tem a certeza que deseja eliminar este produto?')) return;
    
    try {
      await api.deleteProduct(id);
      toast.success('Produto eliminado com sucesso!');
      onUpdate();
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Erro ao eliminar produto');
    }
  };

  const getCategoryName = (categoryId) => {
    const category = safeCategories.find(c => c.id === categoryId);
    return category ? (language === 'pt' ? category.name_pt : category.name_en) : '-';
  };

  return (
    <div className="space-y-6" data-testid="products-tab">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          Gestão de Produtos
        </h2>
        <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleNew}>
          <Plus className="w-4 h-4 mr-2" />
          Adicionar Produto
        </Button>
      </div>

      {/* Product Editor Modal */}
      <Dialog open={isOpen} onOpenChange={(open) => !open && handleCancel()}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingProduct ? 'Editar Produto' : 'Adicionar Produto'}
            </DialogTitle>
          </DialogHeader>
          <ProductEditor
            product={editingProduct}
            categories={safeCategories}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        </DialogContent>
      </Dialog>

      {/* Products Table */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 dark:bg-slate-700">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">
                  Produto
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">
                  Categoria
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">
                  Preço
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">
                  Opções
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">
                  Estado
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {safeProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    <Package className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                    <p>Nenhum produto encontrado</p>
                  </td>
                </tr>
              ) : (
                safeProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {Array.isArray(product.images) && product.images[0] && (
                          <img
                            src={product.images[0]}
                            alt=""
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                        )}
                        <div>
                          <p className="font-medium text-slate-900 dark:text-white">
                            {language === 'pt' ? product.name_pt : product.name_en}
                          </p>
                          <p className="text-sm text-slate-500">
                            {Array.isArray(product.images) ? product.images.length : 0} imagens
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      {getCategoryName(product.category_id)}
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                      €{(product.base_price || 0).toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-1">
                        {Array.isArray(product.colors) && product.colors.length > 0 && (
                          <Badge variant="outline" className="text-xs">
                            {product.colors.length} cores
                          </Badge>
                        )}
                        {Array.isArray(product.sizes) && product.sizes.length > 0 && (
                          <Badge variant="outline" className="text-xs">
                            {product.sizes.length} tamanhos
                          </Badge>
                        )}
                        {Array.isArray(product.customization_options) && product.customization_options.length > 0 && (
                          <Badge variant="outline" className="text-xs">
                            {product.customization_options.length} personalizações
                          </Badge>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-1">
                        <Badge className={product.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                          {product.active ? 'Ativo' : 'Inativo'}
                        </Badge>
                        {product.featured && (
                          <Badge className="bg-blue-100 text-blue-800">
                            Destaque
                          </Badge>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(product)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(product.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
