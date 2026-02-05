import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { Layout } from '../components/layout/Layout';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { toast } from 'sonner';
import { ChevronLeft, Minus, Plus, ShoppingCart, Check } from 'lucide-react';
import api from '../api';

// Helper function to check if color is light
const isLightColor = (hex) => {
  if (!hex || hex.length < 7) return false;
  const c = hex.substring(1);
  const rgb = parseInt(c, 16);
  const r = (rgb >> 16) & 0xff;
  const g = (rgb >> 8) & 0xff;
  const b = (rgb >> 0) & 0xff;
  const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return luma > 128;
};

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [customizations, setCustomizations] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        console.log('Fetching product with ID:', id);
        const response = await api.getProduct(id);
        console.log('Product API response:', response);
        
        // Backend returns product directly, not wrapped in { data: ... }
        const data = response;
        setProduct(data);
        
        if (data.colors && data.colors.length > 0) {
          setSelectedColor(data.colors[0]);
          // Se a primeira cor tem imagem, define como imagem atual
          if (data.colors[0].image_url) {
            const productImages = data.images || [];
            const colorImages = (data.colors || []).map(c => c.image_url).filter(Boolean);
            const sizeImages = (data.sizes || []).map(s => s.image_url).filter(Boolean);
            const allImages = [...productImages, ...colorImages, ...sizeImages].filter((v, i, a) => a.indexOf(v) === i);
            const colorImageIndex = allImages.findIndex(img => img === data.colors[0].image_url);
            if (colorImageIndex !== -1) {
              setCurrentImageIndex(colorImageIndex);
            }
          }
        }
        if (data.sizes && data.sizes.length > 0) {
          setSelectedSize(data.sizes[0]);
        }
        // Initialize customizations
        const initCustom = {};
        if (data.customization_options) {
          data.customization_options.forEach(opt => {
            initCustom[opt.name] = '';
          });
        }
        setCustomizations(initCustom);
      } catch (error) {
        console.error('Error fetching product:', error);
        toast.error('Erro ao carregar produto');
        navigate('/products');
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      fetchProduct();
    }
  }, [id, navigate]);

  const handleColorSelect = (color, index) => {
    setSelectedColor(color);
    // Se a cor tem imagem específica, muda para essa imagem
    if (color.image_url) {
      setCurrentImageIndex(0); // Reset to first image, then find the color image
      const allImages = [...(product.images || []), ...(product.colors || []).map(c => c.image_url).filter(Boolean)];
      const colorImageIndex = allImages.findIndex(img => img === color.image_url);
      if (colorImageIndex !== -1) {
        setCurrentImageIndex(colorImageIndex);
      }
    }
  };

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
    // Se o tamanho tem imagem específica, muda para essa imagem
    if (size.image_url) {
      const allImages = [...(product.images || []), ...(product.colors || []).map(c => c.image_url).filter(Boolean), ...(product.sizes || []).map(s => s.image_url).filter(Boolean)];
      const sizeImageIndex = allImages.findIndex(img => img === size.image_url);
      if (sizeImageIndex !== -1) {
        setCurrentImageIndex(sizeImageIndex);
      }
    }
  };

  const handleAddToCart = () => {
    // Validate required customizations
    const opts = product.customization_options || [];
    for (let i = 0; i < opts.length; i++) {
      const opt = opts[i];
      const key = opt.name;
      if (opt.required && !customizations[key]) {
        const msg = language === 'pt' 
          ? `Por favor, preencha: ${opt.name}` 
          : `Please fill: ${opt.name}`;
        toast.error(msg);
        return;
      }
    }

    // Calculate customization price adjustments
    const customizationPriceAdjustments = {};
    opts.forEach(opt => {
      const customValue = customizations[opt.name];
      if (customValue && customValue.trim() !== '') {
        customizationPriceAdjustments[opt.name] = opt.price_modifier || 0;
      }
    });

    const cartItem = {
      product_id: product.id,
      name_pt: product.name_pt,
      name_en: product.name_en,
      price: product.base_price,
      image: selectedColor?.image_url || (product.images && product.images[0]) || '',
      quantity,
      selected_color: selectedColor?.name || null,
      selected_color_hex: selectedColor?.hex_code || null,
      selected_size: selectedSize?.name || null,
      size_price_adjustment: selectedSize?.price_modifier || 0,
      customizations: { ...customizations },
      customization_price_adjustments: customizationPriceAdjustments,
      final_unit_price: finalPrice // Store the calculated final price
    };

    addToCart(cartItem);
    toast.success(t('products.addedToCart'));
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full" />
        </div>
      </Layout>
    );
  }

  if (!product) return null;

  const name = language === 'pt' ? product.name_pt : product.name_en;
  const description = language === 'pt' ? product.description_pt : product.description_en;
  
  // Build all images with metadata (product images + color images + size images)
  const productImages = product.images || [];
  const colorImages = (product.colors || []).map(c => c.image_url).filter(Boolean);
  const sizeImages = (product.sizes || []).map(s => s.image_url).filter(Boolean);
  const allImages = [...productImages, ...colorImages, ...sizeImages].filter((v, i, a) => a.indexOf(v) === i);
  
  // Create image metadata to know which color/size each image belongs to
  const imageMetadata = allImages.map(imageUrl => {
    // Check if it's a color image
    const matchingColor = (product.colors || []).find(c => c.image_url === imageUrl);
    if (matchingColor) {
      return { imageUrl, type: 'color', data: matchingColor };
    }
    
    // Check if it's a size image
    const matchingSize = (product.sizes || []).find(s => s.image_url === imageUrl);
    if (matchingSize) {
      return { imageUrl, type: 'size', data: matchingSize };
    }
    
    // It's a product image
    return { imageUrl, type: 'product', data: null };
  });

  const handleThumbnailClick = (index) => {
    setCurrentImageIndex(index);
    
    const metadata = imageMetadata[index];
    if (metadata.type === 'color' && metadata.data) {
      // Auto-select the color associated with this image
      setSelectedColor(metadata.data);
    } else if (metadata.type === 'size' && metadata.data) {
      // Auto-select the size associated with this image
      setSelectedSize(metadata.data);
    }
  };
  
  const currentImage = allImages[currentImageIndex] || 'https://images.unsplash.com/photo-1690860938359-60128b9b9a2d?w=800';
  
  // Define product arrays first
  const productColors = product.colors || [];
  const productSizes = product.sizes || [];
  const productCustomOpts = product.customization_options || [];
  
  // Calculate price adjustments
  const sizeAdjust = selectedSize?.price_modifier || 0;
  
  // Calculate customization adjustments
  const customizationAdjust = productCustomOpts.reduce((total, opt) => {
    const customValue = customizations[opt.name];
    // Only add price if the customization field has content
    if (customValue && customValue.trim() !== '') {
      return total + (opt.price_modifier || 0);
    }
    return total;
  }, 0);
  
  const finalPrice = product.base_price + sizeAdjust + customizationAdjust;

  return (
    <Layout>
      <div className="min-h-screen bg-white dark:bg-slate-900" data-testid="product-detail-page">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back button */}
          <Link 
            to="/products"
            className="inline-flex items-center text-slate-600 dark:text-slate-400 hover:text-blue-600 mb-8"
            data-testid="back-to-products"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            {t('common.back')}
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Images */}
            <div className="space-y-4">
              <div className="aspect-square rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800">
                <img 
                  src={currentImage}
                  alt={name}
                  className="w-full h-full object-cover"
                  data-testid="product-main-image"
                />
              </div>
              
              {/* Thumbnails */}
              {allImages.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {allImages.map((img, index) => {
                    const metadata = imageMetadata[index];
                    const isColorImage = metadata.type === 'color';
                    const isSizeImage = metadata.type === 'size';
                    
                    return (
                      <button
                        key={index}
                        onClick={() => handleThumbnailClick(index)}
                        className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all relative ${
                          currentImageIndex === index 
                            ? 'border-blue-600 scale-105 shadow-lg' 
                            : 'border-transparent hover:border-slate-300 hover:scale-102'
                        }`}
                        data-testid={`thumbnail-${index}`}
                        title={
                          isColorImage ? `Clique para selecionar cor: ${metadata.data.name}` :
                          isSizeImage ? `Clique para selecionar tamanho: ${metadata.data.name}` :
                          'Imagem do produto'
                        }
                      >
                        <img src={img} alt="" className="w-full h-full object-cover" />
                        
                        {/* Visual indicator for color/size images */}
                        {isColorImage && (
                          <div className="absolute bottom-1 left-1 w-3 h-3 rounded-full border border-white shadow-sm"
                               style={{ backgroundColor: metadata.data.hex_code }}
                          />
                        )}
                        {isSizeImage && (
                          <div className="absolute bottom-1 right-1 bg-blue-600 text-white text-xs px-1.5 py-0.5 rounded font-medium shadow-sm">
                            {metadata.data.name.split(' ')[0].charAt(0)}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              {product.featured && (
                <Badge className="bg-blue-600">{t('products.featured')}</Badge>
              )}
              
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white" data-testid="product-name">
                {name}
              </h1>
              
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {description}
              </p>

              {/* Price */}
              <div className="space-y-2">
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-bold text-slate-900 dark:text-white" data-testid="product-price">
                    €{finalPrice.toFixed(2)}
                  </span>
                  {(sizeAdjust > 0 || customizationAdjust > 0) && (
                    <span className="text-sm text-slate-500">
                      ({t('common.from')} €{product.base_price.toFixed(2)})
                    </span>
                  )}
                </div>
                
                {/* Price breakdown */}
                {(sizeAdjust > 0 || customizationAdjust > 0) && (
                  <div className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                    <div>Preço base: €{product.base_price.toFixed(2)}</div>
                    {sizeAdjust > 0 && (
                      <div>Tamanho ({selectedSize?.name}): +€{sizeAdjust.toFixed(2)}</div>
                    )}
                    {customizationAdjust > 0 && (
                      <div>Personalizações: +€{customizationAdjust.toFixed(2)}</div>
                    )}
                  </div>
                )}
              </div>

              {/* Colors */}
              {productColors.length > 0 && (
                <div className="space-y-3">
                  <Label className="text-slate-900 dark:text-white font-medium">
                    {t('products.color')}: {selectedColor && selectedColor.name}
                  </Label>
                  <div className="flex flex-wrap gap-3">
                    {productColors.map((color, index) => (
                      <button
                        key={index}
                        onClick={() => handleColorSelect(color, index)}
                        className={`relative w-10 h-10 rounded-full border-2 transition-all ${
                          selectedColor?.hex_code === color.hex_code
                            ? 'border-blue-600 scale-110'
                            : 'border-slate-200 dark:border-slate-600 hover:scale-105'
                        }`}
                        style={{ backgroundColor: color.hex_code }}
                        title={color.name}
                        data-testid={`color-${color.hex_code}`}
                      >
                        {selectedColor?.hex_code === color.hex_code && (
                          <Check className={`absolute inset-0 m-auto w-5 h-5 ${
                            isLightColor(color.hex_code) ? 'text-slate-900' : 'text-white'
                          }`} />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Sizes */}
              {productSizes.length > 0 && (
                <div className="space-y-3">
                  <Label className="text-slate-900 dark:text-white font-medium">
                    {t('products.size')}
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {productSizes.map((size, index) => (
                      <button
                        key={index}
                        onClick={() => handleSizeSelect(size)}
                        className={`px-4 py-3 rounded-lg border-2 font-medium transition-all ${
                          selectedSize?.name === size.name
                            ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/30 text-blue-600'
                            : 'border-slate-200 dark:border-slate-600 hover:border-blue-300'
                        }`}
                        data-testid={`size-${size.name}`}
                      >
                        <div className="flex items-center gap-2">
                          {size.image_url && (
                            <div className="w-6 h-6 rounded border border-slate-300 overflow-hidden">
                              <img src={size.image_url} alt={size.name} className="w-full h-full object-cover" />
                            </div>
                          )}
                          <div className="text-left">
                            <div>{size.name}</div>
                            {size.price_modifier > 0 && (
                              <div className="text-xs text-slate-500">
                                +€{size.price_modifier.toFixed(2)}
                              </div>
                            )}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Customizations */}
              {productCustomOpts.length > 0 && (
                <div className="space-y-4">
                  <Label className="text-slate-900 dark:text-white font-medium">
                    {t('products.customization')}
                  </Label>
                  {productCustomOpts.map((opt, index) => (
                    <div key={index} className="space-y-2">
                      <Label className="text-sm">
                        {opt.name}
                        {opt.required && <span className="text-red-500 ml-1">*</span>}
                        {opt.price_modifier > 0 && (
                          <span className="text-xs text-slate-500 ml-2">
                            (+€{opt.price_modifier.toFixed(2)})
                          </span>
                        )}
                      </Label>
                      <Input
                        type={opt.type === 'number' ? 'number' : 'text'}
                        value={customizations[opt.name] || ''}
                        onChange={(e) => setCustomizations(prev => ({
                          ...prev,
                          [opt.name]: e.target.value
                        }))}
                        maxLength={opt.max_length || undefined}
                        placeholder={opt.name}
                        data-testid={`customization-${index}`}
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Quantity */}
              <div className="space-y-3">
                <Label className="text-slate-900 dark:text-white font-medium">
                  {t('products.quantity')}
                </Label>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    data-testid="quantity-decrease"
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="w-12 text-center font-semibold text-lg" data-testid="quantity-value">
                    {quantity}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(q => q + 1)}
                    data-testid="quantity-increase"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Add to Cart */}
              <Button
                size="lg"
                className="w-full bg-blue-600 hover:bg-blue-700 h-14 text-lg"
                onClick={handleAddToCart}
                data-testid="add-to-cart-btn"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                {t('products.addToCart')} - €{(finalPrice * quantity).toFixed(2)}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
