import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Product } from '../types';
import { ArrowLeft, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { ShareButton } from '../components/ShareButton';
import { formatPrice } from '../lib/format';
import DOMPurify from 'dompurify';
import { SEO } from '../components/SEO';
import { buildProductSchema, buildBreadcrumbSchema } from '../lib/schema';

interface ProductImage {
    id: string;
    image_url: string;
    alt_text: string;
    sort_order: number;
}

function parseSpecs(raw: unknown): { label: string; value: string }[] {
    if (!raw) return [];
    if (Array.isArray(raw)) {
        return (raw as [string, string][])
            .filter(([, v]) => String(v).trim() !== '' && String(v).trim() !== '0')
            .map(([k, v]) => ({ label: String(k).trim(), value: String(v).trim() }));
    }
    if (typeof raw === 'object') {
        return Object.entries(raw as Record<string, string>)
            .filter(([, v]) => String(v).trim() !== '' && String(v).trim() !== '0')
            .map(([k, v]) => ({
                label: k.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
                value: String(v).trim(),
            }));
    }
    return [];
}

export function ProductDetail() {
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();
    const [product, setProduct] = useState<Product | null>(null);
    const [categoryName, setCategoryName] = useState('');
    const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
    const [images, setImages] = useState<ProductImage[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedIdx, setSelectedIdx] = useState(0);

    useEffect(() => {
        const load = async () => {
            if (!slug) return;
            setLoading(true);
            setSelectedIdx(0);
            const { data, error } = await supabase.from('products').select('*').eq('slug', slug).maybeSingle();
            if (error || !data) { navigate('/products'); return; }
            setProduct(data);
            if (data.category_id) {
                const { data: cat } = await supabase.from('categories').select('name').eq('id', data.category_id).maybeSingle();
                if (cat) setCategoryName(cat.name);
            }
            const { data: imgs } = await supabase.from('product_images').select('*').eq('product_id', data.id).order('sort_order');
            if (imgs) setImages(imgs);
            if (data.category_id) {
                const { data: sim } = await supabase.from('products').select('*').eq('category_id', data.category_id).neq('id', data.id).limit(6);
                if (sim) setSimilarProducts(sim);
            }
            setLoading(false);
        };
        load();
    }, [slug, navigate]);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-navy border-t-transparent rounded-full animate-spin" />
        </div>
    );
    if (!product) return null;

    const allImages = [product.image_url, ...images.map(i => i.image_url)].filter(Boolean);
    const specs = parseSpecs(product.specifications);
    const price = formatPrice(product.price_range);
    const isPOR = price === 'Price on Request';

    // Fix 5: keyword-aligned alt text with location
    const mainAlt = categoryName
        ? `${product.name} — ${categoryName} Chakan Pune`
        : `${product.name} — industrial equipment supplier Pune`;

    const productSchema = buildProductSchema({
        name: product.name, slug: product.slug, description: product.description,
        image_url: product.image_url, price_range: product.price_range,
        categoryName: categoryName || undefined, specifications: product.specifications,
    });
    const breadcrumbSchema = buildBreadcrumbSchema([
        { name: 'Home', path: '/' },
        { name: 'Products', path: '/products' },
        { name: product.name, path: `/products/${product.slug}` },
    ]);
    const cleanLong = product.long_description ? DOMPurify.sanitize(product.long_description) : '';

    return (
        <div className="min-h-screen bg-gray-50">
            <SEO
                title={`${product.name} | Buy in Pune | Everest HPS`}
                description={`${product.name} — ${(product.description || '').slice(0, 120)}. Buy from Everest HPS, Chakan Pune. Free installation & pan-India delivery.`}
                canonical={`/products/${product.slug}`}
                ogImage={product.image_url || undefined}
                ogType="product"
                schemas={[productSchema, breadcrumbSchema]}
            />

            <div className="bg-white border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-2 text-sm">
                    <Link to="/products" className="flex items-center gap-1 text-navy hover:underline font-medium">
                        <ArrowLeft size={14} /> Back to Products
                    </Link>
                    <span className="text-gray-300">/</span>
                    <span className="text-gray-500 truncate max-w-xs">{product.name}</span>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-6">
                <div className="grid md:grid-cols-2 gap-8 mb-8">
                    {/* Image gallery */}
                    <div>
                        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden relative mb-3">
                            <div className="aspect-square flex items-center justify-center p-8">
                                {allImages[selectedIdx]
                                    ? <img
                                        key={selectedIdx}
                                        src={allImages[selectedIdx]}
                                        alt={selectedIdx === 0 ? mainAlt : `${product.name} — image ${selectedIdx + 1}`}
                                        width="480"
                                        height="480"
                                        loading={selectedIdx === 0 ? 'eager' : 'lazy'}
                                        decoding="async"
                                        className="w-full h-full object-contain"
                                    />
                                    : <div className="text-gray-200 text-7xl" aria-hidden="true">📦</div>
                                }
                            </div>
                            {allImages.length > 1 && (
                                <>
                                    <button onClick={() => setSelectedIdx(i => (i - 1 + allImages.length) % allImages.length)}
                                        aria-label="Previous image"
                                        className="absolute left-3 top-1/2 -translate-y-1/2 bg-white border border-gray-200 rounded-full w-9 h-9 flex items-center justify-center shadow-sm hover:shadow-md transition-all">
                                        <ChevronLeft size={18} className="text-gray-600" />
                                    </button>
                                    <button onClick={() => setSelectedIdx(i => (i + 1) % allImages.length)}
                                        aria-label="Next image"
                                        className="absolute right-3 top-1/2 -translate-y-1/2 bg-white border border-gray-200 rounded-full w-9 h-9 flex items-center justify-center shadow-sm hover:shadow-md transition-all">
                                        <ChevronRight size={18} className="text-gray-600" />
                                    </button>
                                </>
                            )}
                        </div>
                        {allImages.length > 1 && (
                            <div className="flex gap-2 overflow-x-auto pb-1">
                                {allImages.map((img, i) => (
                                    <button key={i} onClick={() => setSelectedIdx(i)}
                                        aria-label={`View image ${i + 1}`}
                                        className={`flex-shrink-0 w-16 h-16 rounded-xl border-2 overflow-hidden transition-all ${selectedIdx === i ? 'border-navy' : 'border-gray-200 hover:border-gray-300'}`}>
                                        <img src={img} alt={`${product.name} thumbnail ${i + 1}`} width="64" height="64" loading="lazy" className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product info */}
                    <div className="flex flex-col gap-4">
                        <div>
                            {categoryName && <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-500 mb-2">{categoryName}</p>}
                            <div className="flex items-start justify-between gap-3">
                                <h1 className="text-2xl md:text-[28px] font-bold text-gray-900 leading-tight">{product.name}</h1>
                                <div className="shrink-0 mt-0.5">
                                    <ShareButton productName={product.name} url={`https://everesthps.com/products/${product.slug}`}
                                        description={product.description} specifications={product.specifications as Record<string, unknown>}
                                        imageUrl={product.image_url} price={product.price_range} />
                                </div>
                            </div>
                        </div>

                        <div className={`flex items-baseline gap-2 px-4 py-2.5 rounded-xl w-fit ${isPOR ? 'bg-gray-100' : 'bg-navy/6'}`}>
                            <span className={`font-bold ${isPOR ? 'text-gray-400 italic text-sm' : 'text-xl text-gray-900'}`}>{price}</span>
                            {!isPOR && <span className="text-xs text-gray-400">incl. taxes</span>}
                        </div>

                        {specs.length > 0 && (
                            <div>
                                <h2 className="text-sm font-bold text-gray-900 mb-2">Technical Specifications</h2>
                                <table className="w-full text-sm" style={{ borderCollapse: 'collapse', border: '1px solid #000' }}>
                                    <thead>
                                        <tr>
                                            <th style={{ border: '1px solid #000', padding: '7px 12px', textAlign: 'left', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#111', background: '#fff', width: '50%' }}>Parameter</th>
                                            <th style={{ border: '1px solid #000', padding: '7px 12px', textAlign: 'left', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#111', background: '#fff', width: '50%' }}>Value</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {specs.map(({ label, value }, i) => (
                                            <tr key={i}>
                                                <td style={{ border: '1px solid #000', padding: '7px 12px', fontSize: '13px', color: '#111', background: '#fff' }}>{label}</td>
                                                <td style={{ border: '1px solid #000', padding: '7px 12px', fontSize: '13px', color: '#111', background: '#fff' }}>{value}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        <div className="flex flex-wrap gap-2">
                            <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-green-50 text-green-700 border border-green-100 px-3 py-1.5 rounded-full"><Check size={11} /> Free Installation</span>
                            <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-green-50 text-green-700 border border-green-100 px-3 py-1.5 rounded-full"><Check size={11} /> Free First Servicing</span>
                            <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100 px-3 py-1.5 rounded-full">🚚 Pan-India Delivery</span>
                        </div>

                        <Link to="/contact" className="flex items-center justify-center px-6 py-3.5 bg-gold hover:bg-gold-dark text-white font-semibold rounded-xl transition-colors text-sm">
                            Request Information
                        </Link>
                    </div>
                </div>

                {(product.description || cleanLong) && (
                    <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-8">
                        <h2 className="text-sm font-bold text-gray-900 mb-3">Description</h2>
                        {product.description && <p className="text-sm text-gray-600 leading-relaxed mb-3">{product.description.split('\n\n')[0]}</p>}
                        {cleanLong && <div className="text-sm text-gray-600 leading-relaxed prose prose-sm max-w-none border-t border-gray-50 pt-3" dangerouslySetInnerHTML={{ __html: cleanLong }} />}
                    </div>
                )}

                {similarProducts.length > 0 && (
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-base font-bold text-gray-900">Similar Products</h2>
                            <Link to="/products" className="text-sm text-navy hover:underline font-medium">View all →</Link>
                        </div>
                        <div className="flex gap-4 overflow-x-auto pb-3">
                            {similarProducts.map((p) => {
                                const sp = formatPrice(p.price_range);
                                return (
                                    <Link key={p.id} to={`/products/${p.slug}`}
                                        className="flex-shrink-0 w-48 bg-white border border-gray-100 rounded-xl overflow-hidden group hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                                        <div className="h-32 bg-gray-50 overflow-hidden">
                                            {p.image_url
                                                ? <img src={p.image_url} alt={`${p.name} — Everest HPS Pune`} width="192" height="128" loading="lazy" className="w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-300" />
                                                : <div className="w-full h-full flex items-center justify-center text-gray-200 text-3xl" aria-hidden="true">📦</div>
                                            }
                                        </div>
                                        <div className="p-3">
                                            <p className="text-xs font-semibold text-gray-900 line-clamp-2 leading-snug mb-1">{p.name}</p>
                                            <p className={`text-xs font-bold mb-1.5 ${sp === 'Price on Request' ? 'text-gray-400 italic' : 'text-navy'}`}>{sp}</p>
                                            <span className="text-[11px] font-semibold text-gold">View Details →</span>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}