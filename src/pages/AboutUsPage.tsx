
import React from 'react';
import { FiCheckCircle, FiPackage, FiUsers, FiGlobe } from 'react-icons/fi';

export const AboutUsPage = () => {
    return (
        <div className="bg-gray-50 min-h-screen pb-12">
            {/* Hero Section */}
            <div className="bg-white border-b border-gray-100">
                <div className="container mx-auto px-4 py-16 text-center max-w-4xl">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">
                        Crafting Elegance, Delivering Value.
                    </h1>
                    <p className="text-xl text-gray-600 leading-relaxed">
                        Welcome to <span className="font-bold text-primary-700">Votive Candles</span>.
                        We are India's premier manufacturer of high-quality glassware, candle holders, and home decor.
                        By bridging the gap between factory and consumer, we bring you world-class designs at unbeatable prices.
                    </p>
                </div>
            </div>

            {/* Origin Story */}
            <div className="container mx-auto px-4 py-16">
                <div className="flex flex-col md:flex-row gap-12 items-center">
                    <div className="md:w-1/2">
                        <img
                            src="https://images.unsplash.com/photo-1590595906931-81f04f0ccebb?auto=format&fit=crop&w=800&q=80"
                            alt="Glass Manufacturing"
                            className="rounded-2xl shadow-xl w-full object-cover h-96"
                        />
                    </div>
                    <div className="md:w-1/2 space-y-6">
                        <h2 className="text-3xl font-bold text-gray-900">Our Story</h2>
                        <p className="text-gray-700 leading-relaxed">
                            Founded with a passion for craftsmanship, Votive Candles started as a small manufacturing unit serving local markets.
                            Over the last decade, we have grown into a fully integrated production house, supplying to major retail chains, hotels, and event planners across India.
                        </p>
                        <p className="text-gray-700 leading-relaxed">
                            We noticed a gap in the market: customers were paying premium prices for standard quality due to multiple layers of middlemen.
                            We decided to change that. By launching our direct-to-consumer platform, we now offer the same export-quality products directly to you—at factory prices.
                        </p>
                    </div>
                </div>
            </div>

            {/* Core Values */}
            <div className="bg-white py-16">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900">Why We Stand Out</h2>
                        <p className="text-gray-500 mt-2">The pillars of our business philosophy.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <ValueCard
                            icon={FiPackage}
                            title="Factory Direct"
                            desc="No middlemen, no hidden costs. You pay for the product, not the supply chain."
                        />
                        <ValueCard
                            icon={FiCheckCircle}
                            title="Quality Assured"
                            desc="Every piece undergoes rigorous 3-level quality checks before packaging."
                        />
                        <ValueCard
                            icon={FiUsers}
                            title="Customer First"
                            desc="From secure packaging to hassle-free replacements, your satisfaction is our priority."
                        />
                        <ValueCard
                            icon={FiGlobe}
                            title="Made in India"
                            desc="Proudly manufacturing 100% of our products locally, supporting Indian craftsmanship."
                        />
                    </div>
                </div>
            </div>

            {/* Vision */}
            <div className="bg-gray-900 text-white py-20 px-4 text-center">
                <div className="container mx-auto max-w-3xl">
                    <h2 className="text-3xl font-bold mb-6">Our Vision</h2>
                    <p className="text-xl text-gray-300 italic">
                        "To become every Indian household's trusted partner for premium, affordable, and sustainable home decor."
                    </p>
                </div>
            </div>
        </div>
    );
};

const ValueCard = ({ icon: Icon, title, desc }: { icon: any, title: string, desc: string }) => (
    <div className="p-6 bg-gray-50 rounded-xl border border-gray-100 hover:shadow-md transition-shadow">
        <div className="w-12 h-12 bg-white text-primary-600 rounded-full flex items-center justify-center shadow-sm mb-4 mx-auto md:mx-0">
            <Icon size={24} />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2 text-center md:text-left">{title}</h3>
        <p className="text-gray-600 leading-normal text-center md:text-left">{desc}</p>
    </div>
);
