import { Link } from 'react-router-dom';
import { Category } from '../services/category.service';

interface CategorySectionProps {
  categories: Category[];
}

export const CategorySection = ({ categories }: CategorySectionProps) => {
  const visibleCategories = categories.slice(0, 10);

  const CategoryItem = ({ category }: { category: Category }) => {
    const imageSrc = category.icon || category.image;

    return (
      <Link
        key={category._id}
        to={`/category/${category.slug}`}
        className="group flex flex-col items-center w-20 md:w-24 flex-shrink-0 rounded-lg px-1 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
      >
        <div className="h-16 w-16 md:h-20 md:w-20 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center transition-transform md:group-hover:scale-105 md:group-hover:shadow-sm">
          {imageSrc ? (
            <img
              src={imageSrc}
              alt={category.name}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          ) : (
            <span className="text-2xl select-none" aria-hidden="true">
              📦
            </span>
          )}
        </div>

        <span className="mt-2 text-xs md:text-sm text-center text-gray-700 leading-snug line-clamp-2 h-8 md:h-10">
          {category.name}
        </span>
      </Link>
    );
  };

  return (
    <section className="mb-6">
      {/* Mobile: horizontal scroll (Flipkart-like) */}
      <div className="md:hidden -mx-4 px-4">
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide scroll-smooth snap-x snap-mandatory">
          {visibleCategories.map((category) => (
            <div key={category._id} className="snap-start">
              <CategoryItem category={category} />
            </div>
          ))}
        </div>
      </div>

      {/* Desktop/Tablet: centered flex layout */}
      <div className="hidden md:flex flex-wrap justify-center gap-4">
        {visibleCategories.map((category) => (
          <CategoryItem key={category._id} category={category} />
        ))}
      </div>
    </section>
  );
};
