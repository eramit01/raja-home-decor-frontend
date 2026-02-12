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
        <>
            {/* Main Image */}
            <div
                className="w-full aspect-square bg-gray-100 cursor-zoom-in"
                onClick={() => setShowZoom(true)}
            >
                <img
                    src={mainImage}
                    alt={productName}
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
                <div className="px-4 pt-3 pb-2">
                    <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                        {images.map((image, index) => (
                            <button
                                key={index}
                                onClick={() => setMainImage(image)}
                                className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${mainImage === image
                                        ? 'border-primary-600 ring-2 ring-primary-100'
                                        : 'border-gray-200 hover:border-gray-300'
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
                </div>
            )}

            {/* Zoom Modal */}
            {showZoom && (
                <div
                    className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4"
                    onClick={() => setShowZoom(false)}
                >
                    <button
                        onClick={() => setShowZoom(false)}
                        className="absolute top-4 right-4 text-white p-2 hover:bg-white/10 rounded-full transition-colors"
                    >
                        <FiX size={24} />
                    </button>
                    <img
                        src={mainImage}
                        alt={productName}
                        className="max-w-full max-h-full object-contain"
                    />
                </div>
            )}
        </>
    );
};
