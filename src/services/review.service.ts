import { api } from './api';

export interface Review {
    _id: string;
    user?: {
        _id: string;
        name: string;
    };
    manualName?: string;
    product: string;
    rating: number;
    title?: string;
    comment?: string;
    images?: string[];
    isVerified?: boolean;
    createdAt: string;
}

export const ReviewService = {
    getProductReviews: async (productId: string) => {
        try {
            const response = await api.get(`/reviews/product/${productId}`);
            return response.data.data.reviews;
        } catch (error) {
            console.error('Failed to fetch reviews', error);
            return [];
        }
    },

    createReview: async (reviewData: any) => {
        // Check if reviewData is FormData (has images) or JSON
        const isFormData = reviewData instanceof FormData;

        const response = await api.post('/reviews', reviewData, {
            headers: {
                'Content-Type': isFormData ? 'multipart/form-data' : 'application/json'
            }
        });
        return response.data.data.review;
    }
};
