// src/components/products/ProductCard.tsx - RESPONSIVE VERSION

import React from 'react';
import { useNavigate } from 'react-router-dom';

interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  oldPrice?: number;
  imageUrl: string;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const navigate = useNavigate();
  
  const discountPercentage = product.oldPrice 
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0;

  return (
    <div 
      onClick={() => navigate(`/product/${product.id}`)}
      className="bg-white rounded-lg md:rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
    >
      
      {/* Image Container */}
      <div className="relative overflow-hidden aspect-square">
        <img
          src={product.imageUrl} 
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" 
          loading="lazy"
          onError={(e) => { 
            const target = e.target as HTMLImageElement;
            target.src = 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=400';
          }}
        />
        
        {/* Discount Badge */}
        {discountPercentage > 0 && (
          <span className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 md:px-3 md:py-1 rounded-full shadow-md">
            -{discountPercentage}%
          </span>
        )}
      </div>

      {/* Product Info */}
      <div className="p-3 md:p-4">
        {/* Brand */}
        <p className="text-xs text-gray-500 uppercase font-semibold tracking-wide truncate">
          {product.brand}
        </p>
        
        {/* Product Name - Responsive text size */}
        <h3 className="text-sm md:text-base lg:text-lg font-bold text-gray-800 hover:text-yellow-600 transition-colors duration-200 mt-1 line-clamp-2 min-h-[2.5rem] md:min-h-[3rem]">
          {product.name}
        </h3>
        
        {/* Price Section */}
        <div className="mt-2 md:mt-3">
          {/* New Price */}
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="text-base md:text-lg lg:text-xl font-extrabold text-red-600">
              {product.price.toLocaleString('vi-VN')}₫
            </span>
            
            {/* Old Price */}
            {product.oldPrice && (
              <span className="text-xs md:text-sm text-gray-400 line-through">
                {product.oldPrice.toLocaleString('vi-VN')}₫
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;