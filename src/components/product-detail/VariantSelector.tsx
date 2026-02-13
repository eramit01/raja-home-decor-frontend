import React from 'react';

interface Variant {
    _id: string;
    label: string;
    price: number;
    originalPrice?: number;
    stock: number;
    // ... any other props needed
}

interface VariantSelectorProps {
    variants: Variant[];
    selectedVariantId: string | null;
    onSelectVariant: (variantId: string) => void;
}

export const VariantSelector = ({
    variants,
    selectedVariantId,
    onSelectVariant
}: VariantSelectorProps) => {
    return (
        <div className="space-y-3">
            <h3 className="text-base font-bold text-gray-900 uppercase tracking-wider">Select Option</h3>
            <div className="flex flex-wrap gap-3">
                {variants.map((variant) => {
                    const isSelected = selectedVariantId === variant._id;
                    const price = variant.price;
                    const originalPrice = variant.originalPrice;

                    // Calculate Discount
                    let discountPercent = 0;
                    if (originalPrice && originalPrice > price) {
                        discountPercent = Math.round(((originalPrice - price) / originalPrice) * 100);
                    }

                    return (
                        <button
                            key={variant._id}
                            onClick={() => onSelectVariant(variant._id)}
                            disabled={variant.stock === 0}
                            className={`flex flex-col items-center justify-center px-4 py-3 rounded-xl border-2 transition-all min-w-[110px] text-center relative ${isSelected
                                ? 'border-primary-600 bg-primary-50 text-primary-700 font-bold ring-1 ring-primary-600'
                                : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                                } ${variant.stock === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {/* Discount Badge */}
                            {discountPercent > 0 && variant.stock > 0 && (
                                <div className={`absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap shadow-sm ${isSelected ? 'bg-primary-600 text-white' : 'bg-green-100 text-green-700'
                                    }`}>
                                    {discountPercent}% OFF
                                </div>
                            )}

                            <div className="text-sm font-bold whitespace-nowrap mt-1">{variant.label}</div>

                            <div className="flex flex-col items-center mt-0.5 leading-tight">
                                <span className="text-sm font-bold">₹{price.toLocaleString('en-IN')}</span>
                                {originalPrice && originalPrice > price && (
                                    <span className="text-[10px] text-gray-400 line-through">₹{originalPrice.toLocaleString('en-IN')}</span>
                                )}
                            </div>

                            {/* Selected Indicator */}
                            {isSelected && (
                                <div className="absolute -top-2 -right-2 bg-primary-600 text-white rounded-full p-0.5 shadow-sm">
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                                </div>
                            )}

                            {variant.stock === 0 && (
                                <div className="absolute inset-0 flex items-center justify-center bg-gray-100/50 rounded-xl">
                                    <span className="bg-gray-800 text-white text-[10px] px-2 py-1 rounded">Out of Stock</span>
                                </div>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};
