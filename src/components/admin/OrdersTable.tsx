import React from 'react';
import type { OrderItem } from '../../services/admin.service';

const StatusBadge = ({ status }: { status: string }) => {
  const cls =
    status === 'Đã giao' ? 'bg-green-600' : status === 'Hoàn thành' ? 'bg-blue-600' : status === 'Đang xử lý' ? 'bg-yellow-600' : 'bg-red-600';
  return <span className={`${cls} text-black text-xs px-2 py-1 rounded-full`}>{status}</span>;
};

export default function OrdersTable({ orders }: { orders: OrderItem[] }) {
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
            {orders.map((o) => (
              <tr key={o.id} className="border-t border-gray-700">
                <td className="py-3">{o.id}</td>
                <td className="py-3">{o.customer}</td>
                <td className="py-3">{o.date}</td>
                <td className="py-3"><StatusBadge status={o.status} /></td>
                <td className="py-3 text-right">{o.total.toLocaleString('vi-VN')}₫</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
