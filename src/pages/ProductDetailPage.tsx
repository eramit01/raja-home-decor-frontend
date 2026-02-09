import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { addToCart, openCart } from '../store/slices/cartSlice';
import { ProductService } from '../services/product.service';
import { generateDefaultSections } from '../utils/productAdapter';
import { Product } from '../types';
import { ProductInfo } from '../components/product-detail/ProductInfo';
import { ProductImageGallery } from '../components/product-detail/ProductImageGallery';
import { StickyCTABar } from '../components/product-detail/StickyCTABar';
import { DesktopStickyHeader } from '../components/product-detail/DesktopStickyHeader';
import { SectionRenderer } from '../components/SectionRenderer';
import { DeliveryChecker } from '../components/product-detail/DeliveryChecker';
import { TrustStrip } from '../components/product-detail/TrustStrip';
import { ReviewsSection } from '../components/product-detail/ReviewsSection';
import '../components/product-detail/gallery.css';
import { RelatedProducts } from '../components/product-detail/RelatedProducts';
import { FiShoppingBag, FiZap, FiAlertCircle } from 'react-icons/fi';
import { openLoginModal } from '../store/slices/uiSlice';
import { toast } from 'react-hot-toast';
import { SEO } from '../components/SEO';

export const ProductDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isCartOpen } = useSelector((state: RootState) => state.cart);
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPackId, setSelectedPackId] = useState<string | undefined>('pack-1');

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        const data = await ProductService.getProductById(id);
        // Adapt backend data
        const adaptedPlain: Product = {
          ...data,
          id: data._id,
          title: data.name,
          rating: data.product?.rating || data.rating || 4.5,
          totalReviews: data.product?.totalReviews || data.totalReviews || 0,
          originalPrice: data.price * 1.2,
          category: data.category || 'General',
        };
        // Add generated sections
        (adaptedPlain as any).sections = generateDefaultSections(adaptedPlain);

        setProduct(adaptedPlain);
      } catch (error) {
        console.error("Failed to fetch product details", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProduct();
    window.scrollTo(0, 0);
  }, [id]);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  // Handle "Not Found" case
  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-4">
        <h2 className="text-2xl font-bold">Product not found</h2>
        <p className="text-gray-600">The product "{id}" could not be found.</p>
        <button onClick={() => window.history.back()} className="text-blue-600 underline">Go Back</button>
      </div>
    );
  }

  // Handle Pack Selection Logic (if relevant)
  // Check if sections exists on product type or cast to any if extended
  const sections = (product as any).sections || [];
  const packSection = sections.find((s: any) => s.type === 'pack_selection');
  const packs = packSection?.data?.packs || [];
  const selectedPack = packs.find((p: any) => p.id === selectedPackId) || packs[0];

  const currentPrice = selectedPack ? selectedPack.price : product.price;
  const currentOriginalPrice = selectedPack ? (selectedPack.originalPrice || selectedPack.price) : product.originalPrice;
  const currentTitle = selectedPack ? `${product.title} - ${selectedPack.label}` : product.title;

  const getCartItem = () => ({
    productId: product.id,
    name: currentTitle,
    image: product.images[0],
    price: currentPrice,
    originalPrice: currentOriginalPrice,
    quantity: 1,
    attributes: {
      pack: selectedPack?.label,
    }
  });

  // Handle Pack Selection Logic (if relevant)
  // Check if sections exists on product type or cast to any if extended

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      dispatch(openLoginModal({ pendingAction: 'CART', pendingActionData: getCartItem() }));
      return;
    }
    dispatch(addToCart(getCartItem()));
    dispatch(openCart());
  };

  const handleBuyNow = () => {
    if (!isAuthenticated) {
      dispatch(openLoginModal({ pendingAction: 'CHECKOUT', pendingActionData: getCartItem() }));
      return;
    }
    dispatch(addToCart(getCartItem()));
    navigate('/checkout');
  };

  return (
    <div className="bg-gray-100 min-h-screen pb-24 md:pb-0 relative">
      <SEO
        title={product.title}
        description={product.description || `Buy ${product.title} online at best price.`}
        image={product.images?.[0]}
        url={window.location.href}
      />
      <DesktopStickyHeader
        title={product.title}
        image={product.images[0]}
        price={currentPrice}
        originalPrice={currentOriginalPrice}
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
        isAuthenticated={isAuthenticated}
      />

      {/* Breadcrumb - Optional but good for SEO */}
      {/* On Flipkart, this is usually inside the white area, but keeping it top is fine */}
      <div className="bg-white px-4 py-2 text-xs text-gray-500 border-b md:border-none md:bg-gray-100 md:container md:mx-auto md:px-0 md:py-3">
        <Link to="/" className="hover:text-primary-600">Home</Link>
        <span className="mx-1">/</span>
        {product.category && (
          <>
            <Link to={`/category/${product.category}`} className="hover:text-primary-600 capitalize">{product.category.replace('-', ' ')}</Link>
            <span className="mx-1">/</span>
          </>
        )}
        <span className="text-gray-900">{product.title}</span>
      </div>

      <div className="md:container md:mx-auto md:bg-white md:shadow-sm md:rounded-sm overflow-hidden md:mt-2">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-0">

          {/* LEFT COLUMN: Gallery & Buttons (Desktop) */}
          <div className="md:col-span-5 lg:col-span-4 bg-white p-4 sticky top-0 md:border-r border-gray-100">
            <div className="relative">
              <ProductImageGallery images={product.images} />
            </div>

            {/* DESKTOP BUTTONS */}
            <div className="hidden md:flex gap-3 mt-4">
              <button
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className={`flex-1 py-4 font-bold text-base uppercase shadow-sm rounded-sm flex items-center justify-center gap-2 transition-transform active:scale-[0.98] ${product.stock <= 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#ff9f00] hover:bg-[#ff9000] text-white'}`}
              >
                <FiShoppingBag className="w-5 h-5" />
                {product.stock <= 0 ? 'Out of Stock' : (isAuthenticated ? 'Add to Cart' : 'Login to Add')}
              </button>
              <button
                onClick={handleBuyNow}
                disabled={product.stock <= 0}
                className={`flex-1 py-4 font-bold text-base uppercase shadow-sm rounded-sm flex items-center justify-center gap-2 transition-transform active:scale-[0.98] ${product.stock <= 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#fb641b] hover:bg-[#fb541b] text-white'}`}
              >
                <FiZap className="w-5 h-5" />
                {product.stock <= 0 ? 'Out of Stock' : (isAuthenticated ? 'Buy Now' : 'Login to Buy')}
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN: Details */}
          <div className="md:col-span-7 lg:col-span-8 p-0 md:p-6 bg-white md:bg-transparent">

            {/* Scrollable content container */}
            <div className="space-y-4 md:space-y-6">

              {/* Product Info (Title, Price, Rating) */}
              <div className="bg-white p-4 md:p-0 md:bg-transparent">
                <ProductInfo
                  title={product.title}
                  badges={product.tags && product.tags.length > 0 ? [product.tags[0]] : []}
                  price={currentPrice}
                  originalPrice={currentOriginalPrice}
                  discount={product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0}
                  rating={product.rating}
                  reviewCount={product.totalReviews}
                  stock={product.stock || 0} // Pass stock
                />


                <DeliveryChecker />
              </div>

              {/* Trust Strip - Global for all products */}
              <div className="bg-white px-2 py-4 md:bg-transparent">
                <TrustStrip />
              </div>

              {/* Dynamic Sections from Data */}
              {(product as any).sections.map((section: any) => (
                <div key={section.id} className="bg-white md:bg-transparent -mt-2 md:mt-0">
                  <SectionRenderer
                    section={section}
                    state={{
                      selectedPackId,
                      candleCount: 1, // Default or manage state
                      selectedFragrances: [], // Default or manage state
                      category: product.category,
                      currentProductId: product.id
                    }}
                    actions={{
                      onSelectPack: setSelectedPackId,
                      onFragranceChange: () => { } // Implement if needed
                    }}
                  />
                </div>
              ))}

              {/* Reviews Section */}
              <div className="bg-white md:bg-transparent -mt-2 md:mt-0">
                <ReviewsSection productId={product.id} />
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Related Products Section */}
      <div className="md:container md:mx-auto mt-8 md:mt-12 mb-12">
        <RelatedProducts category={product.category} currentProductId={product.id} />
      </div>

      {/* MOBILE STICKY BUTTONS (Hidden on Desktop, Hidden if Cart Drawer is Open) */}
      {!isCartOpen && (
        <StickyCTABar
          price={currentPrice}
          originalPrice={currentOriginalPrice}
          onAddToCart={handleAddToCart}
          onBuyNow={handleBuyNow}
          className="md:hidden"
          isAuthenticated={isAuthenticated}
        />
      )}

    </div>
  );
};
export default ProductDetailPage;
