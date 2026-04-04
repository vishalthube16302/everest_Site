import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Category, Product } from '../types';
import { useSearchParams } from 'react-router-dom';
import { ProductCard } from '../components/ProductCard';
import { SlidersHorizontal } from 'lucide-react';

export function Products() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    supabase.from('categories').select('*').order('sort_order').then(({ data }) => {
      if (data) setCategories(data);
    });
  }, []);

  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) setSelectedCategory(cat);
  }, [searchParams]);

  useEffect(() => {
    if (categories.length === 0 && selectedCategory) return;
    setLoading(true);
    let query = supabase.from('products').select('*').order('sort_order');
    if (selectedCategory) {
      const found = categories.find((c) => c.slug === selectedCategory);
      if (found) query = query.eq('category_id', found.id);
    }
    query.then(({ data }) => {
      if (data) setProducts(data);
      setLoading(false);
    });
  }, [categories, selectedCategory]);

  const selectedCategoryName = categories.find((c) => c.slug === selectedCategory)?.name;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-[#0f3460] py-10">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-[#e94560] text-xs font-semibold uppercase tracking-widest mb-1">Our catalogue</p>
          <h1 className="text-3xl font-bold text-white">Products</h1>
          <p className="text-blue-200 text-sm mt-1">Air compressors &amp; material handling equipment</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Mobile filter toggle */}
        <div className="md:hidden mb-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700"
          >
            <SlidersHorizontal size={16} />
            {selectedCategory ? selectedCategoryName : 'All Categories'}
          </button>
        </div>

        <div className="flex gap-8">
          {/* Sidebar */}
          <aside
            className={`${
              sidebarOpen ? 'block' : 'hidden'
            } md:block w-full md:w-48 shrink-0`}
          >
            <div className="bg-white border border-gray-100 rounded-xl p-4 sticky top-24">
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">Category</p>
              <div className="flex flex-col gap-0.5">
                <button
                  onClick={() => { setSelectedCategory(''); setSidebarOpen(false); }}
                  className={`text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    !selectedCategory
                      ? 'bg-[#0f3460] text-white font-semibold'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  All Products
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => { setSelectedCategory(cat.slug); setSidebarOpen(false); }}
                    className={`text-left px-3 py-2 rounded-lg text-sm transition-colors leading-snug ${
                      selectedCategory === cat.slug
                        ? 'bg-[#0f3460] text-white font-semibold'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Product grid */}
          <main className="flex-1 min-w-0">
            {/* Result header */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-500">
                {loading ? '…' : `${products.length} product${products.length !== 1 ? 's' : ''}`}
                {selectedCategoryName && <span className="font-medium text-gray-700"> in {selectedCategoryName}</span>}
              </p>
            </div>

            {loading ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white border border-gray-100 rounded-xl h-64 animate-pulse" />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20 text-gray-400 bg-white rounded-xl border border-gray-100">
                <p className="text-sm">No products found in this category.</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map((product) => {
                  const cat = categories.find((c) => c.id === product.category_id);
                  return <ProductCard key={product.id} product={product} categoryName={cat?.name} />;
                })}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
