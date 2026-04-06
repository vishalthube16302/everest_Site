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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#0f3460] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

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

      {/* ─── HERO ─────────────────────────────────────────── */}
      <section
        className="relative min-h-[68vh] flex flex-col justify-center overflow-hidden"
        style={{ backgroundColor: primary }}
      >
        {/* Subtle grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `repeating-linear-gradient(0deg,#fff 0,#fff 1px,transparent 1px,transparent 40px),
              repeating-linear-gradient(90deg,#fff 0,#fff 1px,transparent 1px,transparent 40px)`,
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 py-20 md:py-28 grid md:grid-cols-2 gap-12 items-center">
          {/* Left */}
          <div>
            <div
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest px-3 py-1.5 rounded-full mb-6 border"
              style={{ color: accent, borderColor: `${accent}40`, backgroundColor: `${accent}15` }}
            >
              Established 2020 · Pune, India
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white leading-[1.1] mb-4">
              {settings?.tagline || 'Engineering Power. Delivering Trust.'}
            </h1>
            <p className="text-blue-200 text-base md:text-lg leading-relaxed mb-8 max-w-md">
              Manufacturer &amp; supplier of industrial air compressors and material handling equipment — built for performance, priced for value.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 px-5 py-3 font-semibold text-sm rounded-lg text-white transition-opacity hover:opacity-90"
                style={{ backgroundColor: accent }}
              >
                Explore Products <ArrowRight size={16} />
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center gap-2 px-5 py-3 font-semibold text-sm rounded-lg border border-white/30 text-white hover:bg-white/10 transition-colors"
              >
                About Us
              </Link>
            </div>
          </div>

          {/* Right — stat pills */}
          <div className="hidden md:grid grid-cols-2 gap-4">
            {[
              { num: '50+', label: 'Product Models' },
              { num: '5+', label: 'Years Experience' },
              { num: '200+', label: 'Happy Clients' },
              { num: '100%', label: 'Free Installation' },
            ].map((s) => (
              <div key={s.label} className="rounded-xl p-5 border border-white/10" style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}>
                <div className="text-3xl font-bold text-white mb-1">{s.num}</div>
                <div className="text-blue-300 text-sm">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll chevron */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown size={20} className="text-white/40" />
        </div>
      </section>

      {/* ─── FEATURE STRIP ─────────────────────────────────── */}
      <section className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-gray-100">
            {features.map(({ icon: Icon, label, desc }) => (
              <div key={label} className="flex items-center gap-4 px-6 py-5">
                <div className="shrink-0 w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${primary}12` }}>
                  <Icon size={20} style={{ color: primary }} />
                </div>
                <div>
                  <div className="font-semibold text-gray-900 text-sm">{label}</div>
                  <div className="text-xs text-gray-500">{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PRODUCT CATEGORIES ──────────────────────────────── */}
      {categories.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: accent }}>What we offer</p>
                <h2 className="text-2xl font-bold text-gray-900">Product Categories</h2>
              </div>
              <Link to="/products" className="hidden md:flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
                All products <ArrowRight size={14} />
              </Link>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  to={`/products?category=${cat.slug}`}
                  className="group bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                >
                  {/* Image strip */}
                  <div className="h-36 bg-gray-100 relative overflow-hidden">
                    {cat.image_url ? (
                      <img
                        src={cat.image_url}
                        alt={`${cat.name} — Everest HPS products`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full" style={{ background: `linear-gradient(135deg, ${primary}15, ${primary}30)` }} />
                    )}
                    <div
                      className="absolute bottom-0 left-0 right-0 h-10"
                      style={{ background: 'linear-gradient(to top, rgba(255,255,255,0.9), transparent)' }}
                    />
                  </div>

                  {/* Body */}
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 text-sm mb-1 group-hover:text-[#0f3460] transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed mb-3">
                      {truncate(cat.description, 80)}
                    </p>
                    <span
                      className="inline-flex items-center gap-1 text-xs font-semibold"
                      style={{ color: accent }}
                    >
                      View range <ArrowRight size={12} />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── FEATURED PRODUCTS ──────────────────────────────── */}
      {featuredProducts.length > 0 && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: accent }}>Bestsellers</p>
                <h2 className="text-2xl font-bold text-gray-900">Featured Products</h2>
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
              <Link
                to="/products"
                className="inline-flex items-center gap-2 px-5 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:border-gray-300 transition-colors"
              >
                View all products <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ─── INDUSTRIES ─────────────────────────────────────── */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-center text-xs font-semibold uppercase tracking-widest text-gray-400 mb-6">Industries we serve</p>
          <div className="flex flex-wrap justify-center gap-3">
            {industries.map((ind) => (
              <span
                key={ind}
                className="px-4 py-2 rounded-full text-sm font-medium border"
                style={{ borderColor: `${primary}30`, color: primary, backgroundColor: `${primary}08` }}
              >
                {ind}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ─── WHY EVEREST ────────────────────────────────────── */}
      <section className="py-16" style={{ backgroundColor: primary }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: accent }}>Why choose us</p>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Built for Industry. Backed by Expertise.</h2>
              <p className="text-blue-200 text-sm leading-relaxed">
                From free installation to the first free servicing — we stand behind every machine we deliver.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                'Free installation & commissioning',
                'First servicing at no labour cost',
                'Pan-India delivery network',
                'Customised HP & tank configurations',
                '3 HP – 75 HP compressor range',
                'ISO-grade quality assurance',
              ].map((item) => (
                <div key={item} className="flex items-start gap-3 p-3 rounded-lg" style={{ backgroundColor: 'rgba(255,255,255,0.07)' }}>
                  <span className="shrink-0 mt-0.5 text-xs font-bold" style={{ color: accent }}>✓</span>
                  <span className="text-blue-100 text-sm">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      {/* ─── TESTIMONIALS ───────────────────────────────────── */}
      {testimonials.length > 0 && (
        <section className="py-14 bg-gradient-to-b from-gray-50 to-white">
          <div className="max-w-6xl mx-auto px-4">

            {/* Header */}
            <div className="text-center mb-10">
              <p
                className="text-[11px] font-semibold tracking-[2px] uppercase mb-2"
                style={{ color: accent }}
              >
                CLIENT REVIEWS
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 relative inline-block">
                What Our Clients Say
                <span className="block h-[2px] w-12 bg-blue-500 mx-auto mt-2 rounded-full"></span>
              </h2>
            </div>

            {/* Cards */}
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
              {testimonials.map((t) => (
                <div
                  key={t.id}
                  className="relative bg-white border border-gray-100 rounded-xl p-5 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
                >
                  {/* Quote Icon */}
                  <div className="absolute -top-3 left-4 text-blue-500 text-3xl opacity-20">
                    “
                  </div>

                  {/* Stars */}
                  <div className="flex justify-center mb-3">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={`text-sm ${i < t.rating ? 'text-yellow-400' : 'text-gray-300'
                          }`}
                      >
                        ★
                      </span>
                    ))}
                  </div>

                  {/* Content */}
                  <p className="text-gray-600 text-sm leading-relaxed text-center mb-4">
                    {truncate(t.content, 150)}
                  </p>

                  {/* Author */}
                  <div className="text-center border-t pt-3">
                    <p className="text-sm font-semibold text-gray-800">
                      {t.author_name}
                    </p>
                    {t.author_company && (
                      <p className="text-xs text-gray-500">
                        {t.author_company}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── CTA BANNER ───────────────────────────────────────
      <section className="py-14" style={{ backgroundColor: accent }}>
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">Ready to power your operations?</h2>
          <p className="text-white/80 text-sm mb-7">Talk to our engineers. Get a customised quote within 24 hours.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/contact"
              className="px-6 py-3 bg-white font-semibold text-sm rounded-lg transition-opacity hover:opacity-90"
              style={{ color: accent }}
            >
              Get a Quote
            </Link>
            {settings?.phone && (
              <a
                href={`tel:${settings.phone}`}
                className="px-6 py-3 border border-white/40 text-white font-semibold text-sm rounded-lg hover:bg-white/10 transition-colors"
              >
                Call {settings.phone}
              </a>
            )}
          </div>
        </div>
      </section> */}
    </div>
  );
}
