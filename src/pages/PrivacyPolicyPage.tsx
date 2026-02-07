export const PrivacyPolicyPage = () => {
    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-lg shadow-sm p-8 md:p-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
                    <p className="text-sm text-gray-500 mb-8">Last updated: February 4, 2026</p>

                    <div className="prose prose-gray max-w-none">
                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Information We Collect</h2>
                            <p className="text-gray-600 mb-4">
                                We collect information that you provide directly to us, including:
                            </p>
                            <ul className="list-disc pl-6 text-gray-600 space-y-2">
                                <li>Name, email address, phone number, and shipping address</li>
                                <li>Payment information (processed securely through our payment partners)</li>
                                <li>Order history and preferences</li>
                                <li>Communication preferences</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. How We Use Your Information</h2>
                            <p className="text-gray-600 mb-4">
                                We use the information we collect to:
                            </p>
                            <ul className="list-disc pl-6 text-gray-600 space-y-2">
                                <li>Process and fulfill your orders</li>
                                <li>Send order confirmations and shipping updates</li>
                                <li>Respond to your questions and provide customer support</li>
                                <li>Send promotional emails (you can opt-out anytime)</li>
                                <li>Improve our products and services</li>
                                <li>Prevent fraud and enhance security</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Information Sharing</h2>
                            <p className="text-gray-600 mb-4">
                                We do not sell or rent your personal information to third parties. We may share your information with:
                            </p>
                            <ul className="list-disc pl-6 text-gray-600 space-y-2">
                                <li>Shipping partners to deliver your orders</li>
                                <li>Payment processors to handle transactions securely</li>
                                <li>Service providers who assist in our operations</li>
                                <li>Law enforcement when required by law</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Data Security</h2>
                            <p className="text-gray-600 mb-4">
                                We implement appropriate security measures to protect your personal information from unauthorized access,
                                alteration, disclosure, or destruction. All payment information is encrypted and processed through secure
                                payment gateways.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Cookies</h2>
                            <p className="text-gray-600 mb-4">
                                We use cookies and similar technologies to enhance your browsing experience, analyze site traffic, and
                                personalize content. You can control cookies through your browser settings.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Your Rights</h2>
                            <p className="text-gray-600 mb-4">
                                You have the right to:
                            </p>
                            <ul className="list-disc pl-6 text-gray-600 space-y-2">
                                <li>Access and update your personal information</li>
                                <li>Request deletion of your account and data</li>
                                <li>Opt-out of marketing communications</li>
                                <li>Object to processing of your data</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Children's Privacy</h2>
                            <p className="text-gray-600 mb-4">
                                Our services are not directed to children under 18. We do not knowingly collect personal information
                                from children.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Changes to This Policy</h2>
                            <p className="text-gray-600 mb-4">
                                We may update this privacy policy from time to time. We will notify you of any changes by posting the
                                new policy on this page and updating the "Last updated" date.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Contact Us</h2>
                            <p className="text-gray-600 mb-4">
                                If you have any questions about this Privacy Policy, please contact us at:
                            </p>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-gray-700">Email: privacy@example.com</p>
                                <p className="text-gray-700">Phone: +91 98765 43210</p>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};
