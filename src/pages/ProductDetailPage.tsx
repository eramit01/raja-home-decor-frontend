import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { addToCart } from '../store/slices/cartSlice';
import { openLoginModal } from '../store/slices/uiSlice';
import { toast } from 'react-hot-toast';

// Components (to be created)
import { ImageGallery } from '../components/product-detail/ImageGallery';
import { PricingBlock } from '../components/product-detail/PricingBlock';
import { RatingsSummary } from '../components/product-detail/RatingsSummary';
import { SizeSelector } from '../components/product-detail/SizeSelector';
import { PackSelector } from '../components/product-detail/PackSelector';
import { ProductDescription } from '../components/product-detail/ProductDescription';
import { ReviewsSection } from '../components/product-detail/ReviewsSection';
import { FAQSection } from '../components/product-detail/FAQSection';
import { RelatedProducts } from '../components/product-detail/RelatedProducts';
import { StickyBottomBar } from '../components/product-detail/StickyBottomBar';
import { EnhancedPriceBreakdown } from '../components/product-detail/EnhancedPriceBreakdown';
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

  // Mobile PDP specific
  sizes?: Array<{ name: string; price: number }>;
  fragrances?: string[];
  packs?: Array<{
    label: string;
    quantity: number;
    pricingType: 'auto' | 'discount' | 'fixed';
    fixedPrice?: number;
    discountPercent?: number;
  }>;
  lidOption?: { enabled: boolean; price: number };
  productType?: 'simple' | 'configurable';
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

  // Selection state
  const [selectedSize, setSelectedSize] = useState<{ name: string; price: number } | null>(null);
  const [selectedPack, setSelectedPack] = useState<number>(0); // Pack index
  const [selectedFragrance, setSelectedFragrance] = useState<string>('');
  const [includeLid, setIncludeLid] = useState(false);

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
          setProduct(data.data.product);

          // Set default selections
          if (data.data.product.sizes && data.data.product.sizes.length > 0) {
            setSelectedSize(data.data.product.sizes[0]);
          }
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

  // Calculate final price
  const calculateFinalPrice = (): number => {
    if (!product) return 0;

    let basePrice = selectedSize ? selectedSize.price : product.price;

    // Add lid price if selected
    if (includeLid && product.lidOption?.enabled) {
      basePrice += product.lidOption.price;
    }

    // Apply pack multiplier
    if (product.packs && product.packs.length > 0) {
      const pack = product.packs[selectedPack];

      switch (pack.pricingType) {
        case 'fixed':
          return pack.fixedPrice || basePrice * pack.quantity;
        case 'discount':
          if (pack.discountPercent) {
            return basePrice * pack.quantity * (1 - pack.discountPercent / 100);
          }
          return basePrice * pack.quantity;
        case 'auto':
        default:
          return basePrice * pack.quantity;
      }
    }

    return basePrice;
  };

  // Handle Add to Cart
  const handleAddToCart = () => {
    if (!user) {
      dispatch(openLoginModal());
      return;
    }

    if (!product) return;

    // Validation
    if (product.packs && product.packs.length > 0 && !selectedFragrance) {
      toast.error('Please select a fragrance');
      return;
    }

    const cartItem = {
      productId: product._id,
      name: product.name,
      image: product.images[0],
      price: calculateFinalPrice(),
      quantity: 1,
      size: selectedSize?.name,
      pack: product.packs?.[selectedPack]?.label,
      fragrance: selectedFragrance,
      includeLid
    };

    dispatch(addToCart(cartItem));
    toast.success('Added to cart!');
  };

  // Handle Buy Now
  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/cart');
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
            <div className="bg-white lg:rounded-2xl lg:shadow-sm p-4 lg:p-8 flex flex-col gap-4 lg:gap-8">

              {/* Desktop Header: Title & Pricing */}
              <div>
                <h1 className="text-xl lg:text-3xl font-bold text-gray-900 leading-tight">
                  {product.name}
                </h1>

                <div className="mt-4 flex items-center justify-between">
                  <PricingBlock
                    price={calculateFinalPrice()}
                    originalPrice={product.originalPrice}
                  />
                  <RatingsSummary
                    rating={product.rating}
                    totalReviews={product.totalReviews}
                  />
                </div>
              </div>

              {/* Desktop CTA (Hidden on Mobile, shown on Desktop) */}
              <div className="hidden lg:flex flex-col gap-3">
                <div className="flex gap-3">
                  <button
                    onClick={handleAddToCart}
                    disabled={product.stock === 0}
                    className="flex-1 py-4 bg-gray-100 text-gray-900 font-bold rounded-xl hover:bg-gray-200 transition-colors disabled:opacity-50"
                  >
                    Add to Cart
                  </button>
                  <button
                    onClick={handleBuyNow}
                    disabled={product.stock === 0}
                    className="flex-[1.5] py-4 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition-colors shadow-lg shadow-primary-100 disabled:opacity-50"
                  >
                    Buy Now
                  </button>
                </div>
                {product.stock === 0 && (
                  <p className="text-red-500 text-sm font-medium text-center">Out of Stock</p>
                )}
              </div>

              <div className="border-t border-gray-100 lg:hidden" />

              {/* Selection Sections */}
              <div className="space-y-6">
                {/* Size Selection */}
                {product.sizes && product.sizes.length > 0 && (
                  <SizeSelector
                    sizes={product.sizes}
                    selectedSize={selectedSize}
                    onSelectSize={setSelectedSize}
                  />
                )}

                {/* Pack Selection */}
                {product.packs && product.packs.length > 0 && (
                  <PackSelector
                    packs={product.packs}
                    fragrances={product.fragrances || []}
                    selectedPack={selectedPack}
                    selectedFragrance={selectedFragrance}
                    onSelectPack={setSelectedPack}
                    onSelectFragrance={setSelectedFragrance}
                    productImage={product.images[0]}
                    basePrice={selectedSize?.price || product.price}
                  />
                )}

                {/* Lid Option */}
                {product.lidOption?.enabled && (
                  <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
                    <input
                      type="checkbox"
                      checked={includeLid}
                      onChange={(e) => setIncludeLid(e.target.checked)}
                      className="w-5 h-5 text-primary-600 rounded border-gray-300"
                    />
                    <div className="flex-1">
                      <span className="font-medium text-gray-900">Add Lid</span>
                      <span className="text-sm text-gray-600 ml-2">
                        +₹{product.lidOption.price}
                      </span>
                    </div>
                  </label>
                )}
              </div>

              {/* Enhanced Price Breakdown */}
              <EnhancedPriceBreakdown
                basePrice={product.price}
                selectedSize={selectedSize}
                includeLid={includeLid}
                lidPrice={product.lidOption?.price}
                selectedPack={product.packs?.[selectedPack]}
                finalPrice={calculateFinalPrice()}
              />

              {/* Short Description (Visible on Desktop Right Sidebar) */}
              <div className="hidden lg:block border-t border-gray-100 pt-6">
                <ProductDescription
                  shortDescription={product.shortDescription || product.description.substring(0, 200)}
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
          finalPrice={calculateFinalPrice()}
          onAddToCart={handleAddToCart}
          onBuyNow={handleBuyNow}
          disabled={product.stock === 0}
        />
      </div>
    </div>
  );
};

export default ProductDetailPage;
