import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useSelector } from 'react-redux';
import { wishlistService, WishlistItem } from '../services/wishlist.service';
import { RootState } from '../store';

interface WishlistContextType {
    wishlist: WishlistItem[];
    wishlistCount: number;
    isLoading: boolean;
    addToWishlist: (productId: string) => Promise<void>;
    removeFromWishlist: (productId: string) => Promise<void>;
    clearWishlist: () => Promise<void>;
    isInWishlist: (productId: string) => boolean;
    refreshWishlist: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
    const [wishlistCount, setWishlistCount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);

    const refreshWishlist = async () => {
        if (!isAuthenticated) {
            setWishlist([]);
            setWishlistCount(0);
            return;
        }

        try {
            setIsLoading(true);
            const response = await wishlistService.getWishlist();
            setWishlist(response.data.wishlist.items);
            setWishlistCount(response.data.wishlist.count);
        } catch (error) {
            console.error('Failed to fetch wishlist:', error);
            setWishlist([]);
            setWishlistCount(0);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        refreshWishlist();
    }, [isAuthenticated]);

    const addToWishlist = async (productId: string) => {
        try {
            const response = await wishlistService.addToWishlist(productId);
            setWishlist(response.data.wishlist.items);
            setWishlistCount(response.data.wishlist.count);
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Failed to add to wishlist');
        }
    };

    const removeFromWishlist = async (productId: string) => {
        try {
            const response = await wishlistService.removeFromWishlist(productId);
            setWishlist(response.data.wishlist.items);
            setWishlistCount(response.data.wishlist.count);
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Failed to remove from wishlist');
        }
    };

    const clearWishlist = async () => {
        try {
            await wishlistService.clearWishlist();
            setWishlist([]);
            setWishlistCount(0);
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Failed to clear wishlist');
        }
    };

    const isInWishlist = (productId: string): boolean => {
        return wishlist.some(item => item.product._id === productId);
    };

    return (
        <WishlistContext.Provider
            value={{
                wishlist,
                wishlistCount,
                isLoading,
                addToWishlist,
                removeFromWishlist,
                clearWishlist,
                isInWishlist,
                refreshWishlist
            }}
        >
            {children}
        </WishlistContext.Provider>
    );
};

export const useWishlist = () => {
    const context = useContext(WishlistContext);
    if (context === undefined) {
        throw new Error('useWishlist must be used within a WishlistProvider');
    }
    return context;
};
