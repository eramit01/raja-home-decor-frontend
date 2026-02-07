


export interface PackOption {
    id: string;
    label: string;
    price: number;
    originalPrice?: number;
    saveBadge?: string;
    subText: string;
    isBestValue?: boolean;
}

interface PackSelectionProps {
    packs: PackOption[];
    selectedPackId: string;
    onSelectPack: (id: string) => void;
}

export const PackSelection = ({ packs, selectedPackId, onSelectPack }: PackSelectionProps) => {
    return (
        <div className="bg-white py-3 mb-2">
            <div className="px-4 mb-2">
                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wide">Select Pack Size</h3>
            </div>

            <div className="flex flex-wrap px-4 gap-2">
                {packs.map((pack) => {
                    const isSelected = selectedPackId === pack.id;
                    return (
                        <div
                            key={pack.id}
                            onClick={() => onSelectPack(pack.id)}
                            className={`
                relative flex items-center justify-between p-2 rounded-lg border transition-all cursor-pointer select-none
                ${isSelected
                                    ? 'border-yellow-500 bg-yellow-50'
                                    : 'border-gray-200 bg-white hover:border-gray-300'
                                }
                flex-1 min-w-[120px] max-w-[48%]
              `}
                        >
                            <div className="flex flex-col">
                                <span className={`text-xs font-semibold ${isSelected ? 'text-gray-900' : 'text-gray-700'}`}>
                                    {pack.label}
                                </span>
                                {pack.subText && (
                                    <span className="text-[9px] text-gray-500 leading-none mt-0.5">{pack.subText}</span>
                                )}
                            </div>

                            <div className="flex flex-col items-end ml-2">
                                <div className="flex items-baseline gap-1">
                                    <span className="text-sm font-bold text-gray-900">₹{pack.price}</span>
                                </div>
                                {pack.originalPrice && (
                                    <span className="text-[9px] text-gray-400 line-through leading-none">₹{pack.originalPrice}</span>
                                )}
                            </div>

                            {/* Simplified Badge - Dot indicator if selected */}
                            {isSelected && (
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-500 rounded-full border-2 border-white"></div>
                            )}

                            {/* Save badge as small text tag */}
                            {pack.saveBadge && !isSelected && (
                                <div className="absolute -top-2 left-2 bg-green-100 text-green-700 text-[8px] font-bold px-1.5 rounded-sm border border-green-200">
                                    {pack.saveBadge}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
