import { useState, useEffect } from 'react';
import { FiStar, FiUser, FiCheckCircle } from 'react-icons/fi';
import { ReviewService, Review } from '../../services/review.service';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

interface ReviewsSectionProps {
    productId: string;
}

export const ReviewsSection = ({ productId }: ReviewsSectionProps) => {
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ rating: 5, title: '', comment: '' });
    const [images, setImages] = useState<File[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchReviews = async () => {
            if (!productId) {
                setIsLoading(false);
                return;
            }
            try {
                const data = await ReviewService.getProductReviews(productId);
                setReviews(data);
            } catch (error) {
                console.error('Error fetching reviews:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchReviews();
    }, [productId]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setImages(Array.from(e.target.files));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const data = new FormData();
            data.append('productId', productId);
            data.append('rating', formData.rating.toString());
            data.append('title', formData.title);
            data.append('comment', formData.comment);

            images.forEach((image) => {
                data.append('images', image);
            });

            const newReview = await ReviewService.createReview(data);
            setReviews(prev => [newReview, ...prev]);
            setShowForm(false);
            setFormData({ rating: 5, title: '', comment: '' });
            setImages([]);
            alert('Review submitted successfully!');
        } catch (error: any) {
            alert(error.response?.data?.message || 'Failed to submit review');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-white p-6 md:rounded-lg md:shadow-sm">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Ratings & Reviews</h2>
                {isAuthenticated ? (
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
                    >
                        {showForm ? 'Cancel Review' : 'Rate Product'}
                    </button>
                ) : (
                    <a href="/login" className="text-blue-600 hover:underline text-sm font-medium">Login to Review</a>
                )}
            </div>

            {/* Write Review Form */}
            {showForm && (
                <form onSubmit={handleSubmit} className="mb-8 p-4 bg-gray-50 rounded-xl border border-gray-200 animate-fade-in">
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    type="button"
                                    key={star}
                                    onClick={() => setFormData({ ...formData, rating: star })}
                                    className={`text-2xl transition-transform hover:scale-110 ${formData.rating >= star ? 'text-yellow-400' : 'text-gray-300'}`}
                                >
                                    <FiStar className="fill-current" />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                        <input
                            type="text"
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                            placeholder="Summarize your experience"
                            value={formData.title}
                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Review</label>
                        <textarea
                            required
                            rows={3}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                            placeholder="What did you like or dislike?"
                            value={formData.comment}
                            onChange={e => setFormData({ ...formData, comment: e.target.value })}
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Add Photos (Max 5)</label>
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleImageChange}
                            className="w-full text-sm text-gray-500
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-full file:border-0
                                file:text-sm file:font-semibold
                                file:bg-primary-50 file:text-primary-700
                                hover:file:bg-primary-100"
                        />
                        <p className="mt-1 text-xs text-gray-500">{images.length} images selected</p>
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-black text-white px-6 py-2 rounded-lg font-bold hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            {isSubmitting ? 'Submitting...' : 'Submit Review'}
                        </button>
                    </div>
                </form>
            )}

            {/* Reviews List */}
            {isLoading ? (
                <div className="text-center py-8 text-gray-500">Loading reviews...</div>
            ) : reviews.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                    <div className="text-gray-400 mb-2 font-medium">No reviews yet</div>
                    <p className="text-sm text-gray-500">Be the first to review this product</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {reviews.map((review) => (
                        <div key={review._id} className="border-b border-gray-100 last:border-0 pb-6 last:pb-0">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="bg-green-600 text-white px-2 py-0.5 rounded text-xs font-bold flex items-center gap-1">
                                    {review.rating} <FiStar className="fill-current" size={10} />
                                </div>
                                {review.title && <span className="font-bold text-gray-900">{review.title}</span>}
                            </div>
                            <p className="text-gray-600 text-sm mb-3 leading-relaxed">{review.comment}</p>

                            {/* Review Images */}
                            {review.images && review.images.length > 0 && (
                                <div className="flex gap-2 mb-3 overflow-x-auto pb-2">
                                    {review.images.map((img, idx) => (
                                        <img
                                            key={idx}
                                            src={img}
                                            alt={`Review by ${review.user?.name || review.manualName || 'User'}`}
                                            className="w-16 h-16 object-cover rounded-lg border border-gray-200 cursor-pointer hover:opacity-90"
                                            onClick={() => window.open(img, '_blank')}
                                        />
                                    ))}
                                </div>
                            )}

                            <div className="flex items-center gap-2 text-xs text-gray-400">
                                <div className="flex items-center gap-1 text-gray-500 font-medium">
                                    <FiUser size={12} />
                                    {review.user?.name || review.manualName || 'Anonymous User'}
                                </div>
                                <span>•</span>
                                <div className="flex items-center gap-1 text-green-600">
                                    <FiCheckCircle size={10} />
                                    {review.isVerified ? 'Verified Purchase' : 'Review'}
                                </div>
                                <span>•</span>
                                <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
