interface PricingBlockProps {
    price: number;
    originalPrice?: number;
}

export const PricingBlock = ({ price, originalPrice }: PricingBlockProps) => {
    const calculateDiscount = () => {
        if (!originalPrice || originalPrice <= price) return 0;
        return Math.round(((originalPrice - price) / originalPrice) * 100);
    };

    const discount = calculateDiscount();

    return (
        <div className="flex items-center gap-3 flex-wrap">
            {/* Selling Price */}
            <div className="flex items-baseline gap-1">
                <span className="text-sm text-gray-600">₹</span>
                <span className="text-3xl font-bold text-gray-900">{price.toLocaleString('en-IN')}</span>
            </div>

            {/* MRP (if different) */}
            {discount > 0 && (
                <>
                    <div className="flex items-baseline gap-1 text-gray-500">
                        <span className="text-sm">MRP</span>
                        <span className="text-lg line-through">₹{originalPrice?.toLocaleString('en-IN')}</span>
                    </div>

                    {/* Discount Badge */}
                    <div className="px-2 py-1 bg-green-100 text-green-700 text-sm font-semibold rounded">
                        {discount}% OFF
                    </div>
                </>
            )}
        </div>
    );
};
