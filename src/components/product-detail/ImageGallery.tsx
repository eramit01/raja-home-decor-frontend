import { useState } from 'react';
import { FiX } from 'react-icons/fi';

interface ImageGalleryProps {
    images: string[];
    productName: string;
}

export const ImageGallery = ({ images, productName }: ImageGalleryProps) => {
    const [mainImage, setMainImage] = useState(images[0] || '');
    const [showZoom, setShowZoom] = useState(false);

    return (
        <div className="space-y-4">
            {/* Main Image Area */}
            <div
                className="relative w-full aspect-square bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 group"
            >
                <img
                    src={mainImage}
                    alt={productName}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 cursor-zoom-in"
                    onClick={() => setShowZoom(true)}
                />

                {/* Mobile Image Indicators */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 lg:hidden">
                    {images.map((img, idx) => (
                        <div
                            key={idx}
                            className={`w-2 h-2 rounded-full transition-all ${mainImage === img ? 'bg-primary-600 w-4' : 'bg-white/60 backdrop-blur-sm'
                                }`}
                        />
                    ))}
                </div>
            </div>

            {/* Thumbnails (Scrollable on mobile, Grid on desktop) */}
            {images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 lg:grid lg:grid-cols-5 lg:gap-3 lg:overflow-visible">
                    {images.map((image, index) => (
                        <button
                            key={index}
                            onClick={() => setMainImage(image)}
                            className={`relative flex-shrink-0 w-16 h-16 lg:w-full lg:h-auto lg:aspect-square rounded-xl overflow-hidden border-2 transition-all ${mainImage === image
                                    ? 'border-primary-600 ring-2 ring-primary-100 ring-offset-2'
                                    : 'border-transparent hover:border-gray-300'
                                }`}
                        >
                            <img
                                src={image}
                                alt={`${productName} ${index + 1}`}
                                className="w-full h-full object-cover"
                            />
                        </button>
                    ))}
                </div>
            )}

            {/* Zoom Modal */}
            {showZoom && (
                <div
                    className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
                    onClick={() => setShowZoom(false)}
                >
                    <button
                        onClick={() => setShowZoom(false)}
                        className="absolute top-4 right-4 text-white p-3 hover:bg-white/10 rounded-full transition-colors z-10"
                    >
                        <FiX size={24} />
                    </button>
                    <img
                        src={mainImage}
                        alt={productName}
                        className="max-w-full max-h-[90vh] object-contain shadow-2xl rounded-lg"
                    />
                </div>
            )}
        </div>
    );
};
