import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { addToCart } from '../store/slices/cartSlice';
import { openLoginModal } from '../store/slices/uiSlice';
import { toast } from 'react-hot-toast';
import { calculateFinalPrice } from '../utils/pricingEngine';

import { FiShoppingBag } from 'react-icons/fi';
import { ImageGallery } from '../components/product-detail/ImageGallery';
import { PricingBlock } from '../components/product-detail/PricingBlock';
import { RatingsSummary } from '../components/product-detail/RatingsSummary';
import { SizeSelector } from '../components/product-detail/SizeSelector';
import { PackSelector } from '../components/product-detail/PackSelector';
import { VariantSelector } from '../components/product-detail/VariantSelector';
import { ProductDescription } from '../components/product-detail/ProductDescription';
import { ReviewsSection } from '../components/product-detail/ReviewsSection';
import { FAQSection } from '../components/product-detail/FAQSection';
import { RelatedProducts } from '../components/product-detail/RelatedProducts';
import { StickyBottomBar } from '../components/product-detail/StickyBottomBar';
import { EnhancedPriceBreakdown } from '../components/product-detail/EnhancedPriceBreakdown';
import { TrustBadges } from '../components/product-detail/TrustBadges';
import { api } from '../services/api';

interface Product {
  _id: string;
  name: string;
  description: string;
  shortDescription?: string;
  images: string[];
  price: number;
  originalPrice?: number;
  stock: number;
  rating: number;
  totalReviews: number;
  category: { _id: string; name: string; slug: string };

  // Universal Product Model
  variants?: Array<{
    _id: string;
    label: string;
    sku?: string;
    price: number;
    originalPrice?: number;
    stock: number;
    image?: string;
    isDefault?: boolean;
    packs?: Array<{
      _id: string;
      label: string;
      quantity: number;
      price: number;
      originalPrice?: number;
      isDefault?: boolean;
    }>;
  }>;

  styles?: Array<{
    _id: string;
    label: string;
    priceAdjustment: number;
    image?: string;
  }>;

  addOns?: Array<{
    _id: string;
    label: string;
    price: number;
    description?: string;
    required?: boolean;
  }>;

