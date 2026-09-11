'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '@shared/types';
import { api } from '../../lib/api';
import { useAuth } from './AuthContext';

interface WishlistContextType {
  wishlist: Product[];
  toggleWishlist: (product: Product) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  loading: boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadWishlist = async () => {
      if (user) {
        try {
          const res = await api.getWishlist();
          if (res.success && Array.isArray(res.wishlist)) {
            setWishlist(res.wishlist);
          }
        } catch (err) {
          console.error('Error fetching wishlist:', err);
        }
      } else {
        const saved = localStorage.getItem('anthurium_guest_wishlist');
        if (saved) {
          try {
            setWishlist(JSON.parse(saved));
          } catch (e) {
            setWishlist([]);
          }
        }
      }
    };

    loadWishlist();
  }, [user]);

  const toggleWishlist = async (product: Product) => {
    const exists = wishlist.some((p) => p._id === product._id);

    if (user) {
      // Use separate Wishlist API backend endpoint
      setWishlist((prev) => (exists ? prev.filter((p) => p._id !== product._id) : [...prev, product]));
      try {
        const res = await api.toggleWishlist(product._id);
        if (res.success && Array.isArray(res.wishlist)) {
          setWishlist(res.wishlist);
        }
      } catch (err) {
        console.error('Failed to toggle wishlist:', err);
      }
    } else {
      // LocalStorage for guest users
      let updated: Product[];
      if (exists) {
        updated = wishlist.filter((p) => p._id !== product._id);
      } else {
        updated = [...wishlist, product];
      }
      setWishlist(updated);
      localStorage.setItem('anthurium_guest_wishlist', JSON.stringify(updated));
    }
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some((p) => p._id === productId);
  };

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, isInWishlist, loading }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist must be used within WishlistProvider');
  return context;
};
