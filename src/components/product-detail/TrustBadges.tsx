import { FiShield, FiTruck, FiCheckCircle, FiRefreshCw } from 'react-icons/fi';

export const TrustBadges = () => {
    const badges = [
        {
            icon: <FiShield className="w-5 h-5" />,
            title: "Secure Payment",
            desc: "100% Secure SSL"
        },
        {
            icon: <FiTruck className="w-5 h-5" />,
            title: "Fast Delivery",
            desc: "Across India"
        },
        {
            icon: <FiCheckCircle className="w-5 h-5" />,
            title: "Quality Check",
            desc: "Verified Products"
        },
        {
            icon: <FiRefreshCw className="w-5 h-5" />,
            title: "Easy Returns",
            desc: "7 Days Policy"
        }
    ];

    return (
        <div className="grid grid-cols-2 gap-3 py-4 border-t border-gray-100">
            {badges.map((badge, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="text-primary-600 bg-white p-2 rounded-full shadow-sm">
                        {badge.icon}
                    </div>
                    <div>
                        <div className="text-xs font-bold text-gray-900">{badge.title}</div>
                        <div className="text-[10px] text-gray-500">{badge.desc}</div>
                    </div>
                </div>
            ))}
        </div>
    );
};
