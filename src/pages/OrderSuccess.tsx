// src/pages/OrderSuccess.tsx

import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle, Package, Home, FileText } from 'lucide-react';

const OrderSuccess: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const orderId = location.state?.orderId || 'N/A';

  return (
    <div className="bg-gray-50 pt-20 min-h-screen">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8 md:p-12 text-center">
          
          {/* Success Icon */}
          <div className="mb-6">
            <CheckCircle size={80} className="mx-auto text-green-500" />
          </div>

          {/* Success Message */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Đặt hàng thành công!
          </h1>
          
          <p className="text-gray-600 mb-2">
            Cảm ơn bạn đã tin tưởng và đặt hàng tại cửa hàng chúng tôi
          </p>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8 inline-block">
            <p className="text-sm text-gray-600">Mã đơn hàng của bạn:</p>
            <p className="text-2xl font-bold text-yellow-700">{orderId}</p>
          </div>

          {/* Order Info */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Package size={20} className="text-yellow-600" />
              Thông tin đơn hàng
            </h3>
            <div className="space-y-2 text-sm text-gray-600">
              <p>✓ Chúng tôi đã gửi email xác nhận đơn hàng</p>
              <p>✓ Đơn hàng sẽ được xử lý trong vòng 24 giờ</p>
              <p>✓ Thời gian giao hàng dự kiến: 3-5 ngày làm việc</p>
              <p>✓ Bạn có thể theo dõi đơn hàng trong mục "Đơn hàng của tôi"</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => navigate('/profile/orders')}
              className="flex items-center justify-center gap-2 bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300"
            >
              <FileText size={20} />
              Xem đơn hàng
            </button>
            
            <button 
              onClick={() => navigate('/')}
              className="flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-800 font-bold py-3 px-6 rounded-lg border-2 border-gray-300 transition-all duration-300"
            >
              <Home size={20} />
              Về trang chủ
            </button>
          </div>

          {/* Support Info */}
          <div className="mt-8 pt-8 border-t">
            <p className="text-sm text-gray-600">
              Nếu có thắc mắc, vui lòng liên hệ:
            </p>
            <p className="font-semibold text-gray-800 mt-2">
              Hotline: <a href="tel:1900xxxx" className="text-yellow-600 hover:underline">1900 xxxx</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;