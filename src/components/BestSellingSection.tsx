import { Link } from 'react-router-dom';
import { Product } from '../types';
import { ProductCard } from './ProductCard';

interface BestSellingSectionProps {
  products: Product[];
}

export const BestSellingSection = ({ products }: BestSellingSectionProps) => {
  return (
    <div className="bg-white py-4 mt-2">
      <div className="flex items-center justify-between mb-4 px-2">
        <h2 className="text-lg md:text-xl font-bold text-gray-900">Best Selling Products</h2>
        <Link
          to="/category/best-selling"
          className="text-primary-600 text-sm font-medium hover:text-primary-700 transition-colors flex items-center gap-1"
        >
          View All <span className="text-xl leading-none">→</span>
        </Link>
      </div>

      {/* Responsive Grid: 2 cols mobile, 3 tablet, 5 desktop, 6 large desktop */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2 md:gap-4">
        {products.map((product) => (
          <div key={product.id} className="h-full">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
};
