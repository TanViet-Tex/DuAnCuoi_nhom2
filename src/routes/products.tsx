// src/routes/products.tsx

import React from 'react';
import { Home, ChevronRight, ListOrdered } from 'lucide-react';
import ProductFilter from '../components/products/ProductFilter';
import ProductCard from '../components/products/ProductCard';
import { useProducts } from '../hooks/useProducts'; // Import hook đã có sẵn

const ProductsRoute: React.FC = () => {
  const { products, loading, filters, setFilters } = useProducts();

  // Apply same filtering logic as Products page
  const filtered = products.filter((p) => {
    const brandMatch = filters.brand === 'all' || p.brand === filters.brand;
    const search = (filters.search || '').toString().toLowerCase();
    const searchMatch = !search || p.name.toLowerCase().includes(search) || p.brand.toLowerCase().includes(search);
    let priceMatch = true;
    if (filters.price === 'under5') priceMatch = p.price < 5_000_000;
    if (filters.price === '5to10') priceMatch = p.price >= 5_000_000 && p.price <= 10_000_000;
    if (filters.price === 'above10') priceMatch = p.price > 10_000_000;
    let genderMatch = true;
    if (filters.gender && filters.gender !== 'all') {
      const g = filters.gender.toLowerCase();
      genderMatch = p.category && p.category.toLowerCase().includes(g);
    }
    return brandMatch && priceMatch && genderMatch && searchMatch;
  });
  const productCount = filtered.length;

  if (loading) {
    // Hiển thị Spinner khi đang tải dữ liệu
    return <div className="flex justify-center items-center h-screen">Đang tải sản phẩm...</div>; 
  }

  return (
    <div className="bg-gray-50 pt-20">
      <div className="container mx-auto px-4 md:px-8 py-8">
        
        {/* Breadcrumb và Tiêu đề */}
        <div className="mb-6">
          <div className="flex items-center text-sm text-gray-500 space-x-2 mb-2">
            <Home size={16} className="text-gray-400" />
            <ChevronRight size={16} />
            <span>Đồng hồ</span>
          </div>
          <h1 className="text-4xl font-extrabold text-gray-800">Tất Cả Sản Phẩm</h1>
        </div>

        {/* Layout Chính: Sidebar (Bộ lọc) và Nội dung (Sản phẩm) */}
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Cột 1: Bộ lọc (Sidebar) */}
          <div className="md:w-1/4">
            <ProductFilter filters={filters} setFilters={setFilters} />
          </div>

          {/* Cột 2: Danh sách Sản phẩm */}
          <div className="md:w-3/4">
            
            {/* Thanh sắp xếp và đếm số lượng */}
            <div className="flex justify-between items-center mb-6 p-3 bg-white rounded-lg shadow-sm border">
              <span className="text-gray-600 text-sm font-medium">
                Hiển thị {productCount} kết quả
              </span>
              <div className="flex items-center space-x-2">
                <ListOrdered size={18} className="text-gray-500" />
                <select className="border border-gray-300 rounded-lg text-sm py-1.5 focus:ring-yellow-500 focus:border-yellow-500">
                  <option>Sắp xếp theo</option>
                  <option>Giá: Thấp đến Cao</option>
                  <option>Giá: Cao đến Thấp</option>
                  <option>Mới nhất</option>
                </select>
              </div>
            </div>
            
            {/* Grid hiển thị Product Card */}
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filtered.map((product) => (
                // ProductCard đã được chỉnh sửa để hiển thị ảnh từ API
                <ProductCard key={product.id} product={product} /> 
              ))}
            </div>

            {/* Phân trang */}
            <div className="flex justify-center mt-10 space-x-2">
              <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-200">Trước</button>
              <button className="px-4 py-2 bg-yellow-600 text-white rounded-lg">1</button>
              <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-200">2</button>
              <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-200">3</button>
              <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-200">Sau</button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsRoute;