import { FiStar } from 'react-icons/fi';

interface RatingsSummaryProps {
    rating: number;
    totalReviews: number;
}

export const RatingsSummary = ({ rating, totalReviews }: RatingsSummaryProps) => {
    if (totalReviews === 0) {
        return (
            <div className="text-sm text-gray-600">
                Be the first to review
            </div>
        );
    }

    return (
        <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 px-2 py-1 bg-green-600 text-white rounded text-sm font-semibold">
                <span>{rating.toFixed(1)}</span>
                <FiStar size={14} fill="white" />
            </div>
            <span className="text-sm text-gray-600">
                ({totalReviews.toLocaleString('en-IN')} {totalReviews === 1 ? 'Review' : 'Reviews'})
            </span>
        </div>
    );
};
