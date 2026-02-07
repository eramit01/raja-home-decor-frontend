import { useState } from 'react';
import { FiCheck, FiPackage, FiTruck, FiPenTool } from 'react-icons/fi';
import { api } from '../services/api';

export const BulkEnquiryPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        company: '',
        phone: '',
        email: '',
        category: 'Corporate Gifting',
        quantity: '',
        message: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/bulk-enquiries', formData);
            alert('Thank you! We will contact you shortly.');
            setFormData({
                name: '',
                company: '',
                phone: '',
                email: '',
                category: 'Corporate Gifting',
                quantity: '',
                message: ''
            });
        } catch (error) {
            console.error('Failed to submit enquiry', error);
            alert('Failed to submit enquiry. Please try again.');
        }
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <div className="relative bg-gray-900 text-white py-20 px-4">
                <div className="absolute inset-0 overflow-hidden">
                    <img
                        src="https://images.unsplash.com/photo-1556740758-90de374c12ad?auto=format&fit=crop&w=1920&q=80"
                        alt="Bulk Orders"
                        className="w-full h-full object-cover opacity-20"
                    />
                </div>
                <div className="relative container mx-auto text-center max-w-3xl">
                    <h1 className="text-3xl md:text-5xl font-extrabold mb-6 tracking-tight">
                        Bulk Orders & Corporate Gifting
                    </h1>
                    <p className="text-lg md:text-xl text-gray-300 mb-8">
                        Premium glassware, candle holders, and decor at factory-direct prices.
                        Customized for your business needs.
                    </p>
                    <button
                        onClick={() => document.getElementById('enquiry-form')?.scrollIntoView({ behavior: 'smooth' })}
                        className="bg-primary-600 hover:bg-primary-500 text-white px-8 py-3 rounded-lg font-bold text-lg transition-transform active:scale-95 shadow-lg"
                    >
                        Request a Quote
                    </button>
                </div>
            </div>

            {/* Value Propositions */}
            <div className="py-16 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <FeatureCard
                            icon={FiPackage}
                            title="Factory Prices"
                            description="Direct from manufacturer pricing with no middleman markup."
                        />
                        <FeatureCard
                            icon={FiPenTool}
                            title="Customization"
                            description="Logo printing, custom packaging, and bespoke designs available."
                        />
                        <FeatureCard
                            icon={FiCheck}
                            title="Huge Selection"
                            description="Choose from over 500+ premium SKUs in glass and decor."
                        />
                        <FeatureCard
                            icon={FiTruck}
                            title="Fast Shipping"
                            description="Reliable pan-India logistic network for safe & timely delivery."
                        />
                    </div>
                </div>
            </div>

            {/* Content & Form Section */}
            <div className="container mx-auto px-4 py-16" id="enquiry-form">
                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Left Side: Process & Info */}
                    <div className="lg:w-1/2">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">How It Works</h2>
                        <div className="space-y-8">
                            <ProcessStep
                                step="1"
                                title="Submit Enquiry"
                                description="Fill out the form with your requirements and estimated quantity."
                            />
                            <ProcessStep
                                step="2"
                                title="Get Quote"
                                description="Our team will contact you within 24 hours with the best factory-price quote."
                            />
                            <ProcessStep
                                step="3"
                                title="Sample Approval"
                                description="We send samples for quality check (if required) before finalizing the order."
                            />
                            <ProcessStep
                                step="4"
                                title="Production & Delivery"
                                description="Order processing starts immediately after approval with live tracking."
                            />
                        </div>

                        <div className="mt-12 p-6 bg-blue-50 rounded-xl border border-blue-100">
                            <h3 className="font-bold text-blue-900 mb-2">Need something simpler?</h3>
                            <p className="text-blue-800 text-sm mb-4">
                                Direct WhatsApp us for quick catalog and pricing.
                            </p>
                            <button className="text-primary-600 font-bold hover:underline">
                                Chat on WhatsApp &rarr;
                            </button>
                        </div>
                    </div>

                    {/* Right Side: Form */}
                    <div className="lg:w-1/2">
                        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-gray-100">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Request a Quote</h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                                        <input
                                            required
                                            type="text"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-black focus:border-black"
                                            value={formData.name}
                                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-black focus:border-black"
                                            value={formData.company}
                                            onChange={e => setFormData({ ...formData, company: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number *</label>
                                        <input
                                            required
                                            type="tel"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-black focus:border-black"
                                            value={formData.phone}
                                            onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Email ID</label>
                                        <input
                                            required
                                            type="email"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-black focus:border-black"
                                            value={formData.email}
                                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Product Category</label>
                                    <select
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-black focus:border-black"
                                        value={formData.category}
                                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                                    >
                                        <option>Corporate Gifting</option>
                                        <option>Wedding Return Gifts</option>
                                        <option>Candle Manufacturing (Raw Materials)</option>
                                        <option>Hotel/Restaurant Supply</option>
                                        <option>Reselling/Distribution</option>
                                        <option>Other</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Quantity</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. 50 pcs, 500 units"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-black focus:border-black"
                                        value={formData.quantity}
                                        onChange={e => setFormData({ ...formData, quantity: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Message / Specific Requirements</label>
                                    <textarea
                                        rows={4}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-black focus:border-black"
                                        value={formData.message}
                                        onChange={e => setFormData({ ...formData, message: e.target.value })}
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-black hover:bg-gray-800 text-white font-bold py-3 rounded-lg transition-colors shadow-md"
                                >
                                    Submit Enquiry
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const FeatureCard = ({ icon: Icon, title, description }: { icon: any, title: string, description: string }) => (
    <div className="bg-white p-6 rounded-xl border border-gray-100 hover:shadow-md transition-shadow">
        <div className="w-12 h-12 bg-primary-50 text-primary-600 rounded-lg flex items-center justify-center mb-4">
            <Icon size={24} />
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
    </div>
);

const ProcessStep = ({ step, title, description }: { step: string, title: string, description: string }) => (
    <div className="flex gap-4">
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center font-bold text-sm">
            {step}
        </div>
        <div>
            <h4 className="font-bold text-gray-900">{title}</h4>
            <p className="text-sm text-gray-600">{description}</p>
        </div>
    </div>
);
