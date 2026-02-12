import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { removeFromCart, updateQuantity } from '../store/slices/cartSlice';
import { Link } from 'react-router-dom';
import { FiTrash2, FiPlus, FiMinus } from 'react-icons/fi';
import { useQuery } from '@tanstack/react-query';
import { ProductService } from '../services/product.service';
import { Product } from '../types';
import { ProductCard } from '../components/ProductCard';

export const CartPage = () => {
  const { items, total } = useSelector((state: RootState) => state.cart);
  const dispatch = useDispatch();

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-gray-600 mb-4">Your cart is empty</p>
        <Link to="/products" className="btn-primary inline-block">
          Continue Shopping
        </Link>
      </div>
    );
  }

  const FREE_SHIPPING_THRESHOLD = 999;
  const progress = Math.min((total / FREE_SHIPPING_THRESHOLD) * 100, 100);
  const remaining = FREE_SHIPPING_THRESHOLD - total;

  return (
    <div className="container mx-auto px-4 py-4">
      {/* Free Shipping Meter */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
        {total >= FREE_SHIPPING_THRESHOLD ? (
          <div className="text-green-600 font-bold flex items-center gap-2">
            ✅ You've unlocked FREE Shipping!
          </div>
        ) : (
          <div>
            <p className="text-gray-700 text-sm mb-2">
              Add <span className="font-bold text-primary-600">₹{remaining}</span> more for <span className="font-bold text-green-600">FREE Shipping</span>
            </p>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500 transition-all duration-500"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
        {items.map((item) => (
          <div key={item.id} className="flex gap-4 mb-4 pb-4 border-b last:border-0">
            <div className="w-24 h-24 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-bold text-gray-900 line-clamp-2">{item.name}</h3>
                <div className="text-right ml-2 shrink-0">
                  <span className="block font-bold text-gray-900">₹{item.price.toLocaleString()}</span>
                  {item.originalPrice && item.originalPrice > item.price && (
                    <span className="text-xs text-gray-500 line-through">₹{item.originalPrice.toLocaleString()}</span>
                  )}
                </div>
              </div>

              {/* Specs & Breakdown */}
              <div className="space-y-1 mb-3">
                {/* Priority Display from Breakdown */}
                {item.breakdown ? (
                  <>
                    {/* 1. Pack Badge */}
                    {item.breakdown.multiplier > 1 && (
                      <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded font-bold mr-2">
                        Pack of {item.breakdown.multiplier}
                      </span>
                    )}

                    {/* 2. Attributes */}
                    {item.breakdown.attributes.map((attr) => (
                      <div key={attr.key} className="text-sm text-gray-600 flex gap-1">
                        <span className="font-medium text-gray-800">{attr.key}:</span> {attr.value}
                      </div>
                    ))}

                    {/* 3. Add-Ons */}
                    {item.breakdown.addOns.length > 0 && (
                      <div className="text-sm text-purple-700 flex gap-1 flex-wrap mt-1">
                        <span className="font-medium">Extras:</span>
                        {item.breakdown.addOns.map((addon, i) => (
                          <span key={i} className="bg-purple-50 px-1.5 rounded">{addon}</span>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  // Fallback to legacy selectedAttributes
                  item.selectedAttributes && Object.entries(item.selectedAttributes).map(([key, value]) => (
                    <div key={key} className="text-sm text-gray-600 flex gap-1">
                      <span className="font-medium">{key}:</span> {value}
                    </div>
                  ))
                )}
              </div>

              {/* Quantity & Remove */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 border rounded-lg px-2 py-1 bg-white">
                  <button
                    onClick={() => dispatch(updateQuantity({ id: item.id, quantity: Math.max(1, item.quantity - 1) }))}
                    className="p-1 hover:bg-gray-100 rounded transition-colors text-gray-600"
                  >
                    <FiMinus size={14} />
                  </button>
                  <span className="font-medium text-sm w-4 text-center">{item.quantity}</span>
                  <button
                    onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))}
                    className="p-1 hover:bg-gray-100 rounded transition-colors text-gray-600"
                  >
                    <FiPlus size={14} />
                  </button>
                </div>

                <button
                  onClick={() => dispatch(removeFromCart(item.id))}
                  className="text-gray-400 hover:text-red-500 transition-colors p-2"
                  title="Remove item"
                >
                  <FiTrash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
        <div className="flex justify-between mb-2">
          <span>Subtotal</span>
          <span>₹{total}</span>
        </div>
        {total >= FREE_SHIPPING_THRESHOLD && (
          <div className="flex justify-between mb-2 text-green-600">
            <span>Shipping</span>
            <span>FREE</span>
          </div>
        )}
        <div className="flex justify-between mb-4">
          <span className="font-bold">Total</span>
          <span className="font-bold text-xl">₹{total}</span>
        </div>
        <Link
          to="/checkout"
          className="block w-full bg-primary-600 text-white py-3 rounded-lg font-medium text-center hover:bg-primary-700 transition-colors mb-4"
        >
          Proceed to Checkout
        </Link>

        {/* Trust Badges */}
        <div className="border-t pt-4 text-center">
          <p className="text-xs text-gray-500 mb-2 font-medium uppercase tracking-wide">Guaranteed Safe Checkout</p>
          <div className="flex justify-center gap-3 opacity-80 grayscale hover:grayscale-0 transition-all">
            <img src="https://cdn-icons-png.flaticon.com/512/196/196578.png" alt="Visa" className="h-6" />
            <img src="https://cdn-icons-png.flaticon.com/512/196/196561.png" alt="Mastercard" className="h-6" />
            <img src="https://cdn-icons-png.flaticon.com/512/196/196565.png" alt="PayPal" className="h-6" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/UPI-Logo-vector.svg/1280px-UPI-Logo-vector.svg.png" alt="UPI" className="h-6 object-contain" />
          </div>
          <div className="flex items-center justify-center gap-2 mt-3 text-xs text-gray-500">
            <span>🔒 SSL Encrypted</span>
            <span>•</span>
            <span>↩️ 7-Day Returns</span>
          </div>
        </div>
      </div>

      {/* You Might Also Like Section */}
      <RecommendationsSection />
    </div>
  );
};

const RecommendationsSection = () => {
  const { data } = useQuery({
    queryKey: ['products', 'featured', 4],
    queryFn: () => ProductService.getAllProducts({ limit: 4, sort: 'rating' }) // Fetch top rated or featured
  });

  if (!data || data.length === 0) return null;

  return (
    <div className="mt-12">
      <h2 className="text-xl font-bold mb-6 text-gray-900">You Might Also Like</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {data.map((product: Product) => (
          <ProductCard key={product.id || product._id} product={product as any} />
        ))}
      </div>
    </div>
  );
};
