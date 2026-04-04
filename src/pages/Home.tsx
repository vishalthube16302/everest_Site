import { useEffect, useState } from 'react';
import { ArrowRight, Zap, Shield, Truck, Lightbulb } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Category, Testimonial, SiteSettings, Product } from '../types';
import { Link } from 'react-router-dom';

export function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
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
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-96 bg-gradient-to-r from-blue-900 to-blue-700 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/3807517/pexels-photo-3807517.jpeg?auto=compress&cs=tinysrgb&w=1600"
            alt="Industrial"
            className="w-full h-full object-cover opacity-30"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 h-full flex flex-col justify-center items-start">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {settings?.tagline || 'Reliable Hydraulic & Pneumatic Solutions'}
          </h1>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl">
            Quality industrial components with assured performance. Trusted by leading manufacturers worldwide.
          </p>
          <div className="flex gap-4">
            <Link
              to="/products"
              className="px-6 py-3 bg-white text-blue-900 font-semibold rounded-lg hover:bg-blue-50 transition-colors flex items-center gap-2"
            >
              View Products <ArrowRight size={20} />
            </Link>
            <Link
              to="/contact"
              className="px-6 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-900 transition-colors"
            >
              Get Quote
            </Link>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="inline-block p-3 bg-blue-100 rounded-lg mb-4">
                <Zap className="text-blue-600" size={32} />
              </div>
              <h3 className="font-semibold text-lg mb-2">Wide Range</h3>
              <p className="text-gray-600 text-sm">Extensive product selection</p>
            </div>
            <div className="text-center">
              <div className="inline-block p-3 bg-green-100 rounded-lg mb-4">
                <Shield className="text-green-600" size={32} />
              </div>
              <h3 className="font-semibold text-lg mb-2">Quality Tested</h3>
              <p className="text-gray-600 text-sm">Industry standards assured</p>
            </div>
            <div className="text-center">
              <div className="inline-block p-3 bg-orange-100 rounded-lg mb-4">
                <Truck className="text-orange-600" size={32} />
              </div>
              <h3 className="font-semibold text-lg mb-2">Fast Delivery</h3>
              <p className="text-gray-600 text-sm">Timely & reliable shipping</p>
            </div>
            <div className="text-center">
              <div className="inline-block p-3 bg-purple-100 rounded-lg mb-4">
                <Lightbulb className="text-purple-600" size={32} />
              </div>
              <h3 className="font-semibold text-lg mb-2">Custom Solutions</h3>
              <p className="text-gray-600 text-sm">Tailored to your needs</p>
            </div>
          </div>
        </div>
      </section>

      {/* Product Categories */}
      {categories.length > 0 && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12">Product Categories</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  to={`/products?category=${category.slug}`}
                  className="group rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all"
                >
                  <div className="relative h-48 bg-gray-200 overflow-hidden">
                    {category.image_url ? (
                      <img
                        src={category.image_url}
                        alt={category.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600"></div>
                    )}
                  </div>
                  <div className="p-6 bg-white">
                    <h3 className="font-bold text-lg mb-2 group-hover:text-blue-600 transition-colors">{category.name}</h3>
                    <p className="text-gray-600 text-sm mb-4">{category.description}</p>
                    <span className="text-blue-600 font-semibold text-sm flex items-center gap-2">
                      View Products <ArrowRight size={16} />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12">Featured Products</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {featuredProducts.map((product) => <div key={product.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                <Link to={`/products/${product.slug}`} className="block">
                  <div className="h-40 bg-gray-200">
                    {product.image_url ? (
                      <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400"></div>
                    )}
                  </div>
                </Link>
                <div className="p-4">
                  <Link to={`/products/${product.slug}`}>
                    <h3 className="font-semibold mb-2 hover:text-blue-600 transition-colors">{product.name}</h3>
                  </Link>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
                  <Link
                    to={`/products/${product.slug}`}
                    className="inline-block px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    View Details
                  </Link>
                </div>
              </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Industries Served */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12">Industries We Serve</h2>
          <div className="grid md:grid-cols-5 gap-4">
            {['Manufacturing', 'Machinery', 'Automation', 'Automotive', 'Construction'].map((industry) => (
              <div key={industry} className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg text-center border border-blue-200">
                <p className="font-semibold text-gray-800">{industry}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12">Why Choose Everest?</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              'Extensive range of hydraulic & pneumatic components',
              'Quality assured products meeting international standards',
              'Quick delivery with reliable logistics',
              'Expert technical support & consultation',
              'Competitive pricing & volume discounts',
              'Customized solutions for specific requirements',
            ].map((item, i) => (
              <div key={i} className="flex gap-4">
                <div className="text-orange-400 font-bold text-xl">✓</div>
                <p>{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12">What Our Clients Say</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="bg-white p-6 rounded-lg shadow-md">
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <span key={i} className="text-yellow-400">★</span>
                    ))}
                  </div>
                  <p className="text-gray-700 mb-4 italic">"{testimonial.content}"</p>
                  <div className="border-t pt-4">
                    <p className="font-semibold text-gray-900">{testimonial.author_name}</p>
                    {testimonial.author_company && <p className="text-sm text-gray-600">{testimonial.author_company}</p>}
                    {testimonial.author_role && <p className="text-sm text-gray-600">{testimonial.author_role}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-orange-500 to-orange-600 text-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-lg mb-8 opacity-90">Contact us today for product information, quotes, or technical consultation.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="px-8 py-3 bg-white text-orange-600 font-bold rounded-lg hover:bg-gray-100 transition-colors"
            >
              Get a Quote
            </a>
            <a
              href={`tel:${settings?.phone}`}
              className="px-8 py-3 border-2 border-white text-white font-bold rounded-lg hover:bg-white hover:text-orange-600 transition-colors"
            >
              Call Now
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
