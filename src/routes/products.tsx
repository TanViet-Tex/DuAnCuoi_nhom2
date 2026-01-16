// src/routes/products.tsx

import React, { useMemo } from "react";
import { Home, ChevronRight, ListOrdered } from "lucide-react";
import { useSearchParams } from "react-router-dom";

import ProductFilter from "../components/products/ProductFilter";
import ProductCard from "../components/products/ProductCard";
import { useProducts } from "../hooks/useProducts";

const ProductsRoute: React.FC = () => {
  const { products, loading, filters, setFilters } = useProducts();
  const [searchParams] = useSearchParams();

  // 🔍 Search từ URL (Navbar Enter)
  const keyword = (searchParams.get("search") || "").toLowerCase();

  // 🎯 FILTER LOGIC (chuẩn, gọn, dễ debug)
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Brand
      const brandMatch =
        filters.brand === "all" || p.brand === filters.brand;

      // Search (Navbar + Filter search)
      const filterSearch = (filters.search || "").toLowerCase();
      const searchText = keyword || filterSearch;

      const searchMatch =
        !searchText ||
        p.name.toLowerCase().includes(searchText) ||
        p.brand.toLowerCase().includes(searchText);

      // Price
      let priceMatch = true;
      if (filters.price === "under5") priceMatch = p.price < 5_000_000;
      if (filters.price === "5to10")
        priceMatch = p.price >= 5_000_000 && p.price <= 10_000_000;
      if (filters.price === "above10") priceMatch = p.price > 10_000_000;

      // Gender
      let genderMatch = true;
      if (filters.gender && filters.gender !== "all") {
        genderMatch =
          p.category &&
          p.category.toLowerCase().includes(filters.gender.toLowerCase());
      }

      return brandMatch && priceMatch && genderMatch && searchMatch;
    });
  }, [products, filters, keyword]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-500">
        Đang tải sản phẩm...
      </div>
    );
  }

  return (
    <div className="bg-gray-50 pt-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">

        {/* Breadcrumb */}
        <div className="mb-6">
          <div className="flex items-center text-sm text-gray-500 gap-2 mb-2">
            <Home size={16} />
            <ChevronRight size={16} />
            <span>Đồng hồ</span>
          </div>
          <h1 className="text-4xl font-extrabold text-gray-800">
            Tất Cả Sản Phẩm
          </h1>

          {keyword && (
            <p className="mt-2 text-gray-600">
              Kết quả tìm kiếm cho: <b>{keyword}</b>
            </p>
          )}
        </div>

        {/* Layout */}
        <div className="flex flex-col md:flex-row gap-8">

          {/* Sidebar */}
          <aside className="md:w-1/4">
            <ProductFilter filters={filters} setFilters={setFilters} />
          </aside>

          {/* Products */}
          <section className="md:w-3/4">

            {/* Top bar */}
            <div className="flex justify-between items-center mb-6 p-3 bg-white rounded-lg shadow-sm border">
              <span className="text-gray-600 text-sm font-medium">
                Hiển thị {filteredProducts.length} kết quả
              </span>

              <div className="flex items-center gap-2">
                <ListOrdered size={18} className="text-gray-500" />
                <select className="border border-gray-300 rounded-lg text-sm py-1.5 px-2 focus:ring-yellow-500 focus:border-yellow-500">
                  <option>Sắp xếp theo</option>
                  <option>Giá: Thấp → Cao</option>
                  <option>Giá: Cao → Thấp</option>
                  <option>Mới nhất</option>
                </select>
              </div>
            </div>

            {/* Grid */}
            {filteredProducts.length === 0 ? (
              <div className="text-center text-gray-500 py-20">
                Không tìm thấy sản phẩm phù hợp
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}

            {/* Pagination (UI) */}
            <div className="flex justify-center mt-10 gap-2">
              <button className="px-4 py-2 border rounded-lg hover:bg-gray-200">
                Trước
              </button>
              <button className="px-4 py-2 bg-yellow-600 text-white rounded-lg">
                1
              </button>
              <button className="px-4 py-2 border rounded-lg hover:bg-gray-200">
                2
              </button>
              <button className="px-4 py-2 border rounded-lg hover:bg-gray-200">
                Sau
              </button>
            </div>

          </section>
        </div>
      </div>
    </div>
  );
};

export default ProductsRoute;
