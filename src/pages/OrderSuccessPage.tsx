import { useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { FiCheckCircle, FiPackage, FiShoppingBag, FiArrowRight } from 'react-icons/fi';
import confetti from 'canvas-confetti';

export const OrderSuccessPage = () => {
    const { orderId } = useParams();

    useEffect(() => {
        // Fire confetti on mount
        const duration = 3 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        const randomInRange = (min: number, max: number) => {
            return Math.random() * (max - min) + min;
        }

        const interval: any = setInterval(function () {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            // since particles fall down, start a bit higher than random
            confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
            confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
        }, 250);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-[70vh] flex items-center justify-center bg-gray-50 px-4 py-12">
            <div className="max-w-lg w-full bg-white rounded-2xl shadow-xl p-8 text-center border border-gray-100">
                <div className="mb-6 flex justify-center">
                    <div className="rounded-full bg-green-50 p-6 relative">
                        <div className="absolute inset-0 rounded-full animate-ping bg-green-100 opacity-75"></div>
                        <FiCheckCircle className="w-20 h-20 text-green-500 relative z-10" />
                    </div>
                </div>

                <h1 className="text-3xl font-extrabold text-gray-900 mb-2 font-display">
                    Order Placed Successfully!
                </h1>
                <p className="text-gray-500 mb-8 max-w-sm mx-auto">
                    Thank you for your purchase. We've received your order and are getting it ready to ship.
                </p>

                <div className="bg-gray-50 rounded-xl p-4 mb-8 border border-gray-100/50">
                    <div className="text-sm text-gray-400 mb-1 uppercase tracking-wider font-medium">Order Number</div>
                    <div className="text-xl font-bold text-gray-900 font-mono tracking-wide selection:bg-green-100">
                        {orderId ? `#${orderId.slice(-8).toUpperCase()}` : 'Unavailable'}
                    </div>
                </div>

                <div className="flex flex-col gap-3">
                    <Link
                        to={`/orders`}
                        className="w-full bg-black hover:bg-gray-800 text-white py-4 px-6 rounded-xl font-bold shadow-md hover:shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2 group"
                    >
                        <FiPackage className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        View Order Details
                    </Link>

                    <Link
                        to="/"
                        className="w-full bg-white hover:bg-gray-50 text-gray-900 border-2 border-gray-200 py-4 px-6 rounded-xl font-bold transition-all active:scale-[0.98] flex items-center justify-center gap-2 hover:border-gray-300"
                    >
                        <FiShoppingBag className="w-5 h-5" />
                        Continue Shopping
                    </Link>
                </div>
            </div>
        </div>
    );
};
