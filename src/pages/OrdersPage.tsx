import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { OrderService } from '../services/order.service';
import { FiPackage, FiChevronRight, FiClock, FiCheckCircle, FiTruck, FiXCircle } from 'react-icons/fi';

interface OrderItem {
  productId: {
    _id: string;
    name: string;
    images: string[];
    slug: string;
  };
  quantity: number;
  price: number;
  image: string;
  name: string;
}

interface Order {
  _id: string;
  orderNumber: string;
  createdAt: string;
  status: 'pending_payment' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  items: OrderItem[];
}

const statusConfig: Record<string, { color: string; icon: any; label: string }> = {
  pending_payment: { color: 'bg-yellow-100 text-yellow-800', icon: FiClock, label: 'Payment Pending' },
  confirmed: { color: 'bg-blue-100 text-blue-800', icon: FiCheckCircle, label: 'Confirmed' },
  processing: { color: 'bg-blue-100 text-blue-800', icon: FiPackage, label: 'Processing' },
  shipped: { color: 'bg-purple-100 text-purple-800', icon: FiTruck, label: 'Shipped' },
  delivered: { color: 'bg-green-100 text-green-800', icon: FiCheckCircle, label: 'Delivered' },
  cancelled: { color: 'bg-red-100 text-red-800', icon: FiXCircle, label: 'Cancelled' },
};

export const OrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await OrderService.getMyOrders();
      setOrders(data);
    } catch (error) {
      console.error('Failed to fetch orders', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <FiPackage className="text-4xl text-gray-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">No Orders Yet</h2>
        <p className="text-gray-500 mb-8 max-w-md mx-auto">
          Looks like you haven't placed any orders yet. Start shopping to fill your wardrobe with amazing styles!
        </p>
        <Link
          to="/"
          className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 transition-colors"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-5xl">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">My Orders</h1>

        <div className="space-y-6">
          {orders.map((order) => {
            const statusInfo = statusConfig[order.status] || { color: 'bg-gray-100 text-gray-800', icon: FiClock, label: order.status };
            const StatusIcon = statusInfo.icon;

            return (
              <div
                key={order._id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Header */}
                <div className="bg-gray-50/50 px-6 py-4 border-b border-gray-100 flex flex-wrap gap-4 justify-between items-center">
                  <div className="flex gap-6 text-sm">
                    <div>
                      <p className="text-gray-500 mb-1">Order Placed</p>
                      <p className="font-medium text-gray-900">
                        {new Date(order.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 mb-1">Total Amount</p>
                      <p className="font-medium text-gray-900">₹{order.total.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 mb-1">Order #</p>
                      <p className="font-medium text-gray-900 font-mono">{order.orderNumber}</p>
                    </div>
                  </div>

                  <Link
                    to={`/orders/${order._id}`}
                    className="flex items-center text-primary-600 hover:text-primary-700 font-medium text-sm gap-1 group"
                  >
                    View Details
                    <FiChevronRight className="group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>

                {/* Body */}
                <div className="p-6">
                  <div className="flex flex-col md:flex-row gap-6 items-start">
                    {/* Status Badge */}
                    <div className="md:w-48 flex-shrink-0">
                      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                        <StatusIcon className="w-3.5 h-3.5" />
                        {statusInfo.label}
                      </div>
                      <p className="mt-2 text-xs text-gray-500">
                        Latest update: {new Date(order.createdAt).toLocaleTimeString()}
                      </p>
                    </div>

                    {/* Order Items Preview */}
                    <div className="flex-1 space-y-4">
                      {order.items.slice(0, 2).map((item, index) => (
                        <div key={index} className="flex gap-4">
                          <div className="w-16 h-16 bg-gray-50 rounded-lg border border-gray-100 flex-shrink-0 overflow-hidden">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900 line-clamp-1">
                              {item.name}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              Qty: {item.quantity} × ₹{item.price.toLocaleString()}
                            </p>
                          </div>
                        </div>
                      ))}
                      {order.items.length > 2 && (
                        <p className="text-xs text-gray-500 pt-2">
                          + {order.items.length - 2} more items
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
