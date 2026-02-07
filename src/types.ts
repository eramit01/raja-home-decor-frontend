export interface Product {
    id: string;
    _id?: string; // For backend compatibility
    title: string; // Mapped from name
    name?: string; // Backend field
    price: number;
    originalPrice?: number;
    images: string[];
    rating: number;
    totalReviews: number;
    slug?: string;
    category: string;
    categoryId?: string;
    categorySlug?: string;
    categoryName?: string;
    description?: string;
    tags?: string[];
    stock?: number;
    sku?: string;
    [key: string]: any;
}

export interface Category {
    id: string;
    name: string;
    slug: string;
    image?: string;
}
