// src/hooks/useProducts.ts

import { useState, useEffect } from 'react';
import { getAllProducts, getUnsplashWatchPhotos } from '../services';
import type { ProductWithImage, Product } from '../types';

export const useProducts = () => {
    const [products, setProducts] = useState<ProductWithImage[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // ⬅️ NEW: STATE FILTER
    const [filters, setFilters] = useState({
        search: "",
        brand: "all",
        price: "all",
        gender: "all",
        sort: "none",
        page: 1,
    });

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const productList: Product[] = await getAllProducts();
                const photos = await getUnsplashWatchPhotos('classic watch, luxury watch', productList.length);

                const productsWithImages: ProductWithImage[] = productList.map((product, index) => ({
                    ...product,
                    imageUrl: photos[index]?.urls.regular || '/default-watch-placeholder.svg',
                }));

                setProducts(productsWithImages);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch products or images.');
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    return { products, loading, error, filters, setFilters };
};
