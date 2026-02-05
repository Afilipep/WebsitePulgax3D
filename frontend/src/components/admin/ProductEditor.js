import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { toast } from 'sonner';
import { Plus, X, Upload, Image, Palette, Ruler } from 'lucide-react';

export function ProductEditor({ product, categories, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    name_pt: '',
    name_en: '',
    description_pt: '',
    description_en: '',
    base_price: 0,
    category_id: '',
    featured: false,
    active: true,
    images: [],
    colors: [],
    sizes: [],
    customization_options: []
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name_pt: product.name_pt || '',
        name_en: product.name_en || '',
        description_pt: product.description_pt || '',
        description_en: product.description_en || '',
        base_price: product.base_price || 0,
        category_id: product.category_id || '',
        featured: product.featured || false,
        active: product.active !== false,
        images: product.images || [],
        colors: product.colors || [],
        sizes: product.sizes || [],
        customization_options: product.customization_options || []
      });
    }
  }, [product]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onSave(formData);
    } catch (error) {
      toast.error('Erro ao guardar produto');
    }
  };

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Image management
  const addImage = () => {
    const url = prompt('URL da imagem:');
    if (url) {
      updateField('images', [...formData.images, url]);
    }
  };

  const removeImage = (index) => {
    updateField('images', formData.images.filter((_, i) => i !== index));
  };

  // Color management
  const addColor = () => {
    const newColor = {
      name: '',
      hex_code: '#000000',
      image_url: ''
    };
    updateField('colors', [...formData.colors, newColor]);
  };

  const updateColor = (index, field, value) => {
    const newColors = [...formData.colors];
    newColors[index] = { ...newColors[index], [field]: value };
    updateField('colors', newColors);
  };

  const removeColor = (index) => {
    updateField('colors', formData.colors.filter((_, i) => i !== index));
  };

  // Size management
  const addSize = () => {
    const newSize = {
      name: '',
      dimensions: '',
      price_modifier: 0,
      image_url: ''
    };
    updateField('sizes', [...formData.sizes, newSize]);
  };

  const updateSize = (index, field, value) => {
    const newSizes = [...formData.sizes];
    newSizes[index] = { ...newSizes[index], [field]: value };
    updateField('sizes', newSizes);
  };

  const removeSize = (index) => {
    updateField('sizes', formData.sizes.filter((_, i) => i !== index));
  };

  // Customization options management
  const addCustomization = () => {
    const newOption = {
      name: '',
      price_modifier: 0
    };
    updateField('customization_options', [...formData.customization_options, newOption]);
  };

  const updateCustomization = (index, field, value) => {
    const newOptions = [...formData.customization_options];
    newOptions[index] = { ...newOptions[index], [field]: value };
    updateField('customization_options', newOptions);
  };

  const removeCustomization = (index) => {
    updateField('customization_options', formData.customization_options.filter((_, i) => i !== index));
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-slate-800 rounded-xl">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Info */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <Image className="w-5 h-5" />
            Informações Básicas
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Nome (Português) *</Label>
              <Input
                value={formData.name_pt}
                onChange={(e) => updateField('name_pt', e.target.value)}
                required
              />
            </div>
            <div>
              <Label>Nome (Inglês) *</Label>
              <Input
                value={formData.name_en}
                onChange={(e) => updateField('name_en', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Descrição (Português) *</Label>
              <Textarea
                value={formData.description_pt}
                onChange={(e) => updateField('description_pt', e.target.value)}
                rows={3}
                required
              />
            </div>
            <div>
              <Label>Descrição (Inglês) *</Label>
              <Textarea
                value={formData.description_en}
                onChange={(e) => updateField('description_en', e.target.value)}
                rows={3}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Preço Base (€) *</Label>
              <Input
                type="number"
                step="0.01"
                value={formData.base_price}
                onChange={(e) => updateField('base_price', parseFloat(e.target.value) || 0)}
                required
              />
            </div>
            <div>
              <Label>Categoria *</Label>
              <Select value={formData.category_id} onValueChange={(v) => updateField('category_id', v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar categoria..." />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(c => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name_pt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-6">
            <div className="flex items-center gap-2">
              <Switch
                checked={formData.featured}
                onCheckedChange={(v) => updateField('featured', v)}
              />
              <Label>Produto em Destaque</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={formData.active}
                onCheckedChange={(v) => updateField('active', v)}
              />
              <Label>Produto Ativo</Label>
            </div>
          </div>
        </div>

        {/* Product Images */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <Image className="w-5 h-5" />
              Imagens do Produto
            </h3>
            <Button type="button" onClick={addImage} size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Imagem
            </Button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {formData.images.map((image, index) => (
              <div key={index} className="relative group">
                <div className="aspect-square rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-700">
                  <img src={image} alt="" className="w-full h-full object-cover" />
                </div>
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Colors */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <Palette className="w-5 h-5" />
              Cores Disponíveis
            </h3>
            <Button type="button" onClick={addColor} size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Cor
            </Button>
          </div>
          
          <div className="space-y-3">
            {formData.colors.map((color, index) => (
              <div key={index} className="p-4 border border-slate-200 dark:border-slate-600 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                  <div>
                    <Label>Nome da Cor</Label>
                    <Input
                      value={color.name}
                      onChange={(e) => updateColor(index, 'name', e.target.value)}
                      placeholder="Ex: Azul Oceano"
                    />
                  </div>
                  <div>
                    <Label>Código da Cor</Label>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        value={color.hex_code}
                        onChange={(e) => updateColor(index, 'hex_code', e.target.value)}
                        className="w-16 h-10 p-1"
                      />
                      <Input
                        value={color.hex_code}
                        onChange={(e) => updateColor(index, 'hex_code', e.target.value)}
                        placeholder="#000000"
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Imagem da Cor (opcional)</Label>
                    <Input
                      value={color.image_url}
                      onChange={(e) => updateColor(index, 'image_url', e.target.value)}
                      placeholder="https://..."
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeColor(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                {color.image_url && (
                  <div className="mt-2">
                    <img src={color.image_url} alt={color.name} className="w-16 h-16 rounded object-cover" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Sizes */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <Ruler className="w-5 h-5" />
              Tamanhos Disponíveis
            </h3>
            <Button type="button" onClick={addSize} size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Tamanho
            </Button>
          </div>
          
          <div className="space-y-3">
            {formData.sizes.map((size, index) => (
              <div key={index} className="p-4 border border-slate-200 dark:border-slate-600 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                  <div>
                    <Label>Nome do Tamanho</Label>
                    <Input
                      value={size.name}
                      onChange={(e) => updateSize(index, 'name', e.target.value)}
                      placeholder="Ex: Grande (500ml)"
                    />
                  </div>
                  <div>
                    <Label>Dimensões</Label>
                    <Input
                      value={size.dimensions}
                      onChange={(e) => updateSize(index, 'dimensions', e.target.value)}
                      placeholder="Ex: 10x10x13cm"
                    />
                  </div>
                  <div>
                    <Label>Preço Extra (€)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={size.price_modifier}
                      onChange={(e) => updateSize(index, 'price_modifier', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div>
                    <Label>Imagem do Tamanho (opcional)</Label>
                    <Input
                      value={size.image_url}
                      onChange={(e) => updateSize(index, 'image_url', e.target.value)}
                      placeholder="https://..."
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeSize(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                {size.image_url && (
                  <div className="mt-2">
                    <img src={size.image_url} alt={size.name} className="w-16 h-16 rounded object-cover" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Customization Options */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              Opções de Personalização
            </h3>
            <Button type="button" onClick={addCustomization} size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Opção
            </Button>
          </div>
          
          <div className="space-y-3">
            {formData.customization_options.map((option, index) => (
              <div key={index} className="p-4 border border-slate-200 dark:border-slate-600 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                  <div>
                    <Label>Nome da Opção</Label>
                    <Input
                      value={option.name}
                      onChange={(e) => updateCustomization(index, 'name', e.target.value)}
                      placeholder="Ex: Texto personalizado"
                    />
                  </div>
                  <div>
                    <Label>Preço Extra (€)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={option.price_modifier}
                      onChange={(e) => updateCustomization(index, 'price_modifier', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeCustomization(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4 pt-6 border-t border-slate-200 dark:border-slate-600">
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
            Guardar Produto
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  );
}