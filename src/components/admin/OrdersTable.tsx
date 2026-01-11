import React from 'react';

interface OrderItem {
  id: string;
  userId: string;
  items: Array<{ productId: string; name: string; price: number; quantity: number }>;
  total: number;
  status: string;
  shippingAddress: string;
  phone: string;
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
}

const StatusBadge = ({ status }: { status: string }) => {
  const badgeClass =
    status === 'completed' ? 'bg-green-600' :
    status === 'processing' ? 'bg-yellow-600' :
    status === 'pending' ? 'bg-blue-600' :
    status === 'cancelled' ? 'bg-red-600' :
    'bg-gray-600';
    
  const statusLabel =
    status === 'completed' ? 'Hoàn thành' :
    status === 'processing' ? 'Đang xử lý' :
    status === 'pending' ? 'Chờ xử lý' :
    status === 'cancelled' ? 'Đã hủy' :
    status;

  return <span className={`${badgeClass} text-white text-xs px-2 py-1 rounded-full`}>{statusLabel}</span>;
};

interface OrdersTableProps {
  orders: OrderItem[];
  onStatusChange?: (orderId: string, newStatus: string) => void;
}

export default function OrdersTable({ orders, onStatusChange }: OrdersTableProps) {
  return (
    <div className="bg-gray-800 rounded-xl p-4">
      <h3 className="text-lg font-semibold mb-3">Đơn hàng gần đây</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="text-gray-400">
              <th className="py-2">Mã</th>
              <th className="py-2">Khách hàng</th>
              <th className="py-2">Ngày</th>
              <th className="py-2">Trạng thái</th>
              <th className="py-2 text-right">Tổng</th>
            </tr>
          </thead>
          <tbody className="text-gray-200">
            {orders.map((order) => (
              <tr key={order.id} className="border-t border-gray-700 hover:bg-gray-700 transition">
                <td className="py-3 text-xs font-mono">{order.id.substring(6)}</td>
                <td className="py-3 text-xs">{order.phone}</td>
                <td className="py-3 text-xs">{new Date(order.createdAt).toLocaleDateString('vi-VN')}</td>
                <td className="py-3">
                  <StatusBadge status={order.status} />
                </td>
                <td className="py-3 text-right font-semibold">{order.total.toLocaleString('vi-VN')} VNĐ</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
