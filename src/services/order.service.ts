import { api } from './api';

export interface CreateOrderParams {
    items: {
        productId: string;
        quantity: number;
        image: string; // Snapshot
    }[];
    shippingAddress: {
        fullName: string;
        phone: string;
        email: string; // Snapshot
        address: string;
        city: string;
        state: string;
        pincode: string;
    };
    paymentMethod: 'cod' | 'online';
}

export const OrderService = {
    createOrder: async (data: CreateOrderParams) => {
        const response = await api.post('/orders', data);
        return response.data.data; // Returns { order, token }
    },

    verifyPayment: async (data: {
        orderId: string;
        paymentId: string;
        signature: string;
        razorpayOrderId: string;
    }) => {
        const response = await api.post('/orders/verify-payment', data);
        return response.data.data.order;
    },

    getMyOrders: async () => {
        const response = await api.get('/orders');
        return response.data.data.orders;
    },

    getOrderById: async (id: string) => {
        const response = await api.get(`/orders/${id}`);
        return response.data.data.order;
    }
};
