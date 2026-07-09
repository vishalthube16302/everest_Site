import { useEffect, useState } from 'react';
import { ArrowRight, Zap, Shield, Truck, Wrench, ChevronDown } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Category, Testimonial, SiteSettings, Product } from '../types';
import { Link } from 'react-router-dom';
import { ProductCard } from '../components/ProductCard';
import { truncate } from '../lib/format';
import { SEO } from '../components/SEO';

export function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const [settingsRes, categoriesRes, testimonialsRes, productsRes] = await Promise.all([
        supabase.from('site_settings').select('*').limit(1).maybeSingle(),
        supabase.from('categories').select('*').order('sort_order'),
        supabase.from('testimonials').select('*').eq('is_active', true).order('sort_order'),
        supabase.from('products').select('*').eq('is_featured', true).order('sort_order').limit(6),
      ]);
      if (settingsRes.data) setSettings(settingsRes.data);
      if (categoriesRes.data) setCategories(categoriesRes.data);
      if (testimonialsRes.data) setTestimonials(testimonialsRes.data);
      if (productsRes.data) setFeaturedProducts(productsRes.data);
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-navy border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const primary = settings?.primary_color || '#0f3460';
  const accent = settings?.accent_color || '#e94560';

  const features = [
    { icon: Zap, label: 'Wide Range', desc: '50+ product models' },
    { icon: Shield, label: 'Quality Tested', desc: 'ISO-grade standards' },
    { icon: Truck, label: 'Fast Delivery', desc: 'Pan-India shipping' },
    { icon: Wrench, label: 'Free Setup', desc: 'Installation included' },
  ];

  const industries = ['Manufacturing', 'Automotive', 'Dental & Medical', 'Construction', 'Packaging'];

  return (
    <div className="min-h-screen bg-white">
      <SEO
        title="Air Compressor Supplier Pune | Everest Hydro Pneumatic Solutions"
        description="Manufacturer & supplier of industrial air compressors, screw & oil-free compressors, and material handling equipment in Pune. Free pan-India delivery."
        canonical="/"
      />

      {/* Hero */}
      <section className="relative min-h-[68vh] flex flex-col justify-center overflow-hidden" style={{ backgroundColor: primary }}>
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: `repeating-linear-gradient(0deg,#fff 0,#fff 1px,transparent 1px,transparent 40px),repeating-linear-gradient(90deg,#fff 0,#fff 1px,transparent 1px,transparent 40px)` }} aria-hidden="true" />
        <div className="relative max-w-7xl mx-auto px-4 py-20 md:py-28 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest px-3 py-1.5 rounded-full mb-6 border" style={{ color: accent, borderColor: `${accent}40`, backgroundColor: `${accent}15` }}>
              Established 2020 · Pune, India
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-white leading-[1.15] mb-4 tracking-tight">
              {settings?.tagline || 'Engineering Power. Delivering Trust.'}
            </h1>
            <p className="text-blue-200 text-base md:text-lg leading-relaxed mb-8 max-w-md">
              Manufacturer &amp; supplier of industrial air compressors and material handling equipment — built for performance, priced for value.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/products" className="inline-flex items-center gap-2 px-5 py-3 font-semibold text-sm rounded-lg text-white shadow-premium-md transition-all hover:opacity-90 hover:-translate-y-0.5" style={{ backgroundColor: accent }}>
                Explore Products <ArrowRight size={16} />
              </Link>
              <Link to="/about" className="inline-flex items-center gap-2 px-5 py-3 font-semibold text-sm rounded-lg border border-white/30 text-white hover:bg-white/10 transition-colors">
                About Us
              </Link>
            </div>
          </div>
          <div className="hidden md:grid grid-cols-2 gap-4">
            {[{ num: '50+', label: 'Product Models' }, { num: '5+', label: 'Years Experience' }, { num: '200+', label: 'Happy Clients' }, { num: '100%', label: 'Free Installation' }].map((s) => (
              <div key={s.label} className="rounded-xl p-5 border border-white/10 backdrop-blur-sm" style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}>
                <div className="font-display text-3xl font-bold text-white mb-1">{s.num}</div>
                <div className="text-blue-300 text-sm">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce" aria-hidden="true">
          <ChevronDown size={20} className="text-white/40" />
        </div>
      </section>

      {/* Feature strip */}
      <section className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-gray-100">
            {features.map(({ icon: Icon, label, desc }) => (
              <div key={label} className="flex items-center gap-4 px-6 py-5 transition-colors hover:bg-gray-50">
                <div className="shrink-0 w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${primary}12` }}>
                  <Icon size={20} style={{ color: primary }} aria-hidden="true" />
                </div>
                <div>
                  <div className="font-display font-semibold text-gray-900 text-sm">{label}</div>
                  <div className="text-xs text-gray-500">{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product categories */}
      {categories.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: accent }}>What we offer</p>
                <h2 className="font-display section-heading text-2xl font-bold text-gray-900 pb-2">Product Categories</h2>
              </div>
              <Link to="/products" className="hidden md:flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
                All products <ArrowRight size={14} />
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {categories.map((cat) => (
                <Link key={cat.id} to={`/products?category=${cat.slug}`}
                  className="group bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-premium-sm hover:shadow-premium-md hover:-translate-y-1 transition-all duration-300">
                  {/* Fix: category photos are product shots (square/portrait), not wide
                      banners. object-cover in a short fixed-height box was cropping
                      the tops/bottoms of the machines. object-contain + padding on a
                      taller, aspect-ratio-locked box shows the full image every time. */}
                  <div className="aspect-[4/3] bg-gray-50 relative overflow-hidden">
                    {cat.image_url ? (
                      <img
                        src={cat.image_url}
                        /* Fix 5: keyword-rich alt with location */
                        alt={`${cat.name} — Everest HPS air compressor supplier Pune`}
                        width="400"
                        height="300"
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-contain p-5 group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full" style={{ background: `linear-gradient(135deg, ${primary}15, ${primary}30)` }} aria-hidden="true" />
                    )}
                  </div>
                  <div className="p-5 border-t border-gray-100">
                    <h3 className="font-display font-semibold text-gray-900 text-sm mb-1.5 group-hover:text-navy transition-colors">{cat.name}</h3>
                    <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed mb-3">{truncate(cat.description, 80)}</p>
                    <span className="inline-flex items-center gap-1 text-xs font-semibold" style={{ color: accent }}>
                      View range <ArrowRight size={12} />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured products */}
      {featuredProducts.length > 0 && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: accent }}>Bestsellers</p>
                <h2 className="font-display section-heading text-2xl font-bold text-gray-900 pb-2">Featured Products</h2>
              </div>
              <Link to="/products" className="hidden md:flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
                View all <ArrowRight size={14} />
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {featuredProducts.map((product) => {
                const cat = categories.find((c) => c.id === product.category_id);
                return <ProductCard key={product.id} product={product} categoryName={cat?.name} />;
              })}
            </div>
            <div className="mt-8 text-center md:hidden">
              <Link to="/products" className="inline-flex items-center gap-2 px-5 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:border-gray-300 transition-colors">
                View all products <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Industries */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-center text-xs font-semibold uppercase tracking-widest text-gray-400 mb-6">Industries we serve</p>
          <div className="flex flex-wrap justify-center gap-3">
            {industries.map((ind) => (
              <span key={ind} className="px-4 py-2 rounded-full text-sm font-medium border transition-colors hover:shadow-premium-sm" style={{ borderColor: `${primary}30`, color: primary, backgroundColor: `${primary}08` }}>{ind}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Why Everest */}
      <section className="py-16" style={{ background: `linear-gradient(135deg, ${primary}, ${primary}dd 60%, ${primary}bb)` }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: accent }}>Why choose us</p>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-white mb-4">Built for Industry. Backed by Expertise.</h2>
              <p className="text-blue-200 text-sm leading-relaxed">From free installation to the first free servicing — we stand behind every machine we deliver.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {['Free installation & commissioning', 'First servicing at no labour cost', 'Pan-India delivery network', 'Customised HP & tank configurations', '3 HP – 75 HP compressor range', 'ISO-grade quality assurance'].map((item) => (
                <div key={item} className="flex items-start gap-3 p-3 rounded-lg" style={{ backgroundColor: 'rgba(255,255,255,0.07)' }}>
                  <span className="shrink-0 mt-0.5 text-xs font-bold" style={{ color: accent }} aria-hidden="true">✓</span>
                  <span className="text-blue-100 text-sm">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <section className="py-14 bg-gradient-to-b from-gray-50 to-white">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-10">
              <p className="text-[11px] font-semibold tracking-[2px] uppercase mb-2" style={{ color: accent }}>CLIENT REVIEWS</p>
              <h2 className="font-display text-2xl font-semibold text-gray-900 relative inline-block">
                What Our Clients Say
                <span className="block h-[3px] w-12 mx-auto mt-3 rounded-full bg-gradient-to-r from-gold to-gold-light" aria-hidden="true"></span>
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
              {testimonials.map((t) => (
                <div key={t.id} className="relative bg-white border border-gray-100 rounded-xl p-5 shadow-premium-sm hover:shadow-premium-md hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between">
                  <div className="absolute -top-3 left-4 text-gold text-3xl opacity-25" aria-hidden="true">"</div>
                  <div className="flex justify-center mb-3" role="img" aria-label={`${t.rating} out of 5 stars`}>
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={`text-sm ${i < t.rating ? 'text-gold' : 'text-gray-300'}`} aria-hidden="true">★</span>
                    ))}
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed text-center mb-4">{truncate(t.content, 150)}</p>
                  <div className="text-center border-t pt-3">
                    <p className="text-sm font-semibold text-gray-800">{t.author_name}</p>
                    {t.author_company && <p className="text-xs text-gray-500">{t.author_company}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}