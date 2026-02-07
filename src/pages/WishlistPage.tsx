import { useState } from 'react';
import { useWishlist } from '../context/WishlistContext';
import { useNavigate } from 'react-router-dom';
import { FiTrash2, FiShoppingCart, FiHeart } from 'react-icons/fi';

export const WishlistPage = () => {
    const { wishlist, wishlistCount, removeFromWishlist, clearWishlist, isLoading } = useWishlist();
    const navigate = useNavigate();
    const [removingId, setRemovingId] = useState<string | null>(null);

    const handleRemove = async (productId: string) => {
        setRemovingId(productId);
        try {
            await removeFromWishlist(productId);
        } catch (error) {
            console.error('Failed to remove from wishlist:', error);
        } finally {
            setRemovingId(null);
        }
    };

    const handleMoveToCart = async (item: any) => {
        try {
            // Add to cart using Redux action
            window.dispatchEvent(new CustomEvent('addToCart', {
                detail: {
                    product: item.product,
                    quantity: 1
                }
            }));
            await removeFromWishlist(item.product._id);
        } catch (error) {
            console.error('Failed to move to cart:', error);
        }
    };

    const handleClearAll = async () => {
        if (window.confirm('Are you sure you want to clear your entire wishlist?')) {
            try {
                await clearWishlist();
            } catch (error) {
                console.error('Failed to clear wishlist:', error);
            }
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
                        <p className="text-gray-600 mt-1">{wishlistCount} {wishlistCount === 1 ? 'item' : 'items'}</p>
                    </div>
                    {wishlistCount > 0 && (
                        <button
                            onClick={handleClearAll}
                            className="px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2"
                        >
                            <FiTrash2 />
                            Clear All
                        </button>
                    )}
                </div>

                {/* Empty State */}
                {wishlistCount === 0 ? (
                    <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                        <FiHeart className="w-24 h-24 text-gray-300 mx-auto mb-4" />
                        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Your wishlist is empty</h2>
                        <p className="text-gray-600 mb-6">Save items you love to buy them later</p>
                        <button
                            onClick={() => navigate('/products')}
                            className="px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
                        >
                            Start Shopping
                        </button>
                    </div>
                ) : (
                    /* Wishlist Grid */
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {wishlist.map((item) => (
                            <div
                                key={item.product._id}
                                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden group"
                            >
                                {/* Product Image */}
                                <div className="relative aspect-square overflow-hidden bg-gray-100">
                                    <img
                                        src={item.product.images[0]}
                                        alt={item.product.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 cursor-pointer"
                                        onClick={() => navigate(`/product/${item.product._id}`)}
                                    />
                                    {item.product.stock === 0 && (
                                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                                            <span className="text-white font-semibold text-lg">Out of Stock</span>
                                        </div>
                                    )}
                                    <button
                                        onClick={() => handleRemove(item.product._id)}
                                        disabled={removingId === item.product._id}
                                        className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-red-50 transition-colors"
                                    >
                                        <FiTrash2 className="text-red-500" />
                                    </button>
                                </div>

                                {/* Product Info */}
                                <div className="p-4">
                                    <p className="text-xs text-gray-500 mb-1">{item.product.category.name}</p>
                                    <h3
                                        className="font-semibold text-gray-900 mb-2 line-clamp-2 cursor-pointer hover:text-amber-600"
                                        onClick={() => navigate(`/product/${item.product._id}`)}
                                    >
                                        {item.product.name}
                                    </h3>

                                    {/* Price */}
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="text-lg font-bold text-amber-600">
                                            ₹{item.product.price}
                                        </span>
                                        {item.product.originalPrice && (
                                            <span className="text-sm text-gray-500 line-through">
                                                ₹{item.product.originalPrice}
                                            </span>
                                        )}
                                    </div>

                                    {/* Rating */}
                                    <div className="flex items-center gap-1 mb-4">
                                        <span className="text-yellow-500">★</span>
                                        <span className="text-sm text-gray-600">
                                            {item.product.rating.toFixed(1)} ({item.product.totalReviews})
                                        </span>
                                    </div>

                                    {/* Actions */}
                                    <button
                                        onClick={() => handleMoveToCart(item)}
                                        disabled={item.product.stock === 0}
                                        className={`
                      w-full py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2
                      ${item.product.stock === 0
                                                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                                : 'bg-amber-600 text-white hover:bg-amber-700'
                                            }
                    `}
                                    >
                                        <FiShoppingCart />
                                        {item.product.stock === 0 ? 'Out of Stock' : 'Move to Cart'}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
