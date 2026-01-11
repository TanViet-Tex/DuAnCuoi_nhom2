// src/pages/OrderSuccess.tsx

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { CheckCircle, Package, Home, FileText, Truck, MapPin, Phone, AlertCircle, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface OrderItem {
  productId: string;
  name: string;
  brand: string;
  price: number;
  imageUrl: string;
  quantity: number;
}

interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status: string;
  shippingAddress: string;
  phone: string;
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
  cancellationReason?: string;
  cancelledAt?: string;
}

const OrderSuccess: React.FC = () => {
  const navigate = useNavigate();
  const { orderId } = useParams<{ orderId: string }>();
  const { user } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        
        // Try to get from sessionStorage first (stored during checkout)
        const lastOrderStr = sessionStorage.getItem('lastOrder');
        if (lastOrderStr) {
          const lastOrder = JSON.parse(lastOrderStr);
          setOrder(lastOrder);
          setLoading(false);
          return;
        }

        // If orderId in URL, fetch from API
        if (orderId) {
          const API = (import.meta as any).env?.VITE_API_URL || 'http://localhost:4000';
          const response = await fetch(`${API}/api/orders/${orderId}`);
          if (!response.ok) {
            throw new Error('Không thể tải thông tin đơn hàng');
          }
          const data = await response.json();
          setOrder(data.order || data);
        } else {
          setError('Không tìm thấy thông tin đơn hàng');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Lỗi khi tải đơn hàng');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  const handleCancelOrder = async () => {
    if (!order || !user) return;

    try {
      setCancelling(true);
      const API = (import.meta as any).env?.VITE_API_URL || 'http://localhost:4000';
      const response = await fetch(`${API}/api/orders/${order.id}/cancel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          reason: cancelReason || 'User cancelled'
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Không thể hủy đơn hàng');
      }

      const data = await response.json();
      setOrder(data.order);
      setShowCancelModal(false);
      setCancelReason('');
      toast.success('Đơn hàng đã được hủy thành công');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Lỗi khi hủy đơn hàng';
      toast.error(message);
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-50 pt-20 min-h-screen flex items-center justify-center">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Đang tải thông tin đơn hàng...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="bg-gray-50 pt-20 min-h-screen">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8 text-center">
            <AlertCircle size={60} className="mx-auto text-red-500 mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Lỗi</h2>
            <p className="text-gray-600 mb-8">{error || 'Không tìm thấy thông tin đơn hàng'}</p>
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

  const shippingFee = 0; // Free shipping for all orders
  const paymentMethodLabel = order.paymentMethod === 'cod' ? 'Thanh toán khi nhận hàng (COD)' : 
                             order.paymentMethod === 'transfer' ? 'Chuyển khoản ngân hàng' : 
                             order.paymentMethod;

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
              {new Date(order.createdAt).toLocaleString('vi-VN')}
            </p>
            <p className="text-sm font-semibold text-yellow-700 mt-2">
              Trạng thái: <span className="uppercase">{order.status === 'pending' ? 'Chờ xử lý' : order.status === 'processing' ? 'Đang xử lý' : order.status === 'completed' ? 'Hoàn thành' : 'Đã hủy'}</span>
            </p>
          </div>

          {/* Shipping Address */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <MapPin size={20} className="text-yellow-600" />
              Địa chỉ giao hàng
            </h3>
            <div className="space-y-1 text-sm text-gray-700">
              <p><strong>Số điện thoại:</strong> {order.phone}</p>
              <p><strong>Địa chỉ:</strong> {order.shippingAddress}</p>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Package size={20} className="text-yellow-600" />
              Chi tiết sản phẩm ({order.items.length} sản phẩm)
            </h3>
            
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {order.items.map((item) => (
                <div key={item.productId} className="flex gap-4 pb-3 border-b last:border-0">
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
                <span className="font-semibold text-green-600">Miễn phí</span>
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
                  {order.total.toLocaleString('vi-VN')} VNĐ
                </span>
              </div>
            </div>
          </div>

          {/* Status Info */}
          <div className={`${order.status === 'cancelled' ? 'bg-red-50 border-l-4 border-red-500' : 'bg-blue-50 border-l-4 border-blue-500'} rounded-lg p-6 mb-8`}>
            <h3 className={`font-bold ${order.status === 'cancelled' ? 'text-red-900' : 'text-blue-900'} mb-3 flex items-center gap-2`}>
              <Truck size={20} />
              {order.status === 'cancelled' ? 'Đơn hàng đã bị hủy' : 'Tiếp theo'}
            </h3>
            {order.status === 'cancelled' ? (
              <div className="space-y-2 text-sm text-red-900">
                <p><strong>Lý do hủy:</strong> {order.cancellationReason}</p>
                <p><strong>Hủy lúc:</strong> {new Date(order.cancelledAt || '').toLocaleString('vi-VN')}</p>
                <p>Bạn có thể tạo đơn hàng mới bằng cách tiếp tục mua sắm</p>
              </div>
            ) : (
              <ul className="space-y-2 text-sm text-blue-900">
                <li>✓ Chúng tôi đã nhận đơn hàng của bạn</li>
                <li>✓ Đơn hàng sẽ được xử lý trong vòng 24 giờ</li>
                <li>✓ Thời gian giao hàng dự kiến: 3-5 ngày làm việc</li>
                <li>✓ Bạn có thể theo dõi đơn hàng trong mục "Đơn hàng của tôi"</li>
              </ul>
            )}
          </div>

          {/* Cancel Button - Show only if order is pending or processing */}
          {(order.status === 'pending' || order.status === 'processing') && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
              <p className="text-sm text-gray-700 mb-4">
                Bạn có thể hủy đơn hàng này nếu chưa được giao
              </p>
              <button
                onClick={() => setShowCancelModal(true)}
                className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300"
              >
                <X size={18} />
                Hủy đơn hàng
              </button>
            </div>
          )}

          {/* Cancel Modal */}
          {showCancelModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 rounded-lg">
              <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Hủy đơn hàng</h3>
                <p className="text-gray-600 mb-4">Bạn chắc chắn muốn hủy đơn hàng này?</p>
                
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Lý do hủy (tùy chọn):
                  </label>
                  <textarea
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                    rows={3}
                    placeholder="Vui lòng cho biết lý do hủy đơn..."
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowCancelModal(false)}
                    disabled={cancelling}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 rounded-lg transition disabled:opacity-50"
                  >
                    Không hủy
                  </button>
                  <button
                    onClick={handleCancelOrder}
                    disabled={cancelling}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2 rounded-lg transition disabled:opacity-50"
                  >
                    {cancelling ? 'Đang hủy...' : 'Xác nhận hủy'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => navigate('/profile')}
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