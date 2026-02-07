import { Link } from 'react-router-dom';
import { FiFacebook, FiInstagram, FiTwitter, FiYoutube, FiMapPin, FiPhone, FiMail } from 'react-icons/fi';

export const Footer = () => {
    return (
        <footer className="bg-black text-white pt-16 pb-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    {/* Brand Column */}
                    <div>
                        <Link to="/" className="text-2xl font-extrabold tracking-tighter text-white mb-6 block">
                            Store Logo
                        </Link>
                        <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                            Premium home decor and lifestyle products designed to elevate your living spaces. Experience luxury in every detail.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center hover:bg-white hover:text-black transition-all">
                                <FiInstagram className="w-5 h-5" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center hover:bg-white hover:text-black transition-all">
                                <FiFacebook className="w-5 h-5" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center hover:bg-white hover:text-black transition-all">
                                <FiYoutube className="w-5 h-5" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center hover:bg-white hover:text-black transition-all">
                                <FiTwitter className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-bold mb-6">Quick Links</h3>
                        <ul className="space-y-4 text-sm text-gray-400">
                            <li><Link to="/products" className="hover:text-white transition-colors">All Products</Link></li>
                            <li><Link to="/category/candles" className="hover:text-white transition-colors">Candles</Link></li>
                            <li><Link to="/category/decor" className="hover:text-white transition-colors">Home Decor</Link></li>
                            <li><Link to="/bulk-enquiry" className="hover:text-white transition-colors">Bulk Orders</Link></li>
                            <li><Link to="/login" className="hover:text-white transition-colors">My Account</Link></li>
                        </ul>
                    </div>

                    {/* Customer Service */}
                    <div>
                        <h3 className="text-lg font-bold mb-6">Customer Care</h3>
                        <ul className="space-y-4 text-sm text-gray-400">
                            <li><Link to="/faq" className="hover:text-white transition-colors">FAQs</Link></li>
                            <li><Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                            <li><Link to="/terms" className="hover:text-white transition-colors">Terms & Conditions</Link></li>
                            <li><Link to="/bulk-enquiry" className="hover:text-white transition-colors">Bulk Orders</Link></li>
                            <li><Link to="/orders" className="hover:text-white transition-colors">Track Order</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-lg font-bold mb-6">Contact Us</h3>
                        <ul className="space-y-4 text-sm text-gray-400">
                            <li className="flex gap-3">
                                <FiMapPin className="w-5 h-5 flex-shrink-0 mt-0.5" />
                                <span>123 Fashion Street, Design District,<br />New Delhi, India 110001</span>
                            </li>
                            <li className="flex gap-3">
                                <FiPhone className="w-5 h-5 flex-shrink-0" />
                                <span>+91 98765 43210</span>
                            </li>
                            <li className="flex gap-3">
                                <FiMail className="w-5 h-5 flex-shrink-0" />
                                <span>support@storelogo.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-gray-500 text-sm">
                        © {new Date().getFullYear()} Store Logo. All rights reserved.
                    </p>
                    <div className="flex gap-6 text-gray-500 text-sm">
                        <span>Visa</span>
                        <span>Mastercard</span>
                        <span>UPI</span>
                        <span>Net Banking</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};
