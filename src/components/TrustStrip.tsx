import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPackage, FiShield, FiRefreshCw, FiCheckCircle, FiLayers, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const trustItems = [
    {
        icon: FiPackage,
        title: 'Direct From Factory',
        subtitle: 'No Middlemen • Manufacturer Pricing',
        link: '/about'
    },
    {
        icon: FiLayers,
        title: 'Extra-Safe Glass Packaging',
        subtitle: 'Multi-Layer Protection for Fragile Items',
    },
    {
        icon: FiCheckCircle,
        title: 'Factory Quality Control',
        subtitle: 'Checked Before Dispatch',
    },
    {
        icon: FiRefreshCw,
        title: 'Damage? We Replace',
        subtitle: 'Hassle-Free Replacement Policy',
    },
    {
        icon: FiShield,
        title: '100% Secure Payments',
        subtitle: 'Safe & Encrypted Checkout',
    },
];

export const TrustStrip = () => {
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const checkScrollPosition = () => {
        if (scrollContainerRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
            setCanScrollLeft(scrollLeft > 0);
            setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
        }
    };

    useEffect(() => {
        checkScrollPosition();
        window.addEventListener('resize', checkScrollPosition);
        return () => window.removeEventListener('resize', checkScrollPosition);
    }, []);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const scrollAmount = scrollContainerRef.current.clientWidth * 0.75;
            scrollContainerRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth',
            });
        }
    };

    return (
        <div className="bg-gray-50 border-y border-gray-100 mb-6">
            <div className="container mx-auto relative overflow-hidden group">
                {/* Mobile Scroll Indicator - Left */}
                <button
                    onClick={() => scroll('left')}
                    className={`absolute bottom-3 left-4 z-10 text-gray-500 bg-white/90 backdrop-blur-sm p-1.5 rounded-full shadow-sm border border-gray-100 md:hidden transition-all duration-300 ${canScrollLeft ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2 pointer-events-none'
                        }`}
                    aria-label="Scroll left"
                >
                    <FiChevronLeft size={16} />
                </button>

                {/* Mobile Scroll Indicator - Right */}
                <button
                    onClick={() => scroll('right')}
                    className={`absolute bottom-3 right-4 z-10 text-gray-500 bg-white/90 backdrop-blur-sm p-1.5 rounded-full shadow-sm border border-gray-100 md:hidden transition-all duration-300 ${canScrollRight ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2 pointer-events-none'
                        }`}
                    aria-label="Scroll right"
                >
                    <FiChevronRight size={16} />
                </button>

                {/* Mobile: Horizontal Scroll, Desktop: Grid */}
                <div
                    ref={scrollContainerRef}
                    className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide md:grid md:grid-cols-5 gap-3 md:gap-0 md:divide-x divide-gray-200/50 pb-8 md:pb-0"
                    style={{
                        touchAction: 'pan-x',
                        WebkitOverflowScrolling: 'touch',
                        scrollbarWidth: 'none', // Firefox
                        msOverflowStyle: 'none', // IE/Edge
                    }}
                    onScroll={checkScrollPosition}
                >
                    {trustItems.map((item, index) => {
                        const Content = () => (
                            <div
                                className={`flex-shrink-0 w-[75%] md:w-auto snap-start flex items-center gap-3 px-4 py-4 md:px-2 md:py-6 md:flex-col md:text-center md:justify-center transition-colors hover:bg-white ${item.link ? 'cursor-pointer' : ''}`}
                            >
                                <item.icon className="text-gray-600 text-2xl md:text-3xl flex-shrink-0" strokeWidth={1.5} />
                                <div className="flex flex-col">
                                    <span className="text-sm md:text-base font-bold text-gray-900 whitespace-nowrap md:whitespace-normal">
                                        {item.title}
                                    </span>
                                    <span className="text-xs text-gray-500 font-medium whitespace-nowrap md:whitespace-normal mt-0.5">
                                        {item.subtitle}
                                    </span>
                                </div>
                            </div>
                        );

                        return item.link ? (
                            <Link key={index} to={item.link} className="contents">
                                <Content />
                            </Link>
                        ) : (
                            <div key={index} className="contents">
                                <Content />
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
