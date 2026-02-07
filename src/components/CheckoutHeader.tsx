
import { FiShield } from "react-icons/fi";
import { Link } from "react-router-dom";

export const CheckoutHeader = () => {
    return (
        <header className="bg-white border-b border-gray-100 py-4 sticky top-0 z-50">
            <div className="container mx-auto px-4 flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="text-2xl font-extrabold tracking-tighter text-primary-600">
                    Store Logo
                </Link>

                {/* Trust Badge */}
                <div className="flex items-center gap-2 text-green-700 bg-green-50 px-3 py-1.5 rounded-full border border-green-100">
                    <FiShield className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wide">100% Secure Payment</span>
                </div>
            </div>
        </header>
    );
};
