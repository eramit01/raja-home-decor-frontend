
import { Fragment } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { FiChevronDown, FiCheck } from 'react-icons/fi';

export interface FragranceOption {
    id: string;
    name: string;
    color: string; // hex for visual dot
}

interface FragranceSelectorProps {
    candleCount: number; // e.g., 4
    selectedFragrances: string[]; // array of fragrance IDs corresponding to each candle
    fragranceOptions: FragranceOption[];
    onFragranceChange: (index: number, fragranceId: string) => void;
}

export const FragranceSelector = ({
    candleCount,
    selectedFragrances,
    fragranceOptions,
    onFragranceChange,
}: FragranceSelectorProps) => {

    return (
        <div className="bg-white px-4 py-4 mb-2 border-t border-gray-100">
            <div className="mb-3">
                <h3 className="text-sm font-semibold text-gray-900">Choose Fragrances</h3>
                <p className="text-xs text-gray-500 mt-1">Customize your pack (Same or different)</p>
            </div>

            <div className="space-y-3">
                {Array.from({ length: candleCount }).map((_, index) => {
                    const selectedId = selectedFragrances[index];
                    const selectedOption = fragranceOptions.find(f => f.id === selectedId) || fragranceOptions[0];

                    return (
                        <div key={index} className="flex items-center justify-between">
                            <span className="text-sm text-gray-700 font-medium">Candle {index + 1}</span>
                            <div className="w-40 relative">
                                <Listbox value={selectedId} onChange={(val) => onFragranceChange(index, val)}>
                                    <div className="relative mt-1">
                                        <Listbox.Button className="relative w-full cursor-pointer rounded-lg bg-gray-50 py-2 pl-3 pr-10 text-left border border-gray-200 focus:outline-none focus:border-yellow-500 sm:text-sm">
                                            <span className="flex items-center truncate">
                                                <span
                                                    className="h-3 w-3 rounded-full mr-2"
                                                    style={{ backgroundColor: selectedOption.color }}
                                                />
                                                <span className="block truncate">{selectedOption.name}</span>
                                            </span>
                                            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                                <FiChevronDown
                                                    className="h-4 w-4 text-gray-400"
                                                    aria-hidden="true"
                                                />
                                            </span>
                                        </Listbox.Button>
                                        <Transition
                                            as={Fragment}
                                            leave="transition ease-in duration-100"
                                            leaveFrom="opacity-100"
                                            leaveTo="opacity-0"
                                        >
                                            <Listbox.Options className="absolute z-30 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
                                                {fragranceOptions.map((fragrance) => (
                                                    <Listbox.Option
                                                        key={fragrance.id}
                                                        className={({ active }) =>
                                                            `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-yellow-50 text-yellow-900' : 'text-gray-900'
                                                            }`
                                                        }
                                                        value={fragrance.id}
                                                    >
                                                        {({ selected }) => (
                                                            <>
                                                                <span
                                                                    className={`flex items-center truncate ${selected ? 'font-medium' : 'font-normal'
                                                                        }`}
                                                                >
                                                                    <span
                                                                        className="h-3 w-3 rounded-full mr-2"
                                                                        style={{ backgroundColor: fragrance.color }}
                                                                    />
                                                                    {fragrance.name}
                                                                </span>
                                                                {selected ? (
                                                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-yellow-600">
                                                                        <FiCheck className="h-4 w-4" aria-hidden="true" />
                                                                    </span>
                                                                ) : null}
                                                            </>
                                                        )}
                                                    </Listbox.Option>
                                                ))}
                                            </Listbox.Options>
                                        </Transition>
                                    </div>
                                </Listbox>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
