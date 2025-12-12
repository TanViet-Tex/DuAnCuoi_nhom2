// src/services/product.service.ts

import axios from 'axios';
// Import các hằng số đã định nghĩa
import { UNSPLASH_ACCESS_KEY, UNSPLASH_API_URL } from '../utils/constants'; 
// Import các kiểu dữ liệu đã định nghĩa (Sử dụng 'type' là thực hành tốt)
import type { Product, UnsplashPhoto } from '../types/product'; 


// (Optional) You can create an `api` axios instance in `src/services/api.ts`
// and import it here when you integrate a real backend. For now we use
// mock data in `getAllProducts` and call Unsplash directly via `axios`.


/**
 * 1. Hàm lấy tất cả sản phẩm từ Backend API
 * (Hiện tại là Dữ liệu giả lập - Mock Data)
 */
export const getAllProducts = async (): Promise<Product[]> => {
  try {
    // Dữ liệu giả lập (Mock Data)
    const mockProducts: Product[] = [
      { id: 'p1', name: 'Classic Automatic', brand: 'Rolex', model: 'R001', price: 15000000, oldPrice: 20000000, description: 'Đồng hồ cơ cổ điển.', features: ['Automatic', 'Waterproof 50m'], stock: 10, category: 'Men' },
      { id: 'p2', name: 'Lady Elegance', brand: 'Diamond D', model: 'D005', price: 8500000, oldPrice: 10000000, description: 'Thiết kế sang trọng cho nữ.', features: ['Quartz', 'Kim cương nhân tạo'], stock: 5, category: 'Women' },
      { id: 'p3', name: 'Sport Chrono', brand: 'Seiko', model: 'S123', price: 6200000, description: 'Đồng hồ thể thao Chronograph.', features: ['Chronograph', 'Stainless Steel'], stock: 20, category: 'Men' },
      { id: 'p4', name: 'Minimalist Quartz', brand: 'Epos', model: 'E555', price: 4500000, oldPrice: 5000000, description: 'Thiết kế tối giản, hiện đại.', features: ['Quartz', 'Dây da'], stock: 15, category: 'Unisex' },
      { id: 'p5', name: 'Adventure GMT', brand: 'Atlantic', model: 'A999', price: 12000000, description: 'Chức năng GMT cho người du lịch.', features: ['GMT', 'Dạ quang'], stock: 8, category: 'Men' },
      { id: 'p6', name: 'Rose Gold Slim', brand: 'Aries Gold', model: 'AG10', price: 7800000, oldPrice: 9500000, description: 'Mặt siêu mỏng, mạ vàng hồng.', features: ['Slim Design', 'Rose Gold PVD'], stock: 12, category: 'Women' },
      { id: 'p7', name: 'Pilot Watch', brand: 'Jacques Lemans', model: 'JL20', price: 9800000, description: 'Lấy cảm hứng từ đồng hồ phi công.', features: ['Luminous hands', '44mm Case'], stock: 7, category: 'Men' },
      { id: 'p8', name: 'Diver Pro', brand: 'Q&Q', model: 'QQ11', price: 3500000, oldPrice: 4000000, description: 'Chịu nước sâu, bezel xoay.', features: ['Waterproof 200m', 'Diver Bezel'], stock: 25, category: 'Unisex' },
      { id: 'p9', name: 'Moon Phase Elite', brand: 'Tissot', model: 'T400', price: 25000000, description: 'Chức năng lịch tuần trăng cao cấp.', features: ['Moon Phase', 'Sapphire Crystal'], stock: 3, category: 'Men' },
      { id: 'p10', name: 'Ceramic Chrono', brand: 'Rado', model: 'R900', price: 32000000, description: 'Vỏ và dây bằng Ceramic chống trầy.', features: ['Ceramic Case', 'Chronograph'], stock: 6, category: 'Men' },
      { id: 'p11', name: 'Simple Day/Date', brand: 'Citizen', model: 'C100', price: 4200000, description: 'Hiển thị ngày và thứ cơ bản.', features: ['Eco-Drive', 'Day/Date'], stock: 30, category: 'Unisex' },
      { id: 'p12', name: 'Square Deco', brand: 'Gucci', model: 'G777', price: 18000000, description: 'Mặt vuông phong cách Art Deco.', features: ['Fashion Watch', 'Square Case'], stock: 9, category: 'Women' },
    ];
    
    // Giả lập độ trễ mạng
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return mockProducts;

  } catch (error) {
    console.error("Error fetching products:", error);
    throw new Error("Failed to fetch product data from backend.");
  }
};


/**
 * 2. Hàm lấy ảnh đồng hồ từ Unsplash API
 * Sửa lỗi logic kiểm tra Key để đảm bảo Key hoạt động
 */
export const getUnsplashWatchPhotos = async (query: string, count: number = 10): Promise<UnsplashPhoto[]> => {
    // Nếu không có Access Key thì không gọi API
    if (!UNSPLASH_ACCESS_KEY) {
        console.warn("Unsplash Access Key chưa được cấu hình. Trả về mảng rỗng.");
        return [];
    }
    
    try {
        const response = await axios.get(`${UNSPLASH_API_URL}/search/photos`, {
            params: {
                query: `${query} watch`,
                per_page: count,
                client_id: UNSPLASH_ACCESS_KEY,
                orientation: 'squarish'
            }
        });

        console.log("Unsplash API fetched photos successfully:", response.data.results.length);
        return response.data.results as UnsplashPhoto[];

    } catch (error) {
        console.error("Error fetching photos from Unsplash:", error);
        // Cảnh báo nếu gặp lỗi 401 (Unauth)
        if (axios.isAxiosError(error) && error.response?.status === 401) {
            console.error("LỖI 401: Unsplash Access Key có thể sai hoặc tài khoản chưa được xác nhận email.");
        }
        return [];
    }
};