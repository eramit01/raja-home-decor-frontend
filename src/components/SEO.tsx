import { Helmet } from 'react-helmet-async';

interface SEOProps {
    title?: string;
    description?: string;
    keywords?: string;
    image?: string;
    url?: string;
}

export const SEO = ({
    title = 'Luxe Candle Co. | Premium Handcrafted Candles',
    description = 'Discover our collection of premium, handcrafted soy wax candles. Made with natural ingredients and luxurious fragrances.',
    keywords = 'candles, soy wax, handcrafted, luxury, home decor, fragrance',
    image = '/og-image.jpg',
    url = window.location.href
}: SEOProps) => {
    const siteTitle = 'Luxe Candle Co.';
    const fullTitle = title === siteTitle ? title : `${title} | ${siteTitle}`;

    return (
        <Helmet>
            {/* Basic */}
            <title>{fullTitle}</title>
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content="website" />
            <meta property="og:url" content={url} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={image} />

            {/* Twitter */}
            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:url" content={url} />
            <meta property="twitter:title" content={fullTitle} />
            <meta property="twitter:description" content={description} />
            <meta property="twitter:image" content={image} />
        </Helmet>
    );
};
