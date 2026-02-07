import { useState, useMemo, useEffect } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { FiFilter, FiPackage } from 'react-icons/fi';
import { ProductCard } from '../components/ProductCard';
import { FilterPanel } from '../components/FilterPanel';
import { MobileFilterSheet } from '../components/MobileFilterSheet';
import { getFiltersForCategory, categoryMeta, priceRangeConfig } from '../data/categoryFilters';
import { ProductService, ProductParams } from '../services/product.service';
// import { categories } from '../data/categories';

import { Product } from '../types';

export const CategoryPage = () => {
    const { categorySlug = '' } = useParams<{ categorySlug: string }>();
    const [searchParams] = useSearchParams();
    const searchQuery = searchParams.get('q') || '';

    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});
    const [sortBy, setSortBy] = useState<string>('recommended');
    const [priceRange, setPriceRange] = useState<[number, number]>([
        priceRangeConfig?.min || 0,
        priceRangeConfig?.max || 100000
    ]);

    // API State
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // const categoryData = categories.find(c => c.slug === categorySlug);
    const isSearchMode = categorySlug === 'search';

    const [categoryInfo, setCategoryInfo] = useState<any>(null);

    // Fetch Products and Category Info
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                // Fetch Products
                const params: ProductParams = {};
                if (isSearchMode && searchQuery) {
                    params.search = searchQuery;
                } else if (!isSearchMode && categorySlug) {
                    params.category = categorySlug;
                }

                const [allFetched, categoriesList] = await Promise.all([
                    ProductService.getAllProducts(params),
                    ProductService.getCategories() // Fetch categories to get banner
                ]);

                // Find current category info
                if (!isSearchMode && categoriesList) {
                    const currentCat = categoriesList.find((c: any) => c.slug === categorySlug);
                    setCategoryInfo(currentCat);
                }

                // Map _id to id for frontend compatibility
                const mapped = allFetched.map((p: any) => ({
                    ...p,
                    id: p._id,
                    title: p.name // Map backend 'name' to frontend 'title'
                }));
                setProducts(mapped);
            } catch (error) {
                console.error("Failed to fetch data", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [categorySlug, searchQuery, isSearchMode]);


    // Merge meta from static config or dynamic category data
    const meta = useMemo(() => {
        if (isSearchMode) {
            return {
                title: searchQuery ? `Search Results for "${searchQuery}"` : 'Search Products',
                subtitle: searchQuery ? 'Browse products matching your search' : 'Enter a term to search'
            };
        }
        if (categoryMeta[categorySlug]) {
            return categoryMeta[categorySlug];
        }
        return {
            title: categoryInfo?.name || 'Category',
            subtitle: categoryInfo?.description || 'Explore our collection'
        };
    }, [categorySlug, categoryInfo, isSearchMode, searchQuery]);

    const filters = useMemo(() => getFiltersForCategory(isSearchMode ? 'all' : categorySlug), [categorySlug, isSearchMode]);
    const bannerImage = categoryInfo?.banner;

    const handleFilterChange = (filterId: string, value: string) => {
        setSelectedFilters(prev => {
            const current = prev[filterId] || [];
            const updated = current.includes(value)
                ? current.filter(item => item !== value)
                : [...current, value];
            return { ...prev, [filterId]: updated };
        });
    };

    const handlePriceChange = (newRange: [number, number]) => {
        setPriceRange(newRange);
    };

    const handleClearAll = () => {
        setSelectedFilters({});
        setPriceRange([priceRangeConfig.min, priceRangeConfig.max]);
    };

    const filteredProducts = useMemo(() => {
        let result = products;

        // 1. Client Side Text Search Refinement (Optional)
        if (isSearchMode && searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(product =>
                product.name?.toLowerCase().includes(query) ||
                product.description?.toLowerCase().includes(query) ||
                product.tags?.some(tag => tag.toLowerCase().includes(query))
            );
        }

        // 2. Tags / Attributes
        Object.entries(selectedFilters).forEach(([key, values]) => {
            if (values.length > 0) {
                result = result.filter(product => {
                    if (key === 'rating') {
                        return product.rating >= Number(values[0]);
                    }
                    return true;
                });
            }
        });

        // 3. Price Range
        result = result.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

        // 4. Client Side Sorting
        if (sortBy === 'priceAsc') {
            result.sort((a, b) => a.price - b.price);
        } else if (sortBy === 'priceDesc') {
            result.sort((a, b) => b.price - a.price);
        } else if (sortBy === 'rating') {
            result.sort((a, b) => b.rating - a.rating);
        }

        console.log('CategoryPage: Final Filtered Products:', result.length);
        return result;
    }, [isSearchMode, searchQuery, products, selectedFilters, priceRange, sortBy]);

    // Debug Effect
    useEffect(() => {
        console.log('CategoryPage: Fetched Products:', products);
        console.log('CategoryPage: Selected Filters:', selectedFilters);
        console.log('CategoryPage: Price Range:', priceRange);
    }, [products, selectedFilters, priceRange]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
            </div>
        );
    }


    const activeFilterCount = Object.keys(selectedFilters).length + (priceRange[0] !== priceRangeConfig.min || priceRange[1] !== priceRangeConfig.max ? 1 : 0);


    return (
        <div className="min-h-screen bg-gray-50">
            {/* Category Header */}
            <div className="bg-white border-b border-gray-100">
                <div className="container mx-auto px-4 py-4">
                    {/* Breadcrumb */}
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                        <Link to="/" className="hover:text-primary-600">Home</Link>
                        <span>/</span>
                        <span className="text-gray-900">{meta.title}</span>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div>
                            <h1 className="text-xl md:text-2xl font-bold text-gray-900">{meta.title}</h1>
                            <p className="text-sm text-gray-600 mt-1">{meta.subtitle}</p>
                        </div>

                        {/* Sort Dropdown */}
                        <div className="flex items-center gap-2">
                            <label className="text-sm text-gray-500 whitespace-nowrap">Sort by:</label>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="text-sm border-gray-200 rounded-md focus:border-black focus:ring-0 cursor-pointer bg-gray-50"
                            >
                                <option value="recommended">Recommended</option>
                                <option value="priceAsc">Price: Low to High</option>
                                <option value="priceDesc">Price: High to Low</option>
                                <option value="rating">Top Rated</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* ... existing banner ... */}
            {bannerImage && (
                <div className="w-full">
                    <div className="w-full overflow-hidden aspect-[3240/537]">
                        <img
                            src={bannerImage}
                            alt={meta.title}
                            className="w-full h-full object-cover"
                            loading="lazy"
                        />
                    </div>
                </div>
            )}

            {/* ... existing mobile filter ... */}
            <div className="md:hidden sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm">
                <div className="container mx-auto px-4 py-3">
                    <button
                        onClick={() => setIsFilterOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                        <FiFilter size={18} />
                        <span className="font-medium">Filter</span>
                        {activeFilterCount > 0 && (
                            <span className="bg-primary-600 text-white text-xs px-2 py-0.5 rounded-full">
                                {activeFilterCount}
                            </span>
                        )}
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-6">
                <div className="flex gap-6">
                    {/* Desktop Filter Panel - Left Side (25%) */}
                    <div className="hidden md:block w-1/4 flex-shrink-0">
                        <div className="sticky top-4">
                            <FilterPanel
                                filters={filters}
                                selectedFilters={selectedFilters}
                                priceRange={priceRange}
                                onFilterChange={handleFilterChange}
                                onPriceChange={handlePriceChange}
                                onClearAll={handleClearAll}
                            />
                        </div>
                    </div>

                    {/* Product Grid - Right Side (75%) */}
                    <div className="flex-1">
                        {/* Product Count */}
                        <div className="mb-4 text-sm text-gray-600">
                            Showing <span className="font-semibold text-gray-900">{filteredProducts.length}</span> products
                        </div>

                        {filteredProducts.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                                {filteredProducts.map((product: Product) => {
                                    // Logic for Automatic Badges
                                    let badgeText = '';
                                    let badgeColor = '';

                                    if (product.tags && product.tags.length > 0) {
                                        // Use Manual Tag if present
                                        badgeText = product.tags[0];
                                        badgeColor = badgeText === 'Best Seller' ? 'bg-orange-500 text-white' : 'bg-green-600 text-white';
                                    } else {
                                        // Auto-calculate
                                        if (product.rating >= 4.5 && (product.totalReviews || 0) > 50) {
                                            badgeText = 'Best Seller';
                                            badgeColor = 'bg-orange-500 text-white';
                                        } else if (product.price < 500) { // Example logic for 'Value Pick'
                                            // badgeText = 'Value Pick';
                                            // badgeColor = 'bg-blue-500 text-white';
                                        }
                                        // TODO: Add 'Low Stock' check if data available
                                    }

                                    return (
                                        <div key={product.id} className="relative">
                                            {/* Badge */}
                                            {badgeText && (
                                                <div className={`absolute top-2 left-2 z-10 px-2 py-0.5 text-[10px] font-bold rounded ${badgeColor}`}>
                                                    {badgeText}
                                                </div>
                                            )}
                                            <ProductCard product={product} />
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            /* Empty State */
                            <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                    <FiPackage size={40} className="text-gray-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    No products found
                                </h3>
                                <p className="text-gray-500 mb-6 max-w-sm">
                                    No products match the selected filters. Try adjusting your filters to see more results.
                                </p>
                                <button
                                    onClick={handleClearAll}
                                    className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors"
                                >
                                    Clear Filters
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Filter Sheet */}
            <MobileFilterSheet
                isOpen={isFilterOpen}
                onClose={() => setIsFilterOpen(false)}
                filters={filters}
                selectedFilters={selectedFilters}
                priceRange={priceRange}
                onFilterChange={handleFilterChange}
                onPriceChange={handlePriceChange}
                onClearAll={handleClearAll}
                onApply={() => setIsFilterOpen(false)}
            />
        </div>
    );
};
