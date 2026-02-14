import { Routes, Route } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout';
import { HomePage } from './pages/HomePage';
import { ProductListPage } from './pages/ProductListPage';
import ProductDetailPage from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrdersPage } from './pages/OrdersPage';
import { LoginPage } from './pages/LoginPage';
import { BulkEnquiryPage } from './pages/BulkEnquiryPage';
import { CategoryPage } from './pages/CategoryPage';
import { WishlistPage } from './pages/WishlistPage';
import { FAQPage } from './pages/FAQPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { TermsPage } from './pages/TermsPage';
import { ProtectedRoute } from './components/ProtectedRoute';
import { OrderDetailPage } from './pages/OrderDetailPage';
import { ProfilePage } from './pages/ProfilePage';
import { AboutUsPage } from './pages/AboutUsPage';
import { RefundPolicyPage } from './pages/RefundPolicyPage';
import { ShippingPolicyPage } from './pages/ShippingPolicyPage';
import { OrderSuccessPage } from './pages/OrderSuccessPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="products" element={<ProductListPage />} />
        <Route path="product/:id" element={<ProductDetailPage />} />
        <Route path="category/:categorySlug" element={<CategoryPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="bulk-enquiry" element={<BulkEnquiryPage />} />
        <Route path="faq" element={<FAQPage />} />
        <Route path="about" element={<AboutUsPage />} />
        <Route path="privacy-policy" element={<PrivacyPolicyPage />} />
        <Route path="terms" element={<TermsPage />} />
        <Route path="refund-policy" element={<RefundPolicyPage />} />
        <Route path="shipping-policy" element={<ShippingPolicyPage />} />
        <Route path="wishlist" element={<WishlistPage />} />
        <Route path="checkout" element={<CheckoutPage />} />
        <Route path="order-success" element={<OrderSuccessPage />} />
        <Route
          path="orders"
          element={
            <ProtectedRoute>
              <OrdersPage />
            </ProtectedRoute>
          }
        />
        <Route path="orders/:id" element={<OrderDetailPage />} />
        <Route
          path="profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  );
}

export default App;
