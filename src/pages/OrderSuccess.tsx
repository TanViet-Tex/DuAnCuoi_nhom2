// src/pages/OrderSuccess.tsx

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle, Package, Home, FileText, Truck, MapPin, Phone } from 'lucide-react';

interface CartItem {
  id: string;
  name: string;
  brand: string;
  price: number;
  imageUrl: string;
  quantity: number;
}

interface Order {
  id: string;
  items: CartItem[];
  customer: {
    fullName: string;
    phone: string;
    email: string;
    address: string;
    city: string;
    district: string;
    ward: string;
    notes: string;
  };
  paymentMethod: string;
  totalAmount: number;
  orderDate: string;
  status: string;
}

const OrderSuccess: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    // Get order from location state
    const stateOrder = location.state?.order as Order;
    if (stateOrder) {
      setOrder(stateOrder);
    } else {
      // Fallback: try to get last order from localStorage
      const userOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      if (userOrders.length > 0) {
        setOrder(userOrders[userOrders.length - 1]);
      }
    }
  }, [location.state]);

  if (!order) {
    return (
      <div className="bg-gray-50 pt-20 min-h-screen">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8 text-center">
            <p className="text-gray-600 mb-8">Đang tải thông tin đơn hàng...</p>
            <button 
              onClick={() => navigate('/')}
              className="flex items-center justify-center gap-2 bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 mx-auto"
            >
              <Home size={20} />
              Về trang chủ
            </button>
          </div>
        </div>
      </div>
    );
  }

  const shippingFee = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0) >= 1000000 ? 0 : 30000;
  const paymentMethodLabel = order.paymentMethod === 'cod' ? 'Thanh toán khi nhận hàng (COD)' : 'Chuyển khoản ngân hàng';

  return (
    <div className="bg-gray-50 pt-20 min-h-screen">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8 md:p-12">
          
          {/* Success Icon */}
          <div className="mb-6 text-center">
            <CheckCircle size={80} className="mx-auto text-green-500 mb-4" />
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
              Đặt hàng thành công!
            </h1>
            <p className="text-gray-600">
              Cảm ơn bạn đã tin tưởng và đặt hàng tại cửa hàng chúng tôi
            </p>
          </div>

          {/* Order ID */}
          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-6 mb-8 text-center">
            <p className="text-sm text-gray-600 mb-2">Mã đơn hàng của bạn:</p>
            <p className="text-3xl font-bold text-yellow-700 font-mono">{order.id}</p>
            <p className="text-xs text-gray-500 mt-2">
              {new Date(order.orderDate).toLocaleString('vi-VN')}
            </p>
          </div>

          {/* Order Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            
            {/* Customer Info */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Phone size={20} className="text-yellow-600" />
                Thông tin khách hàng
              </h3>
              <div className="space-y-2 text-sm text-gray-700">
                <p><strong>Họ và tên:</strong> {order.customer.fullName}</p>
                <p><strong>Số điện thoại:</strong> {order.customer.phone}</p>
                <p><strong>Email:</strong> {order.customer.email}</p>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <MapPin size={20} className="text-yellow-600" />
                Địa chỉ giao hàng
              </h3>
              <div className="space-y-1 text-sm text-gray-700">
                <p>{order.customer.address}</p>
                <p>
                  {order.customer.ward && `${order.customer.ward}, `}
                  {order.customer.district && `${order.customer.district}, `}
                  {order.customer.city}
                </p>
                {order.customer.notes && (
                  <p className="mt-2 italic text-gray-600">
                    Ghi chú: {order.customer.notes}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Package size={20} className="text-yellow-600" />
              Chi tiết sản phẩm ({order.items.length} sản phẩm)
            </h3>
            
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {order.items.map((item, idx) => (
                <div key={item.id} className="flex gap-4 pb-3 border-b last:border-0">
                  <img 
                    src={item.imageUrl} 
                    alt={item.name} 
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">{item.name}</p>
                    <p className="text-sm text-gray-500">{item.brand}</p>
                    <p className="text-sm font-bold text-red-600 mt-2">
                      {item.price.toLocaleString('vi-VN')} VNĐ × {item.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-800">
                      {(item.price * item.quantity).toLocaleString('vi-VN')} VNĐ
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Price Summary */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <div className="space-y-3">
              <div className="flex justify-between text-gray-600">
                <span>Tạm tính:</span>
                <span className="font-semibold">
                  {order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0).toLocaleString('vi-VN')} VNĐ
                </span>
              </div>
              
              <div className="flex justify-between text-gray-600">
                <span>Phí vận chuyển:</span>
                <span className="font-semibold">
                  {shippingFee === 0 ? (
                    <span className="text-green-600">Miễn phí</span>
                  ) : (
                    `${shippingFee.toLocaleString('vi-VN')} VNĐ`
                  )}
                </span>
              </div>

              <div className="flex justify-between text-gray-600">
                <span>Phương thức thanh toán:</span>
                <span className="font-semibold">{paymentMethodLabel}</span>
              </div>
            </div>

            <div className="border-t mt-4 pt-4">
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Tổng cộng:</span>
                <span className="text-red-600 text-2xl">
                  {order.totalAmount.toLocaleString('vi-VN')} VNĐ
                </span>
              </div>
            </div>
          </div>

          {/* Status Info */}
          <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-6 mb-8">
            <h3 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
              <Truck size={20} />
              Tiếp theo
            </h3>
            <ul className="space-y-2 text-sm text-blue-900">
              <li>✓ Chúng tôi đã gửi email xác nhận đơn hàng</li>
              <li>✓ Đơn hàng sẽ được xử lý trong vòng 24 giờ</li>
              <li>✓ Thời gian giao hàng dự kiến: 3-5 ngày làm việc</li>
              <li>✓ Bạn có thể theo dõi đơn hàng trong mục "Đơn hàng của tôi"</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => navigate('/profile/orders')}
              className="flex items-center justify-center gap-2 bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300"
            >
              <FileText size={20} />
              Xem đơn hàng của tôi
            </button>
            
            <button 
              onClick={() => navigate('/')}
              className="flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-800 font-bold py-3 px-6 rounded-lg border-2 border-gray-300 transition-all duration-300"
            >
              <Home size={20} />
              Tiếp tục mua sắm
            </button>
          </div>

          {/* Support Info */}
          <div className="mt-8 pt-8 border-t text-center">
            <p className="text-sm text-gray-600 mb-2">
              Nếu có thắc mắc, vui lòng liên hệ:
            </p>
            <p className="font-semibold text-gray-800">
              Hotline: <a href="tel:1900xxxx" className="text-yellow-600 hover:underline">1900 xxxx</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;