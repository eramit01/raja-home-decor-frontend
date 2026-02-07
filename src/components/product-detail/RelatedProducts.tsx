import { useEffect, useState } from 'react';
import { ProductService } from '../../services/product.service';
import { ProductCard } from '../ProductCard';
import { Product } from '../../types';

interface RelatedProductsProps {
    category: string;
    currentProductId: string;
}

export const RelatedProducts = ({ category, currentProductId }: RelatedProductsProps) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRelated = async () => {
            try {
                const all = await ProductService.getAllProducts({ category, limit: 5 });
                // Simple shuffle or filter
                const filtered = all
                    .filter((p: Product) => p.id !== currentProductId)
                    .slice(0, 4);
                setProducts(filtered);
            } catch (error) {
                console.error("Failed to load related products", error);
            } finally {
                setLoading(false);
            }
        };

        if (category) {
            fetchRelated();
        }
    }, [category, currentProductId]);

    if (loading || products.length === 0) return null;

    return (
        <div className="py-8 bg-gray-50 md:bg-white">
            <h2 className="text-xl font-bold mb-6 px-4 md:px-0">You May Also Like</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 px-4 md:px-0">
                {products.map(product => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </div>
    );
};
