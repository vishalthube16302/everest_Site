import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Product } from '../types';
import { ArrowLeft, ChevronLeft, ChevronRight, ShoppingBag } from 'lucide-react';
import { ShareButton } from '../components/ShareButton';

interface ProductImage {
    id: string;
    image_url: string;
    alt_text: string;
    sort_order: number;
}

export function ProductDetail() {
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();
    const [product, setProduct] = useState<Product | null>(null);
    const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
    const [images, setImages] = useState<ProductImage[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    useEffect(() => {
        const fetchProduct = async () => {
            if (!slug) return;

            setLoading(true);
            // Fetch current product
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .eq('slug', slug)
                .maybeSingle();

            if (error || !data) {
                navigate('/products');
                return;
            }

            setProduct(data);

            // Fetch additional images
            const { data: imagesData } = await supabase
                .from('product_images')
                .select('*')
                .eq('product_id', data.id)
                .order('sort_order');

            if (imagesData) {
                setImages(imagesData);
            }

            // Fetch similar products
            if (data.category_id) {
                const { data: similarData } = await supabase
                    .from('products')
                    .select('*')
                    .eq('category_id', data.category_id)
                    .neq('id', data.id) // Exclude current product
                    .limit(6); // Limit to 6 similar products

                if (similarData) {
                    setSimilarProducts(similarData);
                }
            }

            setLoading(false);
        };

        fetchProduct();
    }, [slug, navigate]);

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-gray-600">Loading product...</div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-gray-600">Product not found</div>
            </div>
        );
    }

    const allImages = [
        product.image_url,
        ...images.map(img => img.image_url)
    ].filter(Boolean);

    const currentImage = allImages[selectedImageIndex];
    const hasMultipleImages = allImages.length > 1;

    const nextImage = () => {
        setSelectedImageIndex((prev) => (prev + 1) % allImages.length);
    };

    const prevImage = () => {
        setSelectedImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
    };

    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-7xl mx-auto px-4 py-8">
                <Link
                    to="/products"
                    className="flex items-center text-blue-600 hover:text-blue-700 mb-8 transition-colors"
                >
                    <ArrowLeft size={20} className="mr-2" />
                    Back to Products
                </Link>

                <div className="grid md:grid-cols-2 gap-8 mb-16">
                    {/* Image Gallery */}
                    <div>
                        <div className="bg-gray-100 rounded-lg overflow-hidden mb-4 border border-gray-200">
                            <div className="relative w-full aspect-square flex items-center justify-center bg-white">
                                {currentImage ? (
                                    <img
                                        src={currentImage}
                                        alt={product.name}
                                        className="w-full h-full object-contain p-4"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
                                        <ShoppingBag size={64} />
                                    </div>
                                )}

                                {hasMultipleImages && (
                                    <>
                                        <button
                                            onClick={prevImage}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                                            aria-label="Previous image"
                                        >
                                            <ChevronLeft size={24} />
                                        </button>
                                        <button
                                            onClick={nextImage}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                                            aria-label="Next image"
                                        >
                                            <ChevronRight size={24} />
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>

                        {hasMultipleImages && (
                            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                                {allImages.map((img, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedImageIndex(index)}
                                        className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${selectedImageIndex === index ? 'border-blue-600' : 'border-gray-200 hover:border-blue-300'
                                            }`}
                                    >
                                        <img src={img} alt={`View ${index + 1}`} className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Details */}
                    <div className="flex flex-col justify-start">
                        <div className="flex items-center justify-between mb-4">
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{product.name}</h1>
                            <ShareButton
                                productName={product.name}
                                url={window.location.href}
                                description={product.description}
                                specifications={product.specifications}
                                imageUrl={product.image_url}
                                price={product.price_range}
                            />
                        </div>

                        {product.price_range && (
                            <p className="text-2xl font-semibold text-blue-600 mb-6">{product.price_range}</p>
                        )}

                        <div className="border-t border-gray-200 pt-6 mb-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-3">Description</h2>
                            <p className="text-gray-700 leading-relaxed mb-4">{product.description}</p>
                            {product.long_description && (
                                <p className="text-gray-600 leading-relaxed whitespace-pre-line">{product.long_description}</p>
                            )}
                        </div>

                        {product.specifications && Object.keys(product.specifications).length > 0 && (
                            <div className="border-t border-gray-200 pt-6 mb-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-3">Specifications</h2>
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <div className="space-y-2">
                                        {Object.entries(product.specifications).map(([key, value]) => (
                                            <div key={key} className="grid grid-cols-3 gap-4 py-2 border-b border-gray-200 last:border-0">
                                                <span className="text-gray-600 font-medium col-span-1">{key}</span>
                                                <span className="text-gray-900 col-span-2">{String(value)}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        <a
                            href="/contact"
                            className="w-full md:w-auto px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors text-center shadow-md hover:shadow-lg transform hover:-translate-y-0.5 duration-200"
                        >
                            Request Information
                        </a>
                    </div>
                </div>

                {/* Similar Products Section */}
                {similarProducts.length > 0 && (
                    <div className="border-t border-gray-200 pt-12">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Similar Products</h2>
                        <div className="relative">
                            <div className="flex overflow-x-auto gap-6 pb-6 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
                                {similarProducts.map((similar) => (
                                    <Link
                                        key={similar.id}
                                        to={`/products/${similar.slug}`}
                                        className="flex-shrink-0 w-64 snap-start bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden group"
                                    >
                                        <div className="aspect-square bg-gray-100 relative overflow-hidden">
                                            {similar.image_url ? (
                                                <img
                                                    src={similar.image_url}
                                                    alt={similar.name}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                    <ShoppingBag size={32} />
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-4">
                                            <h3 className="font-semibold text-gray-900 mb-1 truncate" title={similar.name}>
                                                {similar.name}
                                            </h3>
                                            {similar.price_range && (
                                                <p className="text-blue-600 font-medium text-sm mb-3">{similar.price_range}</p>
                                            )}
                                            <span className="text-sm text-blue-600 font-medium group-hover:underline">
                                                View Details
                                            </span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
