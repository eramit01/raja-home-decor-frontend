import { useState, useEffect } from 'react';
import { FiStar } from 'react-icons/fi';
import { api } from '../../services/api';

interface Review {
    _id: string;
    user: { name: string };
    rating: number;
    comment: string;
    createdAt: string;
}

interface ReviewsSectionProps {
    productId: string;
}

export const ReviewsSection = ({ productId }: ReviewsSectionProps) => {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                setLoading(true);
                const response = await api.get(`/reviews/product/${productId}?page=${page}&limit=5`);
                const data = response.data;

                if (data.success) {
                    setReviews(data.data.reviews);
                    setHasMore(data.data.pagination.page < data.data.pagination.pages);
                }
            } catch (error) {
                console.error('Failed to fetch reviews:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, [productId, page]);

    if (loading && reviews.length === 0) {
        return (
            <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900">Customer Reviews</h3>

            {reviews.length === 0 ? (
                <div className="text-center py-8 text-gray-600">
                    No reviews yet. Be the first to review!
                </div>
            ) : (
                <>
                    <div className="space-y-4">
                        {reviews.map((review) => (
                            <div
                                key={review._id}
                                className="p-4 bg-gray-50 rounded-xl"
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-medium text-gray-900">
                                        {review.user?.name || 'Anonymous'}
                                    </span>
                                    <div className="flex items-center gap-1 text-yellow-500">
                                        {[...Array(5)].map((_, i) => (
                                            <FiStar
                                                key={i}
                                                size={14}
                                                fill={i < review.rating ? 'currentColor' : 'none'}
                                            />
                                        ))}
                                    </div>
                                </div>
                                <p className="text-sm text-gray-700 leading-relaxed">{review.comment}</p>
                                <p className="text-xs text-gray-500 mt-2">
                                    {new Date(review.createdAt).toLocaleDateString('en-IN', {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric'
                                    })}
                                </p>
                            </div>
                        ))}
                    </div>

                    {hasMore && (
                        <button
                            onClick={() => setPage(page + 1)}
                            className="w-full py-3 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                        >
                            View More Reviews
                        </button>
                    )}
                </>
            )}
        </div>
    );
};
