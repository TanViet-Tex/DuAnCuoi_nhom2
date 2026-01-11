import { createContext, useContext, useEffect, useState } from "react";
import type { ProductBase } from "../types/product";

type WishlistContextType = {
  wishlist: ProductBase[];
  toggleWishlist: (product: ProductBase) => void;
  isWishlisted: (id: string) => boolean;
  removeFromWishlist: (id: string) => void;
  wishlistCount: number;
};

const WishlistContext = createContext<WishlistContextType | null>(null);
const STORAGE_KEY = "wishlist_products";

export const WishlistProvider = ({ children }: { children: React.ReactNode }) => {
  const [wishlist, setWishlist] = useState<ProductBase[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load từ localStorage khi component mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      setWishlist(stored ? JSON.parse(stored) : []);
    } catch (error) {
      setWishlist([]);
    }
    setIsLoaded(true);
  }, []);

  // Lưu vào localStorage khi wishlist thay đổi
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(wishlist));
    }
  }, [wishlist, isLoaded]);

  const toggleWishlist = (product: ProductBase) => {
    setWishlist(prev => {
      const exists = prev.some(p => p.id === product.id);
      if (exists) {
        return prev.filter(p => p.id !== product.id);
      } else {
        return [...prev, product];
      }
    });
  };

  const isWishlisted = (id: string): boolean => {
    return wishlist.some(p => p.id === id);
  };

  const removeFromWishlist = (id: string) => {
    setWishlist(prev => prev.filter(p => p.id !== id));
  };

  const value: WishlistContextType = {
    wishlist,
    toggleWishlist,
    isWishlisted,
    removeFromWishlist,
    wishlistCount: wishlist.length,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used inside WishlistProvider");
  return ctx;
};
