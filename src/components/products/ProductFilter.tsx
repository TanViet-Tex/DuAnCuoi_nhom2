// src/components/products/ProductFilter.tsx

import React from 'react';
import { ChevronDown, Search } from 'lucide-react';
import { useProducts } from "../../hooks/useProducts";

const brands = ['Rolex', 'Atlantic', 'Epos', 'Diamond D', 'Orient', 'Seiko'];

const priceRanges = [
  { label: 'Dưới 5 triệu', value: "under5" },
  { label: '5 - 10 triệu', value: "5to10" },
  { label: 'Trên 10 triệu', value: "above10" },
];

const genders = ['Nam', 'Nữ', 'Unisex'];

export default function ProductFilter() {
  const { filters, setFilters } = useProducts();

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-100">
      <h3 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2">Bộ Lọc</h3>
      
      {/* Search */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-2">Tìm kiếm</label>
        <div className="relative">
          <input 
            type="text" 
            placeholder="Nhập tên sản phẩm..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-yellow-500 focus:border-yellow-500"
          />
          <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      {/* Brand */}
      <div className="mb-6 border-b pb-4">
        <h4 className="text-md font-semibold text-gray-800 flex justify-between items-center cursor-pointer">
            Thương hiệu <ChevronDown size={16} />
        </h4>
        <div className="mt-2 space-y-2">
          <div className="flex items-center">
            <input
              type="radio"
              name="brand"
              checked={filters.brand === "all"}
              onChange={() => setFilters({ ...filters, brand: "all" })}
            />
            <label className="ml-2 text-sm text-gray-600">Tất cả</label>
          </div>

          {brands.map(brand => (
            <div key={brand} className="flex items-center">
              <input 
                type="radio"
                name="brand"
                checked={filters.brand === brand}
                onChange={() => setFilters({ ...filters, brand })}
                className="h-4 w-4"
              />
              <label className="ml-2 text-sm text-gray-600">{brand}</label>
            </div>
          ))}
        </div>
      </div>

      {/* Price */}
      <div className="mb-6 border-b pb-4">
        <h4 className="text-md font-semibold text-gray-800 flex justify-between items-center cursor-pointer">
            Khoảng Giá <ChevronDown size={16} />
        </h4>
        <div className="mt-2 space-y-2">
          <div className="flex items-center">
            <input
              type="radio"
              name="price"
              checked={filters.price === "all"}
              onChange={() => setFilters({ ...filters, price: "all" })}
            />
            <label className="ml-2">Tất cả</label>
          </div>

          {priceRanges.map((range) => (
            <div key={range.value} className="flex items-center">
              <input 
                type="radio"
                name="price"
                checked={filters.price === range.value}
                onChange={() => setFilters({ ...filters, price: range.value })}
              />
              <label className="ml-2 text-sm">{range.label}</label>
            </div>
          ))}
        </div>
      </div>

      {/* Gender */}
      <div>
        <h4 className="text-md font-semibold text-gray-800 flex justify-between items-center cursor-pointer">
            Giới tính <ChevronDown size={16} />
        </h4>
        <div className="mt-2 space-y-2">

          <div className="flex items-center">
            <input
              type="radio"
              name="gender"
              checked={filters.gender === "all"}
              onChange={() => setFilters({ ...filters, gender: "all" })}
            />
            <label className="ml-2">Tất cả</label>
          </div>

          {genders.map((g) => (
            <div key={g} className="flex items-center">
              <input
                type="radio"
                name="gender"
                checked={filters.gender === g}
                onChange={() => setFilters({ ...filters, gender: g })}
              />
              <label className="ml-2">{g}</label>
            </div>
          ))}

        </div>
      </div>
    </div>
  );
}
