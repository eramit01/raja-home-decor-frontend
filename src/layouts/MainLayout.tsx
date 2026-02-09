import { Outlet, useLocation } from 'react-router-dom';

// import { useSelector } from 'react-redux';
import { Header } from '../components/Header';
import { CheckoutHeader } from '../components/CheckoutHeader';
import { BottomNav } from '../components/BottomNav';
import { CategorySection } from '../components/CategorySection';

import { CartDrawer } from '../components/CartDrawer';
// import { RootState } from '../store';


import { categories } from '../data/categories';

import { AnnouncementBar } from '../components/AnnouncementBar';
import { Footer } from '../components/Footer';
import { ScrollToTop } from '../components/ScrollToTop';

export const MainLayout = () => {
  const location = useLocation();
  // const { isCartOpen } = useSelector((state: RootState) => state.cart); -> Unused

  // Query removed in favor of static data
  // const { data: categoriesData } = useQuery({ ... });



  // Hide bottom nav only on checkout page, keep it visible elsewhere on mobile
  // Note: z-indexing in components must handle overlap with sticky product actions
  const isCheckoutPage = location.pathname === '/checkout';
  const isProductPage = location.pathname.startsWith('/product/');
  const showBottomNav = !isCheckoutPage && !isProductPage;

  return (
    <div className={`min-h-screen bg-gray-50 ${showBottomNav ? 'pb-16' : ''} md:pb-0`}>

      {isCheckoutPage ? (
        <CheckoutHeader />
      ) : (
        <>
          {/* Announcement Bar */}
          <AnnouncementBar />

          {/* Header - Internal responsive logic handles visibility */}
          <Header />

          {/* Global categories bar - just below header / top, with slight gap like Flipkart */}
          {categories.length > 0 && (
            <div className="bg-white mt-1 md:mt-2">
              <div className="container mx-auto px-4">
                <CategorySection categories={categories} />
              </div>
            </div>
          )}

          {/* Global banners removed to prevent duplication with HomePage */}

        </>
      )}

      <main>
        <Outlet />
      </main>
      {/* Footer - Hide on checkout, show elsewhere */}
      {!isCheckoutPage && <Footer />}

      {/* Mobile bottom navigation */}
      {showBottomNav && <BottomNav />}

      <ScrollToTop />

      {/* Global Cart Drawer */}
      <CartDrawer />
    </div>
  );
};
