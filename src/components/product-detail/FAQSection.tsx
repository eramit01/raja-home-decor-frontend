
import { Disclosure } from '@headlessui/react'
import { FiChevronUp } from 'react-icons/fi'

const dummyFAQs = [
    {
        question: "What is the burn time?",
        answer: "The burn time is approximately 20-25 hours under standard conditions."
    },
    {
        question: "Is the fragrance strong?",
        answer: "Yes, it has a medium-strong throw, perfect for bedrooms and living rooms."
    },
    {
        question: "Is the glass heat resistant?",
        answer: "Yes, we use high-quality heat-resistant glass aimed for safe candle burning."
    },
    {
        question: "Can I order in bulk?",
        answer: "Absolutely! We offer factory pricing for bulk orders. Please use the 'Bulk Enquiry' button."
    },
    {
        question: "What is the return policy?",
        answer: "We offer easy replacements for any damaged items received during transit."
    }
]

export const FAQSection = () => {
    return (
        <div className="bg-white px-4 py-6 mb-2">
            <h3 className="text-md font-bold text-gray-900 mb-4">Frequently Asked Questions</h3>
            <div className="space-y-2">
                {dummyFAQs.map((faq, index) => (
                    <Disclosure key={index} as="div" className="border border-gray-100 rounded-lg overflow-hidden">
                        {({ open }) => (
                            <>
                                <Disclosure.Button className="flex w-full justify-between bg-gray-50 px-4 py-3 text-left text-sm font-medium text-gray-900 hover:bg-gray-100 focus:outline-none focus-visible:ring focus-visible:ring-purple-500/75">
                                    <span>{faq.question}</span>
                                    <FiChevronUp
                                        className={`${open ? 'rotate-180 transform' : ''
                                            } h-5 w-5 text-gray-500 transition-transform duration-200`}
                                    />
                                </Disclosure.Button>
                                <Disclosure.Panel className="px-4 pb-4 pt-2 text-sm text-gray-600 leading-relaxed">
                                    {faq.answer}
                                </Disclosure.Panel>
                            </>
                        )}
                    </Disclosure>
                ))}
            </div>
        </div>
    );
};
