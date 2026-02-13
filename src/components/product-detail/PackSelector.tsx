interface Pack {
    _id?: string;
    label: string;
    quantity: number;
    pricingType?: 'auto' | 'discount' | 'fixed';
    fixedPrice?: number;
    discountPercent?: number;
    price?: number; // Universal model bundle price
}

interface PackSelectorProps {
    packs: Pack[];
    fragrances: string[];
    selectedPackId: string | null;
    selectedFragrance: string;
    onSelectPack: (packId: string) => void;
    onSelectFragrance: (fragrance: string) => void;
    productImage?: string;
    basePrice: number;
    baseOriginalPrice?: number; // Added to support MRP calculation
}

export const PackSelector = ({
    packs,
    fragrances,
    selectedPackId,
    selectedFragrance,
    onSelectPack,
    onSelectFragrance,
    productImage,
    basePrice,
    baseOriginalPrice
}: PackSelectorProps) => {

    const calculatePackPrice = (pack: Pack): number => {
        // Universal Model: pack has explicit price
        if (pack.price !== undefined) {
            return pack.price;
        }

        // Legacy fallback
        switch (pack.pricingType) {
            case 'fixed':
                return pack.fixedPrice || basePrice * pack.quantity;
            case 'discount':
                if (pack.discountPercent) {
                    return basePrice * pack.quantity * (1 - pack.discountPercent / 100);
                }
                return basePrice * pack.quantity;
            case 'auto':
            default:
                return basePrice * pack.quantity;
        }
    };

    return (
        <div className="space-y-4">
            <div className="space-y-3">
                <h3 className="text-base font-bold text-gray-900 uppercase tracking-wider">Select Pack</h3>

                <div className="flex flex-wrap gap-3">
                    {packs.map((pack: Pack, index: number) => {
                        // Use _id if available, fallback to label (legacy)
                        const packId = pack._id || pack.label;
                        const packPrice = calculatePackPrice(pack);
                        const isSelected = selectedPackId === packId;

                        // Calculate Comparison Price (MRP)
                        // Priority: Unit MRP * Quantity > Unit Selling * Quantity
                        const unitMrp = baseOriginalPrice && baseOriginalPrice > basePrice ? baseOriginalPrice : basePrice;
                        const packMrp = unitMrp * pack.quantity;

                        // Calculate Discount
                        let discountPercent = 0;
                        if (packMrp > packPrice) {
                            discountPercent = Math.round(((packMrp - packPrice) / packMrp) * 100);
                        }

                        // Smart Label: If label is just "Pack of", append quantity
                        let displayLabel = pack.label;
                        if (displayLabel.trim().toLowerCase() === 'pack of') {
                            displayLabel = `Pack of ${pack.quantity}`;
                        }

                        return (
                            <button
                                key={packId}
                                onClick={() => onSelectPack(packId)}
                                className={`flex flex-col items-center justify-center px-4 py-2 rounded-xl border-2 transition-all min-w-[110px] text-center relative ${isSelected
                                    ? 'border-primary-600 bg-primary-50 text-primary-700 font-bold ring-1 ring-primary-600'
                                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                {/* Discount Badge */}
                                {discountPercent > 0 && (
                                    <div className={`absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap shadow-sm ${isSelected ? 'bg-primary-600 text-white' : 'bg-green-100 text-green-700'}`}>
                                        {discountPercent}% OFF
                                    </div>
                                )}

                                <div className="text-sm font-bold whitespace-nowrap mt-1">{displayLabel}</div>

                                <div className="flex flex-col items-center mt-0.5 leading-tight">
                                    <span className="text-sm font-bold">₹{Math.round(packPrice).toLocaleString('en-IN')}</span>
                                    {discountPercent > 0 && (
                                        <span className="text-[10px] text-gray-400 line-through">₹{Math.round(packMrp).toLocaleString('en-IN')}</span>
                                    )}
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Fragrance Selector */}
            {fragrances.length > 0 && (
                <div className="space-y-3 pt-2">
                    <h3 className="text-base font-semibold text-gray-900">Choose Fragrance</h3>
                    <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
                        {fragrances.map((fragrance: string, index: number) => (
                            <button
                                key={index}
                                onClick={() => onSelectFragrance(fragrance)}
                                className={`flex-shrink-0 px-4 py-2 rounded-lg border transition-all ${selectedFragrance === fragrance
                                    ? 'border-primary-600 bg-primary-50 text-primary-700 font-medium'
                                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                {fragrance}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