  // Legacy (Support fallback if needed)
  sizes?: Array<{ name: string; price: number }>;
  fragrances?: string[];
  packs?: Array<{
    label: string;
    quantity: number;
    pricingType: 'auto' | 'discount' | 'fixed';
    fixedPrice?: number;
    discountPercent?: number;
  }>;
  faqs?: Array<{ question: string; answer: string }>;
}

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);

  // Product state
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  // Universal Selection State
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);
  const [selectedPackId, setSelectedPackId] = useState<string | null>(null);
  const [selectedStyleId, setSelectedStyleId] = useState<string | null>(null);
  const [selectedAddOnIds, setSelectedAddOnIds] = useState<string[]>([]);

  // Legacy State (Keep for now or map to new)
  const [selectedSize, setSelectedSize] = useState<{ name: string; price: number } | null>(null);
  const [selectedFragrance, setSelectedFragrance] = useState<string>('');

  // UI state
  const [showFullDescription, setShowFullDescription] = useState(false);

  // Fetch product
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/products/${id}`);
        const data = response.data;

        if (data.success) {
          const fetchedProduct = data.data.product;
          setProduct(fetchedProduct);
        }
      } catch (error) {
        console.error('Failed to fetch product:', error);
        toast.error('Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  // Pricing Engine Calculation
  const pricingResult = product ? calculateFinalPrice(product, {
    variantId: selectedVariantId || undefined,
    packId: selectedPackId || undefined,
    styleId: selectedStyleId || undefined,
    addOnIds: selectedAddOnIds,
    quantity: 1
  }) : { finalPrice: 0, basePrice: 0, discountAmount: 0, discountPercent: 0, breakdown: { base: 0, packAdjustment: 0, styleAdjustment: 0, addOnsTotal: 0 } };

  // Handle Add to Cart
  const handleAddToCart = () => {
    if (!product) return;

    let selectedVariant = null;

    // Validation: Require Variant/Size selection if available
    if (product.variants && product.variants.length > 0) {
      if (!selectedVariantId) {
        toast.error('Please select an option (Size/Color)');
        return;
      }
      // Check stock for selected variant
      selectedVariant = product.variants.find(v => v._id === selectedVariantId);
      if (selectedVariant && selectedVariant.stock === 0) {
        toast.error('Selected variant is out of stock');
        return;
      }
    }

    // Validation: Legacy Size
    else if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      toast.error('Please select a size');
      return;
    }

    // Fragrance validation (Legacy support)
    if (product.fragrances && product.fragrances.length > 0 && !selectedFragrance) {
      toast.error('Please select a fragrance');
      return;
    }

    const cartItem = {
      productId: product._id,
      name: product.name,
      image: selectedVariant?.image || product.images[0],
      price: pricingResult.finalPrice,
      quantity: 1, // Default to 1
      variantId: selectedVariantId || undefined,
      packId: selectedPackId || undefined,
      styleId: selectedStyleId || undefined,
      addOnIds: selectedAddOnIds,
      // Legacy fields
      size: !selectedVariantId ? selectedSize?.name : undefined,
      fragrance: selectedFragrance
    };

    if (!user) {
      dispatch(openLoginModal({
        pendingAction: 'CART',
        pendingActionData: cartItem
      }));
      return;
    }

    dispatch(addToCart(cartItem));
    toast.success('Added to cart!');
  };

  // Handle Buy Now
  const handleBuyNow = () => {
    handleAddToCart();
    // navigate('/cart'); // handleAddToCart now handles redirect in LoginModal if not user
    if (user) navigate('/cart');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Product not found</h2>
          <button
            onClick={() => navigate('/')}
            className="text-primary-600 hover:underline"
          >
            Return to home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24 lg:pb-12">
      <div className="max-w-7xl mx-auto lg:px-4 lg:py-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-12 lg:items-start">

          {/* Left Column: Image Gallery (Sticky on Desktop) */}
          <div className="lg:col-span-5 xl:col-span-5 bg-white lg:rounded-2xl lg:shadow-sm lg:overflow-hidden lg:sticky lg:top-24 lg:max-w-md mx-auto w-full">
            <ImageGallery images={product.images} productName={product.name} />
          </div>

          {/* Right Column: Product Info & Controls */}
          <div className="lg:col-span-7 xl:col-span-7 mt-0">
            <div className="bg-white lg:rounded-2xl lg:shadow-sm p-4 lg:p-8 flex flex-col gap-6 lg:gap-8">

              {/* Header Section */}
              <div className="border-b border-gray-100 pb-6">
                <div className="flex items-start justify-between">
                  <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 leading-tight">
                    {product.name}
                  </h1>
                </div>

                <div className="mt-3 flex items-center gap-4">
                  <RatingsSummary
                    rating={product.rating}
                    totalReviews={product.totalReviews}
                  />
                  {product.category && (
                    <span className="text-sm font-medium text-primary-600 bg-primary-50 px-2 py-1 rounded-md">
                      {product.category.name}
                    </span>
                  )}
                </div>

                <div className="mt-4">
                  <PricingBlock
                    price={pricingResult.finalPrice}
                    originalPrice={pricingResult.basePrice}
                  />
                </div>
              </div>

              {/* Selection Sections */}
              <div className="space-y-6">

                {/* Legacy Size Selection (Fallback if no variants) */}
                {(!product.variants || product.variants.length === 0) && product.sizes && product.sizes.length > 0 && (
                  <SizeSelector
                    sizes={product.sizes}
                    selectedSize={selectedSize}
                    onSelectSize={setSelectedSize}
                  />
                )}

                {/* Variant Selection */}
                {product.variants && product.variants.length > 0 && (
                  <VariantSelector
                    variants={product.variants as any}
                    selectedVariantId={selectedVariantId}
                    onSelectVariant={(variantId) => {
                      setSelectedVariantId(variantId);
                      const variant = product.variants?.find(v => v._id === variantId);
                      if (variant && variant.packs && variant.packs.length > 0) {
                        setSelectedPackId(variant.packs[0]._id);
                      } else {
                        setSelectedPackId(null);
                      }
                    }}
                  />
                )}

                {/* Pack Selection (Context Aware) */}
                {(() => {
                  const activeVariant = product.variants?.find(v => v._id === selectedVariantId);
                  const activePacks = activeVariant?.packs || product.packs;

                  if (activePacks && activePacks.length > 0) {
                    return (
                      <PackSelector
                        packs={activePacks as any}
                        fragrances={product.fragrances || []}
                        selectedPackId={selectedPackId}
                        selectedFragrance={selectedFragrance}
                        onSelectPack={setSelectedPackId}
                        onSelectFragrance={setSelectedFragrance}
                        basePrice={pricingResult.basePrice}
                        baseOriginalPrice={product.originalPrice}
                        productImage={activeVariant?.image || product.images[0]}
                      />
                    );
                  }
                  return null;
                })()}

                {/* Styles Selection */}
                {product.styles && product.styles.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-base font-bold text-gray-900 uppercase tracking-wider">Customize Style</h3>
                    <div className="flex flex-wrap gap-3">
                      {product.styles.map((style) => {
                        const isSelected = selectedStyleId === style._id;
                        return (
                          <button
                            key={style._id}
                            onClick={() => setSelectedStyleId(isSelected ? null : style._id)}
                            className={`flex flex-col items-center justify-center px-4 py-3 rounded-xl border-2 transition-all min-w-[100px] text-center ${isSelected
                              ? 'border-primary-600 bg-primary-50 text-primary-700 font-bold ring-1 ring-primary-600'
                              : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                              }`}
                          >
                            <div className="text-sm font-bold whitespace-nowrap">{style.label}</div>
                            {style.priceAdjustment > 0 && (
                              <div className="text-xs mt-0.5 font-bold text-gray-600">+₹{style.priceAdjustment}</div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Add-Ons Selection */}
                {product.addOns && product.addOns.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-base font-bold text-gray-900 uppercase tracking-wider">Add-Ons</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {product.addOns.map((addon) => {
                        const isSelected = selectedAddOnIds.includes(addon._id);
                        return (
                          <label key={addon._id} className={`flex items-center justify-between p-4 border-2 rounded-xl cursor-pointer transition-colors ${isSelected ? 'border-primary-600 bg-primary-50' : 'border-gray-200 hover:border-gray-300'}`}>
                            <div className="flex items-center gap-3">
                              <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${isSelected ? 'bg-primary-600 border-primary-600 text-white' : 'border-gray-300 bg-white'}`}>
                                {isSelected && <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                              </div>
                              <div className="flex flex-col">
                                <span className={`text-sm font-bold ${isSelected ? 'text-primary-900' : 'text-gray-900'}`}>{addon.label}</span>
                                {addon.description && <span className="text-xs text-gray-500">{addon.description}</span>}
                              </div>
                            </div>
                            <span className="text-sm font-bold text-gray-900">+₹{addon.price}</span>
                            <input
                              type="checkbox"
                              className="hidden"
                              checked={isSelected}
                              onChange={() => {
                                if (isSelected) {
                                  setSelectedAddOnIds(prev => prev.filter(id => id !== addon._id));
                                } else {
                                  setSelectedAddOnIds(prev => [...prev, addon._id]);
                                }
                              }}
                            />
                          </label>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Price Breakdown & Trust Badges */}
              <div className="space-y-6">
                {(pricingResult.breakdown.packAdjustment !== 0 || pricingResult.breakdown.styleAdjustment > 0 || pricingResult.breakdown.addOnsTotal > 0) && (
                  <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                    <div className="flex justify-between text-gray-600">
                      <span>Base Price</span>
                      <span>₹{pricingResult.breakdown.base}</span>
                    </div>
                    {pricingResult.breakdown.packAdjustment !== 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Pack Savings</span>
                        <span>{pricingResult.breakdown.packAdjustment > 0 ? '+' : ''}₹{pricingResult.breakdown.packAdjustment}</span>
                      </div>
                    )}
                    {pricingResult.breakdown.styleAdjustment > 0 && (
                      <div className="flex justify-between text-gray-600">
                        <span>Style Adjustment</span>
                        <span>+₹{pricingResult.breakdown.styleAdjustment}</span>
                      </div>
                    )}
                    {pricingResult.breakdown.addOnsTotal > 0 && (
                      <div className="flex justify-between text-gray-600">
                        <span>Add-Ons</span>
                        <span>+₹{pricingResult.breakdown.addOnsTotal}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Desktop CTA */}
                <div className="hidden lg:flex flex-col gap-3">
                  <div className="flex gap-4">
                    <button
                      onClick={handleAddToCart}
                      disabled={product.stock === 0}
                      className="flex-1 py-3.5 px-6 border border-gray-300 text-gray-900 font-bold rounded-full hover:border-gray-900 hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
                    >
                      <FiShoppingBag className="w-5 h-5 text-gray-500 group-hover:text-gray-900 transition-colors" />
                      <span>Add to Cart</span>
                    </button>
                    <button
                      onClick={handleBuyNow}
                      disabled={product.stock === 0}
                      className="flex-[1.5] py-3.5 px-6 bg-gray-900 text-white font-bold rounded-full hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      <span>Buy Now</span>
                    </button>
                  </div>
                  {product.stock === 0 && (
                    <p className="text-red-500 text-sm font-medium text-center">Currently Out of Stock</p>
                  )}
                  <p className="text-center text-xs text-gray-500 mt-2">
                    Free shipping on all prepaid orders • 7-day easy returns
                  </p>
                </div>
                <TrustBadges />
              </div>

              {/* Product Description Accordion/Block - Desktop Only */}
              <div className="hidden lg:block border-t border-gray-100 pt-6">
                <ProductDescription
                  shortDescription={product.shortDescription || product.description.substring(0, 150)}
                  fullDescription={product.description}
                  showFull={showFullDescription}
                  onToggle={() => setShowFullDescription(!showFullDescription)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Full-Width Sections (Reviews, FAQ, Related) */}
        <div className="mt-8 lg:mt-12 space-y-6 lg:space-y-12">
          {/* Mobile-only short description */}
          <div className="lg:hidden px-4">
            <ProductDescription
              shortDescription={product.shortDescription || product.description.substring(0, 200)}
              fullDescription={product.description}
              showFull={showFullDescription}
              onToggle={() => setShowFullDescription(!showFullDescription)}
            />
          </div>

          <div className="bg-white lg:rounded-2xl lg:shadow-sm px-4 py-6 lg:p-8">
            <ReviewsSection productId={product._id} />
          </div>

          {product.faqs && product.faqs.length > 0 && (
            <div className="bg-white lg:rounded-2xl lg:shadow-sm px-4 py-6 lg:p-8">
              <FAQSection faqs={product.faqs} />
            </div>
          )}

          <div className="pb-8">
            <RelatedProducts productId={product._id} categoryId={product.category._id} />
          </div>
        </div>
      </div>

      {/* Mobile Sticky Bottom Bar (Hidden on Desktop) */}
      <div className="lg:hidden">
        <StickyBottomBar
          finalPrice={pricingResult.finalPrice}
          onAddToCart={handleAddToCart}
          onBuyNow={handleBuyNow}
          disabled={product.stock === 0}
        />
      </div>
    </div>
  );
};

export default ProductDetailPage;
