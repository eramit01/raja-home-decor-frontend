import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { OrderService } from '../services/order.service';
import { FiArrowLeft, FiPackage, FiTruck, FiMapPin, FiCreditCard } from 'react-icons/fi';

interface Order {
    _id: string;
    orderNumber: string;
    createdAt: string;
    status: 'pending_payment' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    refundStatus: 'none' | 'requested' | 'processed' | 'failed';
    total: number;
    paymentMethod: 'cod' | 'upi' | 'online';
    shippingAddress: {
        fullName: string;
        address: string;
        city: string;
        state: string;
        pincode: string;
        phone: string;
    };
    items: {
        productId: {
            _id: string;
            name: string;
        };
        name: string;
        image: string;
        quantity: number;
        price: number;
    }[];
}

export const OrderDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const [order, setOrder] = useState<Order | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (id) {
            fetchOrderDetails(id);
        }
    }, [id]);

    const fetchOrderDetails = async (orderId: string) => {
        try {
            const data = await OrderService.getOrderById(orderId);
            setOrder(data);
        } catch (error) {
            console.error('Failed to fetch order details', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancelOrder = async () => {
        if (!window.confirm('Are you sure you want to cancel this order?')) return;
        try {
            await OrderService.cancelOrder(order?._id as string);
            // Refresh order details
            fetchOrderDetails(order?._id as string);
            alert('Order cancelled successfully');
        } catch (error: any) {
            console.error('Failed to cancel order', error);
            alert(error.response?.data?.message || 'Failed to cancel order');
        }
    };

    const [isRefundModalOpen, setIsRefundModalOpen] = useState(false);
    const [refundReason, setRefundReason] = useState('');
    const [isSubmittingRefund, setIsSubmittingRefund] = useState(false);

    const handleRequestRefund = async () => {
        if (!refundReason.trim()) {
            alert('Please provide a reason for the refund');
            return;
        }
        setIsSubmittingRefund(true);
        try {
            await OrderService.requestRefund(order?._id as string, refundReason);
            alert('Refund requested successfully');
            setIsRefundModalOpen(false);
            fetchOrderDetails(order?._id as string);
        } catch (error: any) {
            console.error('Failed to request refund', error);
            alert(error.response?.data?.message || 'Failed to request refund');
        } finally {
            setIsSubmittingRefund(false);
        }
    };



    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-12 flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="container mx-auto px-4 py-12 text-center">
                <h2 className="text-xl font-bold text-gray-900">Order not found</h2>
                <Link to="/orders" className="text-primary-600 mt-4 inline-block">Back to Orders</Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4 max-w-4xl">
                {/* Back Link */}
                <Link to="/orders" className="inline-flex items-center text-gray-500 hover:text-black mb-6 transition-colors">
                    <FiArrowLeft className="mr-2" />
                    Back to My Orders
                </Link>

                {/* Order Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Order #{order.orderNumber}</h1>
                        <p className="text-gray-500 mt-1">
                            Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </p>
                    </div>
                    <div className="flex gap-3">
                        {/* Dummy Track Button */}
                        {order.status === 'shipped' && (
                            <button className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
                                <FiTruck />
                                Track Package
                            </button>
                        )}
                        <div className={`px-4 py-2 rounded-lg text-sm font-bold border ${order.status === 'delivered' ? 'bg-green-100 text-green-800 border-green-200' :
                            order.status === 'cancelled' ? 'bg-red-100 text-red-800 border-red-200' :
                                'bg-blue-100 text-blue-800 border-blue-200'
                            }`}>
                            {order.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </div>

                        {/* Cancel Button */}
                        {['pending_payment', 'confirmed', 'processing'].includes(order.status) && (
                            <button
                                onClick={handleCancelOrder}
                                className="bg-red-50 text-red-600 border border-red-200 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors"
                            >
                                Cancel Order
                            </button>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="md:col-span-2 space-y-6">

                        {/* Items */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-4 border-b border-gray-100 bg-gray-50">
                                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                                    <FiPackage /> Items ({order.items.length})
                                </h3>
                            </div>
                            <div className="divide-y divide-gray-100">
                                {order.items.map((item, index) => (
                                    <div key={index} className="p-4 flex gap-4">
                                        <div className="w-20 h-20 bg-gray-50 rounded-lg border border-gray-200 flex-shrink-0 p-1">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                                        </div>
                                        <div className="flex-1">
                                            {item.productId ? (
                                                <Link to={`/product/${item.productId._id}`} className="font-medium text-gray-900 hover:text-primary-600 line-clamp-2">
                                                    {item.name}
                                                </Link>
                                            ) : (
                                                <span className="font-medium text-gray-900 line-clamp-2">
                                                    {item.name}
                                                </span>
                                            )}
                                            <div className="mt-2 flex justify-between items-center">
                                                <span className="text-sm text-gray-500">Qty: {item.quantity}</span>
                                                <span className="font-bold text-gray-900">₹{(item.price * item.quantity).toLocaleString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Payment Info */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <FiCreditCard /> Payment Summary
                            </h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal</span>
                                    <span>₹{order.total.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Shipping</span>
                                    <span className="text-green-600">Free</span>
                                </div>
                                <div className="flex justify-between font-bold text-lg text-gray-900 pt-2 border-t border-dashed">
                                    <span>Total</span>
                                    <span>₹{order.total.toLocaleString()}</span>
                                </div>
                                <div className="mt-4 pt-4 border-t border-gray-100">
                                    <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Payment Method</span>
                                    <p className="text-gray-900 font-medium capitalize mt-1">
                                        {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}
                                    </p>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Delivery Address */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <FiMapPin /> Delivery Address
                            </h3>
                            <div className="text-sm text-gray-600 space-y-1">
                                <p className="font-bold text-gray-900">{order.shippingAddress.fullName}</p>
                                <p>{order.shippingAddress.address}</p>
                                <p>{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</p>
                                <p className="pt-2 text-gray-900 font-medium">Phone: {order.shippingAddress.phone}</p>
                            </div>
                        </div>

                        {/* Support */}
                        <div className="bg-blue-50 rounded-xl border border-blue-100 p-6">
                            <h3 className="font-semibold text-blue-900 mb-2">Need Help?</h3>
                            <p className="text-sm text-blue-800 mb-4">
                                Have an issue with this order? Contact our support team.
                            </p>
                            <button className="w-full bg-white text-blue-600 border border-blue-200 py-2 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors">
                                Contact Support
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Refund Modal */}
            {isRefundModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl max-w-md w-full p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Request Refund</h3>
                        <p className="text-sm text-gray-500 mb-4">
                            Please confirm why you want to return this order.
                        </p>
                        <textarea
                            value={refundReason}
                            onChange={(e) => setRefundReason(e.target.value)}
                            placeholder="Reason for refund..."
                            className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none mb-4"
                            rows={4}
                        />
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setIsRefundModalOpen(false)}
                                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleRequestRefund}
                                disabled={isSubmittingRefund}
                                className="px-4 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 disabled:opacity-50"
                            >
                                {isSubmittingRefund ? 'Submitting...' : 'Submit Request'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
