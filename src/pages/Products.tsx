import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Category, Product } from '../types';
import { useSearchParams, Link } from 'react-router-dom';
import { ShareButton } from '../components/ShareButton';

export function Products() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await supabase.from('categories').select('*').order('sort_order');
      if (data) setCategories(data);
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    // Sync URL param with state on mount or URL change
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      let query = supabase.from('products').select('*').order('sort_order');

      if (selectedCategory) {
        const category = categories.find((c) => c.slug === selectedCategory);
        if (category) {
          query = query.eq('category_id', category.id);
        }
      }

      const { data } = await query;
      if (data) setProducts(data);
      setLoading(false);
    };

    // Only fetch if categories are loaded (unless we don't need categories for 'All Products', but we need them to resolve slug to ID)
    // Actually, if selectedCategory is empty, we don't need categories to fetch all products.
    // But if selectedCategory is set, we need categories to find the ID.
    if (categories.length > 0 || !selectedCategory) {
      fetchProducts();
    }
  }, [categories, selectedCategory]);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Our Products</h1>
          <p className="text-xl text-blue-100">Quality hydraulic and pneumatic components for every application</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <h3 className="font-bold text-lg mb-4">Categories</h3>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => {
                  setSelectedCategory('');
                  setProducts([]);
                }}
                className={`text-left px-4 py-2 rounded-lg transition-colors ${!selectedCategory ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'
                  }`}
              >
                All Products
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.slug)}
                  className={`text-left px-4 py-2 rounded-lg transition-colors ${selectedCategory === category.slug ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'
                    }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* Products Grid */}
          <div className="md:col-span-3">
            {loading ? (
              <div className="text-center py-12">Loading products...</div>
            ) : products.length === 0 ? (
              <div className="text-center py-12 text-gray-600">No products found in this category</div>
            ) : (
              <div className="grid md:grid-cols-3 gap-6">
                {products.map((product) => (
                  <div key={product.id} className="relative bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="absolute top-2 right-2 z-10 bg-white rounded-full shadow-md">
                      <ShareButton
                        productName={product.name}
                        url={`${window.location.origin}/products/${product.slug}`}
                        description={product.description}
                        specifications={product.specifications}
                        imageUrl={product.image_url}
                      />
                    </div>
                    <Link to={`/products/${product.slug}`} className="block">
                      <div className="h-48 bg-gray-200 overflow-hidden">
                        {product.image_url ? (
                          <img
                            src={product.image_url}
                            alt={product.name}
                            className="w-full h-full object-cover hover:scale-105 transition-transform"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-blue-300 to-blue-500"></div>
                        )}
                      </div>
                    </Link>
                    <div className="p-4">
                      <Link to={`/products/${product.slug}`}>
                        <h3 className="font-bold text-lg mb-2 hover:text-blue-600 transition-colors">{product.name}</h3>
                      </Link>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
                      {product.price_range && <p className="text-blue-600 font-semibold mb-4">{product.price_range}</p>}
                      <Link
                        to={`/products/${product.slug}`}
                        className="w-full block text-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
