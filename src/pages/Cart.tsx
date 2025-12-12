// src/pages/Cart.tsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from 'lucide-react';

interface CartItem {
  id: string;
  name: string;
  brand: string;
  price: number;
  imageUrl: string;
  quantity: number;
  stock: number;
}

const Cart: React.FC = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const loadCart = () => {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      setCartItems(cart);
    };
    loadCart();
    
    // Lắng nghe sự kiện storage để cập nhật khi có thay đổi
    window.addEventListener('storage', loadCart);
    return () => window.removeEventListener('storage', loadCart);
  }, []);

  const updateCart = (updatedCart: CartItem[]) => {
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const updateQuantity = (id: string, newQuantity: number) => {
    const updatedCart = cartItems.map(item => 
      item.id === id ? { ...item, quantity: Math.max(1, Math.min(item.stock, newQuantity)) } : item
    );
    updateCart(updatedCart);
  };

  const removeItem = (id: string) => {
    if (confirm('Bạn có chắc muốn xóa sản phẩm này?')) {
      const updatedCart = cartItems.filter(item => item.id !== id);
      updateCart(updatedCart);
    }
  };

  const clearCart = () => {
    if (confirm('Bạn có chắc muốn xóa toàn bộ giỏ hàng?')) {
      updateCart([]);
    }
  };

  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const shippingFee = totalPrice >= 1000000 ? 0 : 30000;
  const finalTotal = totalPrice + shippingFee;

  if (cartItems.length === 0) {
    return (
      <div className="bg-gray-50 pt-20 min-h-screen">
        <div className="container mx-auto px-4 py-16 text-center">
          <ShoppingBag size={80} className="mx-auto text-gray-300 mb-6" />
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Giỏ hàng trống</h2>
          <p className="text-gray-600 mb-8">Hãy thêm sản phẩm vào giỏ hàng để tiếp tục mua sắm</p>
          <button 
            onClick={() => navigate('/products')}
            className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300"
          >
            Khám phá sản phẩm
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 pt-20 min-h-screen">
      <div className="container mx-auto px-4 md:px-8 py-8">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Giỏ hàng</h1>
            <p className="text-gray-600 mt-2">Bạn có {totalItems} sản phẩm trong giỏ hàng</p>
          </div>
          <button 
            onClick={() => navigate('/products')}
            className="flex items-center gap-2 text-yellow-600 hover:text-yellow-700 font-semibold"
          >
            <ArrowLeft size={20} />
            <span className="hidden sm:inline">Tiếp tục mua sắm</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map(item => (
              <div key={item.id} className="bg-white rounded-xl shadow-lg p-4 md:p-6 flex flex-col sm:flex-row gap-4 hover:shadow-xl transition-shadow">
                
                {/* Image */}
                <img 
                  src={item.imageUrl} 
                  alt={item.name}
                  className="w-full sm:w-32 h-32 object-cover rounded-lg cursor-pointer"
                  onClick={() => navigate(`/product/${item.id}`)}
                />

                {/* Info */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-semibold">{item.brand}</p>
                    <h3 
                      className="text-lg font-bold text-gray-800 hover:text-yellow-600 cursor-pointer"
                      onClick={() => navigate(`/product/${item.id}`)}
                    >
                      {item.name}
                    </h3>
                    <p className="text-xl font-bold text-red-600 mt-2">
                      {item.price.toLocaleString('vi-VN')} VNĐ
                    </p>
                  </div>

                  {/* Quantity & Actions */}
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center border border-gray-300 rounded-lg">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-2 hover:bg-gray-100 transition"
                        disabled={item.quantity <= 1}
                      >
                        <Minus size={16} />
                      </button>
                      <span className="px-4 py-1 font-semibold">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-2 hover:bg-gray-100 transition"
                        disabled={item.quantity >= item.stock}
                      >
                        <Plus size={16} />
                      </button>
                    </div>

                    <button 
                      onClick={() => removeItem(item.id)}
                      className="text-red-600 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>

                {/* Subtotal (Desktop) */}
                <div className="hidden sm:flex flex-col items-end justify-between">
                  <p className="text-sm text-gray-500">Tổng phụ</p>
                  <p className="text-xl font-bold text-gray-800">
                    {(item.price * item.quantity).toLocaleString('vi-VN')} VNĐ
                  </p>
                </div>
              </div>
            ))}

            {/* Clear Cart Button */}
            <button 
              onClick={clearCart}
              className="w-full bg-red-50 hover:bg-red-100 text-red-600 font-semibold py-3 rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Trash2 size={18} />
              Xóa toàn bộ giỏ hàng
            </button>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4">Tóm tắt đơn hàng</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Tạm tính ({totalItems} sản phẩm)</span>
                  <span className="font-semibold">{totalPrice.toLocaleString('vi-VN')} VNĐ</span>
                </div>
                
                <div className="flex justify-between text-gray-600">
                  <span>Phí vận chuyển</span>
                  <span className="font-semibold">
                    {shippingFee === 0 ? (
                      <span className="text-green-600">Miễn phí</span>
                    ) : (
                      `${shippingFee.toLocaleString('vi-VN')} VNĐ`
                    )}
                  </span>
                </div>

                {totalPrice < 1000000 && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800">
                    💡 Thêm {(1000000 - totalPrice).toLocaleString('vi-VN')} VNĐ để được miễn phí vận chuyển
                  </div>
                )}
              </div>

              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between items-center text-xl font-bold">
                  <span>Tổng cộng</span>
                  <span className="text-red-600">{finalTotal.toLocaleString('vi-VN')} VNĐ</span>
                </div>
              </div>

              <button 
                onClick={() => navigate('/checkout')}
                className="w-full bg-yellow-600 hover:bg-yellow-700 text-black font-bold py-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Tiến hành thanh toán
              </button>

              <div className="mt-6 space-y-3 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <span className="text-green-600">✓</span>
                  <span>Bảo hành chính hãng 2 năm</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-600">✓</span>
                  <span>Đổi trả trong 7 ngày</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-600">✓</span>
                  <span>Thanh toán an toàn 100%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;