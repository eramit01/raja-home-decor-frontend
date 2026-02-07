import { useNavigate } from 'react-router-dom';

export const BulkCTASection = () => {
    const navigate = useNavigate();

    return (
        <div className="bg-primary-50 border-t border-primary-100 mb-20 md:mb-10"> {/* Large bottom margin for mobile nav safety */}
            <div className="container mx-auto px-4 py-8 md:py-12">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-10">

                    <div className="text-center md:text-left">
                        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
                            Looking for Bulk Orders?
                        </h2>
                        <p className="text-sm md:text-base text-gray-600">
                            Get best prices for weddings, events & gifting
                        </p>
                    </div>

                    <button
                        onClick={() => navigate('/bulk-enquiry')}
                        className="w-full md:w-auto bg-primary-600 text-white font-medium py-3 px-8 rounded-lg shadow-md hover:bg-primary-700 transition-colors active:scale-95"
                    >
                        Enquire Now
                    </button>

                </div>
            </div>
        </div>
    );
};
