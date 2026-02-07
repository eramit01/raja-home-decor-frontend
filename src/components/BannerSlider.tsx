import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import { Banner } from '../services/banner.service';
import 'swiper/css';
import 'swiper/css/pagination';

interface BannerSliderProps {
  banners: Banner[];
}

export const BannerSlider = ({ banners }: BannerSliderProps) => {
  if (!banners || banners.length === 0) return null;

  return (
    <div className="mb-6">
      <Swiper
        modules={[Autoplay, Pagination]}
        spaceBetween={10}
        slidesPerView={1}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        pagination={{ clickable: true }}
        className="flipkart-banner-swiper"
      >
        {banners.map((banner) => (
          <SwiperSlide key={banner._id}>
            <a href={banner.link || '#'}>
              <div className="w-full overflow-hidden bg-gray-100 aspect-[3240/537]">
                <img
                  src={banner.image}
                  alt={banner.title}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
            </a>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};
