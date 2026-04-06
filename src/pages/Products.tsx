import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Category, Product } from '../types';
import { useSearchParams } from 'react-router-dom';
import { ProductCard } from '../components/ProductCard';
import { SlidersHorizontal, ChevronDown } from 'lucide-react';
import { SEO } from '../components/SEO';
import { buildFAQSchema } from '../lib/schema';

/* ── US-012: SEO-optimized FAQ content for Products page ──────── */
const PRODUCT_FAQS = [
  {
    question: 'Which air compressor is best for industrial use?',
    answer: 'For industrial use, screw compressors are the most popular choice due to their continuous duty cycle, energy efficiency, and low noise. Everest HPS offers screw compressors from 5 HP to 100 HP, covering small workshops to large manufacturing plants. Oil-free models are recommended for food, pharma, and dental industries.',
  },
  {
    question: 'Do you provide free installation with compressor purchase?',
    answer: 'Yes. Every air compressor purchased from Everest HPS includes free on-site installation and commissioning by our trained engineers. We also provide a free first servicing to ensure your equipment runs optimally from day one.',
  },
  {
    question: 'What is the price range of industrial air compressors?',
    answer: 'Industrial air compressor prices at Everest HPS start from approximately Rs 12,000 for small reciprocating units and go up to Rs 8,00,000+ for high-capacity screw compressors. Pricing varies based on HP, tank size, technology (oil-free vs lubricated), and configuration. Contact us for an exact quote.',
  },
  {
    question: 'Do you deliver air compressors across India?',
    answer: 'Absolutely. Everest HPS offers pan-India delivery with careful packaging and logistics tracking. Whether you are in Pune, Mumbai, Delhi, Bangalore, or any part of India, we ensure safe and timely delivery to your doorstep.',
  },
  {
    question: 'How do I choose the right compressor capacity (CFM/HP)?',
    answer: 'Choosing the right capacity depends on your air demand (CFM), required working pressure (PSI/bar), duty cycle, and application type. Our team conducts a free consultation to assess your needs and recommend the ideal HP, tank size, and dryer configuration. Contact us for a personalised recommendation.',
  },
];

const faqSchema = buildFAQSchema(PRODUCT_FAQS);

export function Products() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [catRes, prodRes] = await Promise.all([
        supabase.from('categories').select('*').order('sort_order'),
        supabase.from('products').select('*').order('sort_order')
      ]);

      if (catRes.data) setCategories(catRes.data);
      if (prodRes.data) setProducts(prodRes.data);
      setLoading(false);
    };

    fetchData();
  }, []);

  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat !== null) {
      setSelectedCategory(cat);
    } else {
      setSelectedCategory('');
    }
  }, [searchParams]);

  const handleCategorySelect = (slug: string) => {
    if (slug) {
      setSearchParams({ category: slug });
    } else {
      setSearchParams({});
    }
    setSidebarOpen(false);
  };

  const filteredProducts = selectedCategory
    ? products.filter((p: Product) => {
      const cat = categories.find((c: Category) => c.slug === selectedCategory);
      return cat && p.category_id === cat.id;
    })
    : products;

  const selectedCategoryName = categories.find((c: Category) => c.slug === selectedCategory)?.name;

  return (
    <div className="min-h-screen bg-gray-50">

      <SEO
        title="Industrial Air Compressors & Pneumatic Equipment | Everest HPS"
        description="Browse 50+ industrial air compressors, screw, oil-free, dental & material handling equipment. Competitive prices & free installation from Everest HPS, Pune."
        canonical="/products"
        schemas={[faqSchema]}
      />

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
            className={`${sidebarOpen ? 'block' : 'hidden'
              } md:block w-full md:w-48 shrink-0`}
          >
            <div className="bg-gray-100 border border-neutral-200 shadow-sm rounded-xl p-4 sticky top-24">
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">Category</p>
              <div className="flex flex-col gap-0.5">
                <button
                  onClick={() => handleCategorySelect('')}
                  className={`text-left px-3 py-2 rounded-lg text-sm transition-colors ${!selectedCategory
                    ? 'bg-[#0f3460] text-white font-semibold'
                    : 'text-gray-600 hover:bg-gray-100'
                    }`}
                >
                  All Products
                </button>
                {categories.map((cat: Category) => (
                  <button
                    key={cat.id}
                    onClick={() => handleCategorySelect(cat.slug)}
                    className={`text-left px-3 py-2 rounded-lg text-sm transition-colors leading-snug ${selectedCategory === cat.slug
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
                {loading ? '…' : `${filteredProducts.length} product${filteredProducts.length !== 1 ? 's' : ''}`}
                {selectedCategoryName && <span className="font-medium text-gray-700"> in {selectedCategoryName}</span>}
              </p>
            </div>

            {loading ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white border border-gray-100 rounded-xl h-64 animate-pulse" />
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-20 text-gray-400 bg-neutral-50 shadow-sm rounded-xl border border-neutral-200">
                <p className="text-sm">No products found in this category.</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredProducts.map((product: Product) => {
                  const cat = categories.find((c: Category) => c.id === product.category_id);
                  return <ProductCard key={product.id} product={product} categoryName={cat?.name} />;
                })}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* ── US-012: FAQ Section ── */}
      <section className="py-14 bg-white border-t border-gray-100">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-8">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#e94560] mb-1">Common questions</p>
            <h2 className="text-2xl font-bold text-gray-900">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-2">
            {PRODUCT_FAQS.map((faq, i) => (
              <div key={i} className="border border-gray-100 rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenFAQ(openFAQ === i ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="font-medium text-sm text-gray-900 pr-4">{faq.question}</span>
                  <ChevronDown
                    size={18}
                    className={`text-gray-400 flex-shrink-0 transition-transform duration-200 ${openFAQ === i ? 'rotate-180' : ''}`}
                  />
                </button>
                {openFAQ === i && (
                  <div className="px-5 pb-4 text-sm text-gray-600 leading-relaxed border-t border-gray-50 pt-3">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
