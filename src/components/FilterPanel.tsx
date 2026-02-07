import { useState } from 'react';
import { FiChevronDown, FiChevronUp, FiStar } from 'react-icons/fi';
import { FilterConfig, priceRangeConfig } from '../data/categoryFilters';

interface FilterPanelProps {
    filters: FilterConfig[];
    selectedFilters: Record<string, string[]>;
    priceRange: [number, number];
    onFilterChange: (filterId: string, value: string) => void;
    onPriceChange: (range: [number, number]) => void;
    onClearAll: () => void;
    isMobile?: boolean;
    onApply?: () => void;
}

interface AccordionState {
    [key: string]: boolean;
}

export const FilterPanel = ({
    filters,
    selectedFilters,
    priceRange,
    onFilterChange,
    onPriceChange,
    onClearAll,
    isMobile = false,
    onApply,
}: FilterPanelProps) => {
    // Initialize all accordions as open
    const initialAccordionState: AccordionState = {};
    filters.forEach((filter) => {
        initialAccordionState[filter.id] = true;
    });
    initialAccordionState['price'] = true;

    const [accordionState, setAccordionState] = useState<AccordionState>(initialAccordionState);

    const toggleAccordion = (id: string) => {
        setAccordionState((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    const hasActiveFilters = Object.values(selectedFilters).some((arr) => arr.length > 0) ||
        priceRange[0] !== priceRangeConfig.min ||
        priceRange[1] !== priceRangeConfig.max;

    return (
        <div className={`bg-white ${isMobile ? '' : 'rounded-lg border border-gray-200 shadow-sm'}`}>
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
                <h3 className="font-bold text-gray-900">Filters</h3>
                {hasActiveFilters && (
                    <button
                        onClick={onClearAll}
                        className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                    >
                        Clear All
                    </button>
                )}
            </div>

            <div className="divide-y divide-gray-100">
                {/* Price Range Filter */}
                <div className="p-4">
                    <button
                        onClick={() => toggleAccordion('price')}
                        className="flex items-center justify-between w-full text-left"
                    >
                        <span className="font-semibold text-gray-800">Price Range</span>
                        {accordionState['price'] ? (
                            <FiChevronUp className="text-gray-500" />
                        ) : (
                            <FiChevronDown className="text-gray-500" />
                        )}
                    </button>

                    {accordionState['price'] && (
                        <div className="mt-4 space-y-4">
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-600">₹{priceRange[0]}</span>
                                <div className="flex-1 h-1 bg-gray-200 rounded relative">
                                    <div
                                        className="absolute h-1 bg-primary-600 rounded"
                                        style={{
                                            left: `${(priceRange[0] / priceRangeConfig.max) * 100}%`,
                                            right: `${100 - (priceRange[1] / priceRangeConfig.max) * 100}%`,
                                        }}
                                    />
                                </div>
                                <span className="text-sm text-gray-600">₹{priceRange[1]}</span>
                            </div>
                            <div className="flex gap-2">
                                <input
                                    type="range"
                                    min={priceRangeConfig.min}
                                    max={priceRangeConfig.max}
                                    step={priceRangeConfig.step}
                                    value={priceRange[0]}
                                    onChange={(e) => onPriceChange([Number(e.target.value), priceRange[1]])}
                                    className="flex-1 accent-primary-600"
                                />
                                <input
                                    type="range"
                                    min={priceRangeConfig.min}
                                    max={priceRangeConfig.max}
                                    step={priceRangeConfig.step}
                                    value={priceRange[1]}
                                    onChange={(e) => onPriceChange([priceRange[0], Number(e.target.value)])}
                                    className="flex-1 accent-primary-600"
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Dynamic Filters */}
                {filters.map((filter) => (
                    <div key={filter.id} className="p-4">
                        <button
                            onClick={() => toggleAccordion(filter.id)}
                            className="flex items-center justify-between w-full text-left"
                        >
                            <span className="font-semibold text-gray-800">{filter.name}</span>
                            {accordionState[filter.id] ? (
                                <FiChevronUp className="text-gray-500" />
                            ) : (
                                <FiChevronDown className="text-gray-500" />
                            )}
                        </button>

                        {accordionState[filter.id] && (
                            <div className="mt-3 space-y-2">
                                {filter.options.map((option) => (
                                    <label
                                        key={option.value}
                                        className="flex items-center gap-3 cursor-pointer group"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={selectedFilters[filter.id]?.includes(option.value) || false}
                                            onChange={() => onFilterChange(filter.id, option.value)}
                                            className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500 accent-primary-600"
                                        />
                                        <span className="text-sm text-gray-700 group-hover:text-gray-900 flex items-center gap-1">
                                            {filter.id === 'rating' && <FiStar className="text-yellow-500 fill-current" />}
                                            {option.label}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Apply Button - Mobile Only */}
            {isMobile && onApply && (
                <div className="p-4 border-t border-gray-100 sticky bottom-0 bg-white">
                    <button
                        onClick={onApply}
                        className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 rounded-lg font-medium transition-colors"
                    >
                        Apply Filters
                    </button>
                </div>
            )}
        </div>
    );
};
