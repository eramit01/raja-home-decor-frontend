import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiStar } from 'react-icons/fi';
import { api } from '../../services/api';

interface Product {
    _id: string;
    name: string;
    images: string[];
    price: number;
    originalPrice?: number;
    rating: number;
}

interface RelatedProductsProps {
    productId: string;
    categoryId: string;
}

export const RelatedProducts = ({ productId, categoryId }: RelatedProductsProps) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRelatedProducts = async () => {
            try {
                setLoading(true);
                const response = await api.get(`/products/${productId}/related?limit=10`);
                const data = response.data;

                if (data.success) {
                    setProducts(data.data.products);
                }
            } catch (error) {
                console.error('Failed to fetch related products:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchRelatedProducts();
    }, [productId]);

    if (loading) {
        return (
            <div className="px-4">
                <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                </div>
            </div>
        );
    }

    if (products.length === 0) {
        return null;
    }

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900 px-4">You May Also Like</h3>

            <div className="overflow-x-auto scrollbar-hide">
                <div className="flex gap-3 px-4 pb-2">
                    {products.map((product) => (
                        <Link
                            key={product._id}
                            to={`/product/${product._id}`}
                            className="flex-shrink-0 w-40 bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow"
                        >
                            {/* Product Image */}
                            <div className="w-full aspect-square bg-gray-100">
                                <img
                                    src={product.images[0]}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {/* Product Info */}
                            <div className="p-3">
                                <h4 className="text-sm font-medium text-gray-900 line-clamp-2 mb-2">
                                    {product.name}
                                </h4>

                                {/* Price */}
                                <div className="flex items-baseline gap-1 mb-1">
                                    <span className="text-base font-bold text-gray-900">
                                        ₹{product.price.toLocaleString('en-IN')}
                                    </span>
                                    {product.originalPrice && product.originalPrice > product.price && (
                                        <span className="text-xs text-gray-500 line-through">
                                            ₹{product.originalPrice.toLocaleString('en-IN')}
                                        </span>
                                    )}
                                </div>

                                {/* Rating */}
                                {product.rating > 0 && (
                                    <div className="flex items-center gap-1 text-xs">
                                        <div className="flex items-center gap-0.5 px-1.5 py-0.5 bg-green-600 text-white rounded">
                                            <span>{product.rating.toFixed(1)}</span>
                                            <FiStar size={10} fill="white" />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};
