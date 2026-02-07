import { useState } from 'react';
import { FiX } from 'react-icons/fi';

export const AnnouncementBar = () => {
    const [isVisible, setIsVisible] = useState(true);

    if (!isVisible) return null;

    return (
        <div className="bg-primary-900 text-white px-4 py-2 text-sm relative z-50">
            <div className="container mx-auto flex justify-between items-center">
                <div className="flex-1 text-center font-medium">
                    🎉 Free Shipping on Orders Over ₹999 | Fast Delivery India-Wide 🚚
                </div>
                <button
                    onClick={() => setIsVisible(false)}
                    className="absolute right-4 text-white/80 hover:text-white"
                    aria-label="Close announcement"
                >
                    <FiX />
                </button>
            </div>
        </div>
    );
};
