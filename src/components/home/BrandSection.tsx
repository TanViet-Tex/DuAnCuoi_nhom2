// src/components/home/BrandSection.tsx

import React from 'react';

const brands = [
  { name: 'Atlantic', slug: 'atlantic' },
  { name: 'Diamond D', slug: 'diamond' },
  { name: 'Jacques Lemans', slug: 'jacques' },
  { name: 'Aries Gold', slug: 'aries' },
  { name: 'Epos', slug: 'epos' },
  { name: 'Q&Q', slug: 'qq' },
];

const BrandSection: React.FC = () => {
  return (
    <div className="container mx-auto py-12 px-4 md:px-8">
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">CÁC THƯƠNG HIỆU NỔI BẬT</h2>
      <div className="flex flex-wrap justify-center gap-4">
        {brands.map((brand) => (
          <a
            key={brand.slug}
            href={`/products?brand=${brand.slug}`}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-200 transition duration-200 text-sm font-medium shadow-sm"
          >
            {brand.name}
          </a>
        ))}
      </div>
    </div>
  );
};

export default BrandSection;