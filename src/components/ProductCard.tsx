import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { Product } from '../types';
import { formatPrice, truncate } from '../lib/format';
import { ShareButton, BASE_URL } from './ShareButton';

interface Props {
  product: Product;
  categoryName?: string;
}

export function ProductCard({ product, categoryName }: Props) {
  const price = formatPrice(product.price_range);
  const isPOR = price === 'Price on Request';

  return (
    <div className="group relative bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
      <Link to={`/products/${product.slug}`} className="block relative">
        <div className="relative h-44 bg-gray-50 overflow-hidden">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300">
              <ShoppingBag size={40} />
            </div>
          )}
        </div>
      </Link>

      <div className="absolute top-2 right-2 z-10">
        {/*
          SSR/SSG fix: previously `${window.location.origin}/products/${product.slug}`.
          window.location is not available during vite-react-ssg pre-rendering (Node.js).
          Use the imported BASE_URL constant instead.
        */}
        <ShareButton
          productName={product.name}
          url={`${BASE_URL}/products/${product.slug}`}
          categoryName={categoryName}
          description={product.description}
          specifications={product.specifications as Record<string, unknown>}
          imageUrl={product.image_url}
          price={price}
        />
      </div>

      <div className="p-4 flex flex-col gap-2">
        <Link to={`/products/${product.slug}`}>
          <h3 className="font-semibold text-gray-900 text-sm leading-snug hover:text-[#0f3460] transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>
        <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
          {truncate(product.description ?? '', 90)}
        </p>
        <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-100">
          <span className={`text-sm font-semibold ${isPOR ? 'text-gray-400 italic' : 'text-[#0f3460]'}`}>
            {price}
          </span>
          <Link
            to={`/products/${product.slug}`}
            className="text-xs font-semibold text-white bg-[#e94560] hover:bg-[#c73652] px-3 py-1.5 rounded-lg transition-colors"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}