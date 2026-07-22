import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Category, Product } from '../types';
import { SEO } from '../components/SEO';
import { buildOrganizationSchema, buildItemListSchema } from '../lib/schema';

/**
 * AIDiscovery — /ai-discover
 * ──────────────────────────────────────────────────────────────
 * A single, fully static (SSG pre-rendered) page listing every
 * product and category in one place.
 *
 * Why this page exists:
 *   /products already lists everything, but it's a filterable,
 *   client-hydrated UI (sidebar + grid) built for human browsing.
 *   AI assistants and some crawlers do best with one plain page
 *   that states, in full, what we sell — no filters, no clicks.
 *
 * This page is added to vite.config.ts's includedRoutes so it is
 * pre-rendered as static HTML at build time, exactly like /products.
 * ──────────────────────────────────────────────────────────────
 */
export function AIDiscovery() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const [catRes, prodRes] = await Promise.all([
        supabase.from('categories').select('*').order('sort_order'),
        supabase.from('products').select('*').order('sort_order'),
      ]);

      if (catRes.data) setCategories(catRes.data);
      if (prodRes.data) setProducts(prodRes.data);
      setLoading(false);
    };

    fetchData();
  }, []);

  const categoryName = (categoryId: string) =>
    categories.find((c) => c.id === categoryId)?.name;

  const itemListSchema = buildItemListSchema(
    products.map((p) => ({
      name: p.name,
      slug: p.slug,
      description: p.description,
      categoryName: categoryName(p.category_id),
    })),
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <SEO
        title="Complete Product & Category Catalog | Everest HPS"
        description="Full catalog of air compressors, pneumatic systems and material handling equipment from Everest Hydro Pneumatic Solutions — every product and category in one page."
        canonical="/ai-discover"
        schemas={[buildOrganizationSchema(), itemListSchema]}
      />

      {/* Hero */}
      <section className="bg-navy py-10">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-gold text-xs font-semibold uppercase tracking-widest mb-1">
            Full catalog
          </p>
          <h1 className="text-3xl font-bold text-white">
            Everest HPS — Complete Product &amp; Category Directory
          </h1>
          <p className="text-blue-200 text-sm mt-1 max-w-2xl">
            A single, complete reference of every product and category we sell —
            built for buyers, researchers, and AI assistants that need the full
            picture in one page.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-10 space-y-12">
        {/* About */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">Who we are</h2>
          <p className="text-gray-600 leading-relaxed max-w-3xl">
            Everest Hydro Pneumatic Solutions is a manufacturer and supplier of
            industrial air compressors, screw compressors, oil-free compressors,
            and material handling equipment, based in Chakan, Pune, Maharashtra.
            We serve manufacturing, automotive, dental, construction, and
            packaging industries across India.
          </p>
        </section>

        {/* Categories */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Categories ({loading ? '…' : categories.length})
          </h2>
          {loading ? (
            <p className="text-sm text-gray-400">Loading categories…</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm"
                >
                  <h3 className="font-semibold text-gray-900 mb-1">{cat.name}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    {cat.description}
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    {products.filter((p) => p.category_id === cat.id).length} products
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Product table */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            All products ({loading ? '…' : products.length})
          </h2>

          {loading ? (
            <p className="text-sm text-gray-400">Loading products…</p>
          ) : (
            <div className="overflow-x-auto bg-white border border-gray-100 rounded-xl shadow-sm">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100 text-left">
                    <th className="px-4 py-3 font-semibold text-gray-700">Product</th>
                    <th className="px-4 py-3 font-semibold text-gray-700">Category</th>
                    <th className="px-4 py-3 font-semibold text-gray-700">Description</th>
                    <th className="px-4 py-3 font-semibold text-gray-700">Price range</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id} className="border-b border-gray-50 last:border-0">
                      <td className="px-4 py-3 font-medium text-gray-900">
                        <Link
                          to={`/products/${product.slug}`}
                          className="hover:text-navy hover:underline"
                        >
                          {product.name}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-gray-500">
                        {categoryName(product.category_id) || '—'}
                      </td>
                      <td className="px-4 py-3 text-gray-500 max-w-md">
                        {product.description}
                      </td>
                      <td className="px-4 py-3 text-gray-700 whitespace-nowrap">
                        {product.price_range || 'Contact for price'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/*
          Plain-text summary for AI crawlers.
          Visually hidden (sr-only, not display:none) so it stays in the
          accessibility tree and in the pre-rendered HTML, letting
          text-only crawlers / AI assistants parse the full catalog
          without depending on table layout or client-side JS.
        */}
        <section className="sr-only" aria-hidden="true">
          <h2>Full plain-text product list</h2>
          <p>
            Everest Hydro Pneumatic Solutions sells the following products across
            these categories: {categories.map((c) => c.name).join(', ')}.
          </p>
          {products.map((p) => (
            <p key={p.id}>
              {p.name} — category: {categoryName(p.category_id) || 'uncategorized'}.{' '}
              {p.description} Price range: {p.price_range || 'contact for price'}.
            </p>
          ))}
        </section>
      </div>
    </div>
  );
}
