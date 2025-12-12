// src/routes/index.tsx

import React from 'react';
// Import các component Home đã tạo
import Banner from '../components/home/Banner'; 
import BrandSection from '../components/home/BrandSection';
import ProductSection from '../components/home/ProductSection';
// Import hook lấy dữ liệu sản phẩm và gán ảnh Unsplash
import { useProducts } from '../hooks/useProducts'; 
// Giả định bạn đã tạo Spinner.tsx trong components/common/
import Spinner from '../components/common/Spinner'; 

const HomeRoute: React.FC = () => {
  // Lấy 3 trạng thái từ hook
  const { products, loading, error } = useProducts(); 
  
  // 1. Xử lý trạng thái Đang tải (Loading)
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen pt-16">
        {/* Thay thế bằng component Spinner.tsx nếu bạn đã tạo */}
        <p className="text-xl text-gray-600">Đang tải dữ liệu sản phẩm...</p>
        {/* <Spinner /> */}
      </div>
    );
  }

  // 2. Xử lý trạng thái Lỗi (Error)
  if (error) {
    return (
      <div className="text-center bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mx-auto my-10 max-w-lg">
        <strong className="font-bold">Lỗi tải dữ liệu!</strong>
        <span className="block sm:inline"> {error}</span>
        <p className="text-sm mt-2">Vui lòng kiểm tra Unsplash Access Key và kết nối mạng.</p>
      </div>
    );
  }

  // 3. Xử lý trạng thái Dữ liệu sẵn sàng
  return (
    <div className="home-page pt-16 md:pt-20 bg-gray-50">
      
      {/* 1. Banner Quảng cáo (Không phụ thuộc vào products) */}
      <Banner />

      {/* 2. Danh sách Thương hiệu (Không phụ thuộc vào products) */}
      <BrandSection />

      {/* 3. Section Sản phẩm đang giảm giá (Phụ thuộc vào products) */}
      {products && products.length > 0 && (
        <ProductSection 
          title="ĐỒNG HỒ ĐANG GIẢM GIÁ" 
          products={products.slice(0, 8)} // Chỉ hiển thị 8 sản phẩm đầu
        />
      )}
      
      {/* Thêm Section BỘ SƯU TẬP MỚI nếu có đủ dữ liệu */}
      {products && products.length > 8 && (
        <ProductSection 
          title="BỘ SƯU TẬP MỚI" 
          products={products.slice(8, 12)} // 4 sản phẩm tiếp theo
        />
      )}
      
      {products.length === 0 && (
        <div className="text-center py-10 text-gray-500">
            Không tìm thấy sản phẩm nào.
        </div>
      )}
    </div>
  );
};

export default HomeRoute;