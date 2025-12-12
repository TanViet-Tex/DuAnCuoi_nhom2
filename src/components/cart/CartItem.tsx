// src/components/cart/CartItem.tsx

import React from 'react';
// Import kiểu dữ liệu của sản phẩm nếu cần thiết
// import type { Product } from '../../types/product'; 

// Định nghĩa props cho component
interface CartItemProps {
  // Giả định bạn truyền vào các thuộc tính cơ bản của sản phẩm và số lượng
  item: {
    id: string;
    name: string;
    imageUrl: string;
    price: number; // Giá hiện tại
    quantity: number;
  };
  onRemove: (id: string) => void;
  onUpdateQuantity: (id: string, newQuantity: number) => void;
}

const CartItem: React.FC<CartItemProps> = ({ item, onRemove, onUpdateQuantity }) => {
  
  // Hàm xử lý thay đổi số lượng
  const handleQuantityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newQuantity = parseInt(e.target.value, 10);
    onUpdateQuantity(item.id, newQuantity);
  };

  // Định dạng tiền tệ sang VND
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  return (
    <div className="flex items-center p-4 border-b border-gray-200 bg-white hover:bg-gray-50 transition duration-150">
      
      {/* Ảnh Sản Phẩm */}
      <div className="w-20 h-20 flex-shrink-0 mr-4">
        <img
          src={item.imageUrl}
          alt={item.name}
          className="w-full h-full object-cover rounded-md shadow-sm"
        />
      </div>

      {/* Chi tiết Sản Phẩm */}
      <div className="flex-grow">
        <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
        <p className="text-gray-600">Giá: {formatCurrency(item.price)}</p>
        <p className="text-sm text-gray-500">Mã sản phẩm: {item.id}</p>
      </div>

      {/* Điều chỉnh Số lượng */}
      <div className="flex items-center mx-4">
        <label htmlFor={`quantity-${item.id}`} className="sr-only">Số lượng</label>
        <select
          id={`quantity-${item.id}`}
          value={item.quantity}
          onChange={handleQuantityChange}
          className="w-16 p-2 border border-gray-300 rounded-md shadow-sm text-gray-800 focus:ring-amber-500 focus:border-amber-500"
        >
          {/* Tùy chọn số lượng từ 1 đến 10 */}
          {[...Array(10)].map((_, i) => (
            <option key={i + 1} value={i + 1}>
              {i + 1}
            </option>
          ))}
        </select>
      </div>

      {/* Tổng tiền và Nút Xóa */}
      <div className="text-right flex flex-col items-end">
        <p className="text-lg font-bold text-amber-600 mb-2">
          {formatCurrency(item.price * item.quantity)}
        </p>
        <button
          onClick={() => onRemove(item.id)}
          className="text-sm text-red-500 hover:text-red-700 transition"
        >
          Xóa
        </button>
      </div>
    </div>
  );
};

export default CartItem;