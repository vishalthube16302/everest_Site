import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Product } from '../types';
import { ArrowLeft, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { ShareButton } from '../components/ShareButton';
import { formatPrice } from '../lib/format';
import DOMPurify from 'dompurify';

interface ProductImage {
    id: string;
    image_url: string;
    alt_text: string;
    sort_order: number;
}

/* ── spec row helper ──────────────────────────────────────────────────────
   DB stores specs in TWO formats:
   1. Object: {"weight":"29 kg", "cooling":"Air Cooled", ...}
   2. Array:  [["Horsepower (HP)","3"], ["Cooling Method","Air Cooled"], ...]
   This function normalises both into {label, value} pairs.
──────────────────────────────────────────────────────────────────────── */
function parseSpecs(raw: unknown): { label: string; value: string }[] {
    if (!raw) return [];

    // --- Format 1: Object {key: value} ---
    if (!Array.isArray(raw) && typeof raw === 'object') {
        return Object.entries(raw as Record<string, string>)
            .filter(([, v]) => v != null && String(v).trim() !== '')
            .map(([key, val]) => ({
                label: key
                    .replace(/_/g, ' ')
                    .replace(/\b\w/g, c => c.toUpperCase()),
                value: String(val),
            }));
    }

    // --- Format 2: Array [["Label","Value"], ...] ---
    if (Array.isArray(raw)) {
        return (raw as unknown[][])
            .filter(pair => Array.isArray(pair) && pair.length >= 2)
            .filter(([, v]) => v != null && String(v).trim() !== '')
            .map(([k, v]) => ({
                label: String(k),
                value: String(v),
            }));
    }

    return [];
}

export function ProductDetail() {
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();
    const [product, setProduct] = useState<Product | null>(null);
    const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
    const [images, setImages] = useState<ProductImage[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedIdx, setSelectedIdx] = useState(0);
    const [categoryName, setCategoryName] = useState<string>('');

    useEffect(() => {
        const fetch = async () => {
            if (!slug) return;
            setLoading(true);

            const { data, error } = await supabase
                .from('products').select('*').eq('slug', slug).maybeSingle();
            if (error || !data) { navigate('/products'); return; }
            setProduct(data);

            // Fetch category name
            if (data.category_id) {
                const { data: cat } = await supabase
                    .from('categories').select('name').eq('id', data.category_id).maybeSingle();
                if (cat) setCategoryName(cat.name);
            }

            const { data: imgs } = await supabase
                .from('product_images').select('*').eq('product_id', data.id).order('sort_order');
            if (imgs) setImages(imgs);

            if (data.category_id) {
                const { data: sim } = await supabase
                    .from('products').select('*')
                    .eq('category_id', data.category_id)
                    .neq('id', data.id).limit(6);
                if (sim) setSimilarProducts(sim);
            }
            setLoading(false);
        };
        fetch();
    }, [slug, navigate]);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-[#0f3460] border-t-transparent rounded-full animate-spin" />
        </div>
    );
    if (!product) return null;

    const allImages = [product.image_url, ...images.map(i => i.image_url)].filter(Boolean);
    const specs = parseSpecs(product.specifications);
    const price = formatPrice(product.price_range);
    const isPOR = price === 'Price on Request';

    /* strip leading newlines / bullet-style text from long description */
    const cleanLong = product.long_description
        ? DOMPurify.sanitize(product.long_description)
        : '';

    const next = () => setSelectedIdx(i => (i + 1) % allImages.length);
    const prev = () => setSelectedIdx(i => (i - 1 + allImages.length) % allImages.length);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* ── breadcrumb bar ── */}
            <div className="bg-white border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-2 text-sm">
                    <Link to="/products" className="flex items-center gap-1.5 text-[#0f3460] hover:underline font-medium">
                        <ArrowLeft size={15} /> Back to Products
                    </Link>
                    <span className="text-gray-300">/</span>
                    <span className="text-gray-500 truncate max-w-xs">{product.name}</span>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">

                {/* ══════════════ MAIN GRID ══════════════ */}
                <div className="grid md:grid-cols-2 gap-8 mb-10">

                    {/* ── LEFT: image gallery ── */}
                    <div>
                        {/* Main image */}
                        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden relative mb-3">
                            <div className="aspect-square flex items-center justify-center p-6 bg-white">
                                {allImages[selectedIdx] ? (
                                    <img
                                        src={allImages[selectedIdx]}
                                        alt={product.name}
                                        className="w-full h-full object-contain"
                                    />
                                ) : (
                                    <div className="text-gray-200 text-6xl">📦</div>
                                )}
                            </div>
                            {allImages.length > 1 && (
                                <>
                                    <button onClick={prev}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white border border-gray-200 rounded-full w-9 h-9 flex items-center justify-center shadow-sm transition-all">
                                        <ChevronLeft size={18} className="text-gray-600" />
                                    </button>
                                    <button onClick={next}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white border border-gray-200 rounded-full w-9 h-9 flex items-center justify-center shadow-sm transition-all">
                                        <ChevronRight size={18} className="text-gray-600" />
                                    </button>
                                </>
                            )}
                        </div>

                        {/* Thumbnails */}
                        {allImages.length > 1 && (
                            <div className="flex gap-2 overflow-x-auto pb-1">
                                {allImages.map((img, i) => (
                                    <button key={i} onClick={() => setSelectedIdx(i)}
                                        className={`flex-shrink-0 w-16 h-16 rounded-xl border-2 overflow-hidden transition-all ${selectedIdx === i ? 'border-[#0f3460]' : 'border-gray-200 hover:border-gray-300'
                                            }`}>
                                        <img src={img} alt={`View ${i + 1}`} className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* ── RIGHT: product info ── */}
                    <div className="flex flex-col gap-5">

                        {/* Product Name + Share */}
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                {categoryName && (
                                    <span className="inline-block text-[11px] font-semibold uppercase tracking-widest bg-[#0f3460]/8 text-[#0f3460] px-2.5 py-1 rounded-full mb-2">
                                        {categoryName}
                                    </span>
                                )}
                                <h1 className="text-2xl md:text-3xl font-bold text-black leading-tight">
                                    {product.name}
                                </h1>
                            </div>
                            <div className="shrink-0 mt-1">
                                <ShareButton
                                    productName={product.name}
                                    url={window.location.href}
                                    description={product.description}
                                    specifications={product.specifications}
                                    imageUrl={product.image_url}
                                    price={product.price_range}
                                />
                            </div>
                        </div>

                        {/* Price — tight spacing below name */}
                        <div className={`inline-flex items-baseline gap-1.5 px-4  rounded-xl w-fit mt-1 mb-2 ${isPOR
                            ? 'bg-gray-100 text-gray-500'
                            : 'bg-[#0f3460]/6 text-[#0f3460]'
                            }`}>
                            <span className="text-xl font-bold text-black">{price}</span>
                            {!isPOR && <span className="text-xs text-[#0f3460]/60">incl. taxes</span>}
                        </div>

                        {/* Specifications Table — black border, keys left, values right */}
                        {specs.length > 0 && (
                            <div className="border-t border-gray-200 pt-4">
                                <h2 className="text-base font-bold text-black mb-3">Technical Specifications</h2>
                                <table className="w-full border border-black text-sm">
                                    <thead>
                                        <tr className="bg-gray-100">
                                            <th className="border border-black px-3 py-2 text-left text-xs font-bold text-black uppercase">Parameter</th>
                                            <th className="border border-black px-3 py-2 text-left text-xs font-bold text-black uppercase">Value</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {specs.map(({ label, value }, i) => (
                                            <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                                <td className="border border-black px-3 py-2 text-xs font-medium text-black">{label}</td>
                                                <td className="border border-black px-3 py-2 text-xs font-semibold text-black">{value}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {/* Free services pill row */}
                        <div className="flex flex-wrap gap-2">
                            <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-green-50 text-green-700 border border-green-100 px-3 py-1.5 rounded-full">
                                <Check size={11} /> Free Installation
                            </span>
                            <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-green-50 text-green-700 border border-green-100 px-3 py-1.5 rounded-full">
                                <Check size={11} /> Free First Servicing
                            </span>
                            <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100 px-3 py-1.5 rounded-full">
                                🚚 Pan-India Delivery
                            </span>
                        </div>

                        {/* CTA */}
                        <Link to="/contact"
                            className="flex items-center justify-center gap-2 px-6 py-3.5 bg-[#e94560] hover:bg-[#c73652] text-white font-semibold rounded-xl transition-colors text-sm">
                            Request Information
                        </Link>
                    </div>
                </div>
                {/* Short Description (2-3 lines) */}
                {product.description && (
                    <p className="text-sm text-black leading-relaxed line-clamp-3">
                        {product.description}
                    </p>
                )}

                {/* Detailed Description (formatted) */}
                {cleanLong && (
                    <div className="border-t border-gray-200 pt-4">
                        <h2 className="text-base font-bold text-black mb-3">Description</h2>
                        <div
                            className="text-sm text-black leading-relaxed prose prose-sm max-w-none"
                            dangerouslySetInnerHTML={{ __html: cleanLong }}
                        />
                    </div>
                )}

                {/* ══════════════ SIMILAR PRODUCTS ══════════════ */}
                {similarProducts.length > 0 && (
                    <div>
                        <div className="flex items-center justify-between mb-5">
                            <h2 className="text-lg font-bold text-black">Similar Products</h2>
                            <Link to="/products" className="text-sm text-[#0f3460] hover:underline font-medium">
                                View all →
                            </Link>
                        </div>
                        <div className="flex gap-4 overflow-x-auto pb-3 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide">
                            {similarProducts.map((p) => {
                                const simPrice = formatPrice(p.price_range);
                                const simPOR = simPrice === 'Price on Request';
                                return (
                                    <Link key={p.id} to={`/products/${p.slug}`}
                                        className="flex-shrink-0 w-52 bg-white border border-gray-100 rounded-xl overflow-hidden group hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                                        <div className="h-36 bg-gray-50 overflow-hidden">
                                            {p.image_url
                                                ? <img src={p.image_url} alt={p.name} className="w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-300" />
                                                : <div className="w-full h-full flex items-center justify-center text-gray-200 text-3xl">📦</div>
                                            }
                                        </div>
                                        <div className="p-3">
                                            <p className="text-xs font-semibold text-black line-clamp-2 leading-snug mb-1">{p.name}</p>
                                            <p className={`text-xs font-bold mb-2 ${simPOR ? 'text-gray-400 italic' : 'text-[#0f3460]'}`}>
                                                {simPrice}
                                            </p>
                                            <span className="text-[11px] font-semibold text-[#e94560] group-hover:underline">View Details →</span>
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