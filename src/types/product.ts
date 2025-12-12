// src/types/product.ts

/**
 * 1. Định nghĩa kiểu dữ liệu cơ bản cho Sản phẩm
 * Đây là cấu trúc dữ liệu cơ bản bạn sẽ nhận được từ API backend (dịch vụ của bạn)
 */
export type ProductBase = {
  id: string;
  name: string;
  brand: string;
  model: string;
  price: number;
  oldPrice?: number; // Giá gốc (nếu có giảm giá)
  description: string;
  features: string[];
  stock: number;
  category: 'Men' | 'Women' | 'Unisex';
};

// ----------------------------------------------------

/**
 * 2. Định nghĩa kiểu dữ liệu cho Ảnh từ Unsplash API
 * Cần thiết cho hàm getUnsplashWatchPhotos trong product.service.ts
 */
export type UnsplashImage = {
  id: string;
  urls: {
    raw: string;
    full: string;
    regular: string; // Kích thước thường dùng cho ProductCard
    small: string;
    thumb: string;
  };
  alt_description: string | null;
  // Bạn có thể thêm các trường khác nếu cần (user, description,...)
};

// ----------------------------------------------------

/**
 * 3. Định nghĩa kiểu dữ liệu Sản phẩm có kèm Ảnh
 * Kiểu dữ liệu này được sử dụng trong hook useProducts.ts và ProductCard.tsx
 * Nó kết hợp Product cơ bản với trường imageUrl (từ Unsplash)
 */
export type ProductWithImage = ProductBase & {
  imageUrl: string;
};

// Backwards-compatible aliases expected by services/hooks
export type Product = ProductBase;
export type UnsplashPhoto = UnsplashImage;