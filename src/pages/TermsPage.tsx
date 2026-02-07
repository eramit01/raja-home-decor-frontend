export const TermsPage = () => {
    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-lg shadow-sm p-8 md:p-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-6">Terms & Conditions</h1>
                    <p className="text-sm text-gray-500 mb-8">Last updated: February 4, 2026</p>

                    <div className="prose prose-gray max-w-none">
                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
                            <p className="text-gray-600 mb-4">
                                By accessing and using this website, you accept and agree to be bound by the terms and conditions of this
                                agreement. If you do not agree to these terms, please do not use our website.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Use of Website</h2>
                            <p className="text-gray-600 mb-4">
                                You agree to use this website only for lawful purposes and in a way that does not infringe the rights of,
                                restrict, or inhibit anyone else's use of the website.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Product Information</h2>
                            <p className="text-gray-600 mb-4">
                                We strive to provide accurate product descriptions and pricing. However, we do not warrant that product
                                descriptions, pricing, or other content is accurate, complete, reliable, current, or error-free.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Pricing and Payment</h2>
                            <ul className="list-disc pl-6 text-gray-600 space-y-2">
                                <li>All prices are in Indian Rupees (INR) and include applicable taxes</li>
                                <li>We reserve the right to change prices without prior notice</li>
                                <li>Payment must be received before order processing</li>
                                <li>We accept UPI, Credit/Debit Cards, Net Banking, and Cash on Delivery</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Shipping and Delivery</h2>
                            <p className="text-gray-600 mb-4">
                                Delivery times are estimates and not guaranteed. We are not responsible for delays caused by:
                            </p>
                            <ul className="list-disc pl-6 text-gray-600 space-y-2">
                                <li>Incorrect shipping information provided by customer</li>
                                <li>Natural disasters or unforeseen circumstances</li>
                                <li>Courier service delays</li>
                                <li>Government restrictions or customs delays</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Returns and Refunds</h2>
                            <p className="text-gray-600 mb-4">
                                Our return policy allows returns within 7 days of delivery for eligible products:
                            </p>
                            <ul className="list-disc pl-6 text-gray-600 space-y-2">
                                <li>Products must be unused and in original packaging</li>
                                <li>Return shipping costs may apply</li>
                                <li>Refunds processed within 5-7 business days</li>
                                <li>Some products may not be eligible for return (hygiene products, perishables)</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. User Accounts</h2>
                            <p className="text-gray-600 mb-4">
                                You are responsible for:
                            </p>
                            <ul className="list-disc pl-6 text-gray-600 space-y-2">
                                <li>Maintaining the confidentiality of your account credentials</li>
                                <li>All activities that occur under your account</li>
                                <li>Notifying us immediately of any unauthorized use</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Intellectual Property</h2>
                            <p className="text-gray-600 mb-4">
                                All content on this website, including text, graphics, logos, images, and software, is the property of
                                our company and protected by copyright laws. Unauthorized use is prohibited.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Limitation of Liability</h2>
                            <p className="text-gray-600 mb-4">
                                We shall not be liable for any indirect, incidental, special, or consequential damages arising out of
                                or in connection with the use of our website or products.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Governing Law</h2>
                            <p className="text-gray-600 mb-4">
                                These terms shall be governed by and construed in accordance with the laws of India. Any disputes shall
                                be subject to the exclusive jurisdiction of courts in [Your City], India.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Changes to Terms</h2>
                            <p className="text-gray-600 mb-4">
                                We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting
                                on the website. Your continued use constitutes acceptance of modified terms.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Contact Information</h2>
                            <p className="text-gray-600 mb-4">
                                For questions about these Terms & Conditions, please contact us:
                            </p>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-gray-700">Email: support@example.com</p>
                                <p className="text-gray-700">Phone: +91 98765 43210</p>
                                <p className="text-gray-700">Address: [Your Business Address]</p>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};
