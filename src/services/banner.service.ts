import { api } from './api';

export interface Banner {
  _id: string;
  title: string;
  image: string;
  link?: string;
  order: number;
}

export const bannerService = {
  getActiveBanners: async () => {
    try {
      const response = await api.get('/banners');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch banners', error);
      return { data: { banners: [] } };
    }
  },
};
