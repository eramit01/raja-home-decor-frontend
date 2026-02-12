interface SizeSelectorProps {
    sizes: Array<{ name: string; price: number }>;
    selectedSize: { name: string; price: number } | null;
    onSelectSize: (size: { name: string; price: number }) => void;
}

export const SizeSelector = ({ sizes, selectedSize, onSelectSize }: SizeSelectorProps) => {
    return (
        <div className="space-y-3">
            <h3 className="text-base font-semibold text-gray-900">Select Size</h3>

            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
                {sizes.map((size, index) => (
                    <button
                        key={index}
                        onClick={() => onSelectSize(size)}
                        className={`flex-shrink-0 px-4 py-3 rounded-xl border-2 transition-all ${selectedSize?.name === size.name
                                ? 'border-primary-600 bg-primary-50 text-primary-700 font-semibold'
                                : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                            }`}
                    >
                        <div className="text-sm font-medium">{size.name}</div>
                        <div className="text-xs mt-0.5">₹{size.price.toLocaleString('en-IN')}</div>
                    </button>
                ))}
            </div>
        </div>
    );
};
