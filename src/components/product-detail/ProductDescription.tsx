
import { FiTruck, FiShield, FiInfo } from 'react-icons/fi';

interface ProductDescriptionProps {
    description?: string;
    careInstructions?: string;
}

export const ProductDescription = ({ description, careInstructions }: ProductDescriptionProps) => {
    return (
        <div className="bg-white p-4 mb-2 space-y-6">

            {/* Description */}
            <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-600 leading-relaxed text-sm">
                    {description || "Premium quality handcrafted glassware designed to elevate your home decor. Perfect for daily use or special occasions."}
                </p>
            </div>

            {/* Care Instructions */}
            <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Care Instructions</h3>
                <div className="flex gap-3 text-sm text-gray-600 bg-orange-50 p-3 rounded-lg border border-orange-100">
                    <FiInfo className="flex-shrink-0 mt-0.5 text-orange-500" />
                    <p>{careInstructions || "Hand wash only using mild detergent. Do not clean with harsh scrubbers to maintain the finish. Avoid extreme thermal shock."}</p>
                </div>
            </div>

            {/* Delivery & Warranty - Trust Signals */}
            <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="flex flex-col items-center justify-center p-3 text-center border rounded-lg bg-gray-50">
                    <FiTruck className="w-6 h-6 text-gray-700 mb-2" />
                    <span className="font-bold text-gray-900 text-xs">Safe Delivery</span>
                    <span className="text-[10px] text-gray-500">Securely packed for India-wide shipping</span>
                </div>
                <div className="flex flex-col items-center justify-center p-3 text-center border rounded-lg bg-gray-50">
                    <FiShield className="w-6 h-6 text-gray-700 mb-2" />
                    <span className="font-bold text-gray-900 text-xs">Quality Check</span>
                    <span className="text-[10px] text-gray-500">Inspected for defects before dispatch</span>
                </div>
            </div>
        </div>
    );
};
