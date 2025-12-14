import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import OrdersTable from '../../components/admin/OrdersTable';
import type { OrderItem } from '../../services/admin.service';
import { loadOrders, saveOrders } from '../../services/admin.service';

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderItem[]>(() => loadOrders());

  useEffect(() => {
    saveOrders(orders);
  }, [orders]);

  const updateStatus = (id: string, status: OrderItem['status']) => {
    setOrders((s) => s.map((o) => (o.id === id ? { ...o, status } : o)));
  };

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-4">Quản lý Đơn hàng</h1>
      <div className="bg-gray-800 rounded-xl p-4">
        <OrdersTable orders={orders} />
        <div className="mt-4">
          <h4 className="text-gray-300 mb-2">Cập nhật trạng thái nhanh</h4>
          <div className="space-y-2">
            {orders.map((o) => (
              <div key={o.id} className="flex items-center justify-between border-t border-gray-700 py-2">
                <div>
                  <div className="font-medium">{o.id} - {o.customer}</div>
                  <div className="text-sm text-gray-400">{o.date} • {o.total.toLocaleString('vi-VN')}₫</div>
                </div>
                <div className="flex items-center gap-2">
                  <select value={o.status} onChange={(e) => updateStatus(o.id, e.target.value as any)} className="p-2 bg-gray-700 rounded">
                    <option>Chờ xác nhận</option>
                    <option>Đang giao</option>
                    <option>Hoàn thành</option>
                    <option>Đã hủy</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
