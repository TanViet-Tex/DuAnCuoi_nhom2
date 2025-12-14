// src/components/home/ProductSection.tsx

import React from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../products/ProductCard'; // Import ProductCard từ thư mục products/

interface ProductSectionProps {
  title: string;
  // Giả định kiểu dữ liệu ProductWithImage đã được định nghĩa
  products: any[]; 
}

const ProductSection: React.FC<ProductSectionProps> = ({ title, products }) => {
  return (
    <section className="container mx-auto py-12 px-4 md:px-8">
      <h2 className="text-3xl font-extrabold text-center mb-10 text-gray-800 border-b-2 border-yellow-500 pb-2 inline-block mx-auto">
        {title}
      </h2>
      
      {/* Grid hiển thị sản phẩm */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          // Đảm bảo ProductCard.tsx đã được tạo
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      
      <div className="text-center mt-10">
        <Link to="/products" className="inline-block bg-white hover:bg-gray-100 text-gray-800 font-bold py-3 px-10 rounded-full transition duration-300 shadow-md border border-gray-300">
          Xem tất cả đồng hồ
        </Link>
      </div>
    </section>
  );
};

export default ProductSection;