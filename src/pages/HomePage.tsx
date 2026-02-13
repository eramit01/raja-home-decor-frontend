import { useState, useEffect } from 'react';
import { ProductService as productService } from '../services/product.service';
import { bannerService } from '../services/banner.service';
import { Product } from '../types';

import { BannerSlider } from '../components/BannerSlider';
import { categoryService, Category } from '../services/category.service';
import { CategoryProductSection } from '../components/CategoryProductSection';
import { BestSellingSection } from '../components/BestSellingSection';
import { TrustStrip } from '../components/TrustStrip';
import { WhyChooseUs } from '../components/WhyChooseUs';
import { BulkCTASection } from '../components/BulkCTASection';

export const HomePage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [banners, setBanners] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsData, bannersData, categoriesData] = await Promise.all([
          productService.getAllProducts({ showOnHome: true, limit: 500 } as any), // Fetch only home products
          bannerService.getActiveBanners(),
          categoryService.getCategories()
        ]);

        // Process Products
        const mappedProducts: Product[] = productsData.map((p: any) => ({
          ...p,
          id: p._id,
          title: p.name,
          rating: p.rating || 4.5,
          totalReviews: p.reviews?.length || 0,
          originalPrice: p.price * 1.2,
          // Robust Category Mapping
          categoryId: p.category?._id || (typeof p.category === 'string' ? p.category : undefined),
          categorySlug: p.category?.slug,
          categoryName: p.category?.name,
        }));
        setProducts(mappedProducts);

        // Process Banners
        console.log('Banners Data Response:', bannersData);
        if (bannersData?.data?.banners) {
          console.log('Setting Banners:', bannersData.data.banners);
          setBanners(bannersData.data.banners);
        } else {
          console.warn('No banners found in response');
        }

        // Process Categories
        if (categoriesData?.data?.categories) {
          setCategories(categoriesData.data.categories);
        }

      } catch (error) {
        console.error('Failed to fetch home data', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter products for category sections
  const getProductsForSection = (categorySlug: string) => {
    if (categorySlug === 'best-selling') {
      return products.filter(p => p.isBestSeller).slice(0, 6);
    }

    // Find target category for ID matching
    const targetCategory = categories.find(c => c.slug === categorySlug);

    if (categorySlug.includes('votive')) {
      console.log(`[DEBUG] Checking Votives. Slug: ${categorySlug}`, targetCategory);
      console.log(`[DEBUG] Total Products: ${products.length}`);
      const possibleMatches = products.filter(p =>
        (p.categoryName && p.categoryName.toLowerCase().includes('votive')) ||
        (p.categorySlug && p.categorySlug.includes('votive'))
      );
      console.log(`[DEBUG] Potential Votive candidates:`, possibleMatches);
    }

    // Filter by Category Slug
    const categoryProducts = products.filter(p => {
      // Match by ID (Robust String Comparison)
      if (p.categoryId && targetCategory && String(targetCategory._id) === String(p.categoryId)) return true;

      // Match by Slug
      if (p.categorySlug && p.categorySlug === categorySlug) return true;

      // Match by Name (Case Insensitive)
      if (p.categoryName && targetCategory && p.categoryName.toLowerCase() === targetCategory.name.toLowerCase()) return true;

      // Fallback: Match by mapped category string
      if (p.category === categorySlug) return true;

      return false;
    });

    if (categorySlug.includes('votive')) {
      console.log(`[DEBUG] Final Matched Votives: ${categoryProducts.length}`);
    }

    return categoryProducts.slice(0, 6);
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      <div className="container mx-auto px-4 pt-4">
      </div>

      {/* Banner Slider - Full Width */}
      <div className="w-full mt-2">
        <BannerSlider banners={banners} />
      </div>

      {/* Trust Strip Section */}
      <TrustStrip />

      <div className="container mx-auto px-4">
        {/* Best Selling Section */}
        <BestSellingSection products={getProductsForSection('best-selling')} />
      </div>

      {/* Category Product Sections */}
      <div className="w-full">
        {categories.map((category) => (
          <CategoryProductSection
            key={category._id}
            title={category.name}
            bannerImage={category.banner || category.image || ''}
            products={getProductsForSection(category.slug)}
            viewAllLink={`/category/${encodeURIComponent(category.slug)}`}
          />
        ))}
      </div>

      {/* Why Choose Us Section */}
      <WhyChooseUs />

      {/* Bulk CTA Section */}
      <BulkCTASection />
    </div>
  );
};
