import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { Layout } from '../components/layout/Layout';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import axios from 'axios';
import { Search, Filter, ShoppingBag } from 'lucide-react';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function ProductsPage() {
  const { t, language } = useLanguage();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          axios.get(`${API}/products`),
          axios.get(`${API}/categories`)
        ]);
        setProducts(productsRes.data);
        setCategories(categoriesRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category_id === selectedCategory;
    const name = language === 'pt' ? product.name_pt : product.name_en;
    const matchesSearch = name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCategoryName = (categoryId) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? (language === 'pt' ? category.name_pt : category.name_en) : '';
  };

  return (
    <Layout>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900" data-testid="products-page">
        {/* Header */}
        <div className="bg-slate-900 py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
              {t('products.title')}
            </h1>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              {t('products.subtitle')}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input
                placeholder={t('common.search')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                data-testid="search-input"
              />
            </div>

            {/* Categories */}
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedCategory === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory('all')}
                className={selectedCategory === 'all' ? 'bg-blue-600 hover:bg-blue-700' : ''}
                data-testid="category-all"
              >
                {t('products.all')}
              </Button>
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className={selectedCategory === category.id ? 'bg-blue-600 hover:bg-blue-700' : ''}
                  data-testid={`category-${category.id}`}
                >
                  {language === 'pt' ? category.name_pt : category.name_en}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white dark:bg-slate-800 rounded-xl p-4 animate-pulse">
                  <div className="aspect-square bg-slate-200 dark:bg-slate-700 rounded-lg mb-4" />
                  <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded mb-2" />
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-2/3" />
                </div>
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-16">
              <ShoppingBag className="w-16 h-16 mx-auto text-slate-300 dark:text-slate-600 mb-4" />
              <p className="text-slate-500 dark:text-slate-400 text-lg">
                {t('products.noProducts')}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  categoryName={getCategoryName(product.category_id)}
                  language={language}
                  t={t}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

const ProductCard = ({ product, categoryName, language, t }) => {
  const [currentImage, setCurrentImage] = useState(0);
  const name = language === 'pt' ? product.name_pt : product.name_en;
  const mainImage = product.images?.[currentImage] || product.colors?.[0]?.image_url || 'https://images.unsplash.com/photo-1690860938359-60128b9b9a2d?w=400';

  return (
    <Link 
      to={`/products/${product.id}`}
      className="group bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl overflow-hidden hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-slate-900/50 transition-all duration-300"
      data-testid={`product-card-${product.id}`}
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-slate-100 dark:bg-slate-700">
        <img 
          src={mainImage}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {product.featured && (
          <Badge className="absolute top-3 left-3 bg-blue-600">
            {t('products.featured')}
          </Badge>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {categoryName && (
          <span className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            {categoryName}
          </span>
        )}
        <h3 className="font-semibold text-slate-900 dark:text-white mt-1 mb-2 group-hover:text-blue-600 transition-colors">
          {name}
        </h3>
        
        {/* Colors */}
        {product.colors?.length > 0 && (
          <div className="flex gap-1 mb-3">
            {product.colors.slice(0, 5).map((color, index) => (
              <button
                key={index}
                className="w-5 h-5 rounded-full border-2 border-white dark:border-slate-700 shadow-sm"
                style={{ backgroundColor: color.hex_code }}
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentImage(index);
                }}
              />
            ))}
            {product.colors.length > 5 && (
              <span className="text-xs text-slate-400">+{product.colors.length - 5}</span>
            )}
          </div>
        )}

        <div className="flex items-center justify-between">
          <span className="font-bold text-lg text-slate-900 dark:text-white">
            €{product.base_price.toFixed(2)}
          </span>
          <span className="text-sm text-blue-600 font-medium group-hover:underline">
            {t('products.viewDetails')} →
          </span>
        </div>
      </div>
    </Link>
  );
};
