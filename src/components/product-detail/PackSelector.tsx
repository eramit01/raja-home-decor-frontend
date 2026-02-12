import { useState } from 'react';
import { FiChevronDown } from 'react-icons/fi';

interface Pack {
    label: string;
    quantity: number;
    pricingType: string;
    fixedPrice?: number;
    discountPercent?: number;
}

interface PackSelectorProps {
    packs: Pack[];
    fragrances: string[];
    selectedPack: number;
    selectedFragrance: string;
    onSelectPack: (index: number) => void;
    onSelectFragrance: (fragrance: string) => void;
    productImage: string;
    basePrice: number;
}

export const PackSelector = ({
    packs,
    fragrances,
    selectedPack,
    selectedFragrance,
    onSelectPack,
    onSelectFragrance,
    productImage,
    basePrice
}: PackSelectorProps) => {
    const [expandedPack, setExpandedPack] = useState<number | null>(null);

    const calculatePackPrice = (pack: Pack): number => {
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

    const calculatePackMRP = (pack: Pack): number => {
        return basePrice * pack.quantity;
    };

    return (
        <div className="space-y-4">
            <h3 className="text-base font-semibold text-gray-900">Choose Your Pack</h3>

            <div className="space-y-3">
                {packs.map((pack, index) => {
                    const packPrice = calculatePackPrice(pack);
                    const packMRP = calculatePackMRP(pack);
                    const isSelected = selectedPack === index;
                    const isExpanded = expandedPack === index;

                    return (
                        <div
                            key={index}
                            className={`border-2 rounded-xl overflow-hidden transition-all ${isSelected
                                    ? 'border-primary-600 bg-primary-50'
                                    : 'border-gray-200 bg-white hover:border-gray-300'
                                }`}
                        >
                            {/* Pack Card */}
                            <button
                                onClick={() => {
                                    onSelectPack(index);
                                    setExpandedPack(isExpanded ? null : index);
                                }}
                                className="w-full p-4 flex items-center gap-3 text-left"
                            >
                                {/* Product Image */}
                                <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                                    <img
                                        src={productImage}
                                        alt={pack.label}
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                {/* Pack Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="font-semibold text-gray-900">{pack.label}</div>
                                    <div className="flex items-baseline gap-2 mt-1">
                                        <span className="text-lg font-bold text-gray-900">
                                            ₹{Math.round(packPrice).toLocaleString('en-IN')}
                                        </span>
                                        {pack.pricingType !== 'auto' && packPrice < packMRP && (
                                            <span className="text-sm text-gray-500 line-through">
                                                ₹{Math.round(packMRP).toLocaleString('en-IN')}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Expand Icon */}
                                {fragrances.length > 0 && (
                                    <FiChevronDown
                                        className={`flex-shrink-0 transition-transform ${isExpanded ? 'rotate-180' : ''
                                            }`}
                                        size={20}
                                    />
                                )}
                            </button>

                            {/* Fragrance Dropdown (Expanded) */}
                            {isExpanded && fragrances.length > 0 && (
                                <div className="px-4 pb-4 border-t border-gray-200">
                                    <label className="block text-sm font-medium text-gray-700 mb-2 mt-3">
                                        Choose Fragrance
                                    </label>
                                    <select
                                        value={selectedFragrance}
                                        onChange={(e) => onSelectFragrance(e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                    >
                                        <option value="">Select a fragrance</option>
                                        {fragrances.map((fragrance, idx) => (
                                            <option key={idx} value={fragrance}>
                                                {fragrance}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
