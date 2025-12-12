// src/pages/Products.tsx

import React from "react";
import { Home, ChevronRight, ListOrdered } from "lucide-react";
import ProductFilter from "../components/products/ProductFilter";
import ProductCard from "../components/products/ProductCard";
import { useProducts } from "../hooks/useProducts";

export default function Products() {
  const { products, loading, filters, setFilters } = useProducts();

  // APPLY FILTER
  let filtered = products.filter((p) => {
    let brandMatch = filters.brand === "all" || p.brand === filters.brand;

    let priceMatch = true;
    if (filters.price === "under500") priceMatch = p.price < 500;
    if (filters.price === "500to2000")
      priceMatch = p.price >= 500 && p.price <= 2000;
    if (filters.price === "above2000") priceMatch = p.price > 2000;

    return brandMatch && priceMatch;
  });

  // APPLY SORT
  if (filters.sort === "priceAsc") {
    filtered.sort((a, b) => a.price - b.price);
  }
  if (filters.sort === "priceDesc") {
    filtered.sort((a, b) => b.price - a.price);
  }
  if (filters.sort === "nameAsc") {
    filtered.sort((a, b) => a.name.localeCompare(b.name));
  }
  if (filters.sort === "nameDesc") {
    filtered.sort((a, b) => b.name.localeCompare(a.name));
  }

  // PAGINATION
  const ITEMS_PER_PAGE = 8;
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const startIdx = (filters.page - 1) * ITEMS_PER_PAGE;
  const paginatedProducts = filtered.slice(startIdx, startIdx + ITEMS_PER_PAGE);

  const changePage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setFilters({ ...filters, page });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Đang tải sản phẩm...
      </div>
    );
  }

  return (
    <div className="bg-gray-50 pt-20">
      <div className="container mx-auto px-4 md:px-8 py-8">
        
        {/* Breadcrumb */}
        <div className="mb-6">
          <div className="flex items-center text-sm text-gray-500 space-x-2 mb-2">
            <Home size={16} className="text-gray-400" />
            <ChevronRight size={16} />
            <span>Đồng hồ</span>
          </div>
          <h1 className="text-4xl font-extrabold text-gray-800">
            Tất Cả Sản Phẩm
          </h1>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Bộ lọc */}
          <div className="md:w-1/4">
            <ProductFilter />
          </div>

          {/* Sản phẩm */}
          <div className="md:w-3/4">

            {/* Sort + Count */}
            <div className="flex justify-between items-center mb-6 p-3 bg-white rounded-lg shadow-sm border">
              <span className="text-gray-600 text-sm font-medium">
                Hiển thị {filtered.length} kết quả
              </span>

              <div className="flex items-center space-x-2">
                <ListOrdered size={18} className="text-gray-500" />
                
                <select
                  value={filters.sort}
                  onChange={(e) =>
                    setFilters({ ...filters, sort: e.target.value })
                  }
                  className="border border-gray-300 rounded-lg text-sm py-1.5 focus:ring-yellow-500 focus:border-yellow-500"
                >
                  <option value="none">Sắp xếp theo</option>
                  <option value="priceAsc">Giá: Thấp → Cao</option>
                  <option value="priceDesc">Giá: Cao → Thấp</option>
                  <option value="nameAsc">Tên: A → Z</option>
                  <option value="nameDesc">Tên: Z → A</option>
                </select>
              </div>
            </div>

            {/* Product List */}
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {paginatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center mt-10 space-x-2">
              <button
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-200"
                onClick={() => changePage(filters.page - 1)}
                disabled={filters.page === 1}
              >
                Trước
              </button>

              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  className={`px-4 py-2 rounded-lg ${
                    filters.page === i + 1
                      ? "bg-yellow-600 text-white"
                      : "border border-gray-300 text-gray-700 hover:bg-gray-200"
                  }`}
                  onClick={() => changePage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}

              <button
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-200"
                onClick={() => changePage(filters.page + 1)}
                disabled={filters.page === totalPages}
              >
                Sau
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
