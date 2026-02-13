import { FiShoppingBag } from 'react-icons/fi';

interface StickyBottomBarProps {
    finalPrice: number;
    onAddToCart: () => void;
    onBuyNow: () => void;
    disabled?: boolean;
}

export const StickyBottomBar = ({
    finalPrice,
    onAddToCart,
    onBuyNow,
    disabled = false
}: StickyBottomBarProps) => {
    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-40">
            <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
                {/* Final Price - Removed as per user request */}
                {/* 
                <div className="flex-shrink-0">
                    <div className="text-xs text-gray-600">Total</div>
                    <div className="text-xl font-bold text-gray-900">
                        ₹{Math.round(finalPrice).toLocaleString('en-IN')}
                    </div>
                </div> 
                */}

                {/* Buttons */}
                <div className="flex-1 flex gap-2">
                    <button
                        onClick={onAddToCart}
                        disabled={disabled}
                        className="flex-1 py-3 px-4 border border-primary-600 text-primary-600 font-bold rounded-full hover:bg-primary-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        <FiShoppingBag size={18} />
                        <span>Add to Cart</span>
                    </button>

                    <button
                        onClick={onBuyNow}
                        disabled={disabled}
                        className="flex-1 py-3 px-4 bg-primary-600 text-white font-bold rounded-full hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm whitespace-nowrap"
                    >
                        Buy at ₹{Math.round(finalPrice).toLocaleString('en-IN')}
                    </button>
                </div>
            </div>
        </div>
    );
};
