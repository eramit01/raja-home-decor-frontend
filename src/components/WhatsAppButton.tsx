import { FaWhatsapp } from 'react-icons/fa'; // Assuming react-icons/fa is available, usually is. If not use FiMessageCircle.

export const WhatsAppButton = () => {
    // Admin phone number - ideally from env or config. Using a default or provided one.
    // The previously used context mentioned ADMIN_PHONES or similar.
    const phoneNumber = "919876543210"; // Replace with actual business number
    const message = "Hi, I'm interested in your products.";

    const handleClick = () => {
        window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
    };

    return (
        <button
            onClick={handleClick}
            className="fixed bottom-24 right-4 md:bottom-8 md:right-8 z-40 bg-[#25D366] text-white p-3 md:p-4 rounded-full shadow-lg hover:scale-110 transition-transform flex items-center justify-center"
            title="Chat with us on WhatsApp"
        >
            <FaWhatsapp size={28} />
        </button>
    );
};
