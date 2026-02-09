import { useState, useEffect } from 'react';
import { FiArrowUp } from 'react-icons/fi';

export const ScrollToTop = () => {
    const [isVisible, setIsVisible] = useState(false);

    // Show button when page is scrolled upto given distance
    const toggleVisibility = () => {
        if (window.scrollY > 300) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };

    // Set the top cordinate to 0
    // make scrolling smooth
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    useEffect(() => {
        window.addEventListener('scroll', toggleVisibility);
        return () => {
            window.removeEventListener('scroll', toggleVisibility);
        };
    }, []);

    if (!isVisible) {
        return null;
    }

    return (
        <button
            onClick={scrollToTop}
            className="fixed bottom-20 right-4 z-50 bg-black text-white p-3 rounded-full shadow-lg hover:bg-gray-800 transition-all active:scale-95 animate-bounce-subtle"
            aria-label="Scroll to top"
        >
            <FiArrowUp className="w-6 h-6" />
        </button>
    );
};
