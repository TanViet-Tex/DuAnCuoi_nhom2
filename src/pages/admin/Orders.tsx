import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import AdminLayout from '../../components/admin/AdminLayout';
import OrdersTable from '../../components/admin/OrdersTable';

interface OrderItem {
  id: string;
  userId: string;
  items: Array<{
    productId: string;
    name: string;
    price: number;
    quantity: number;
  }>;
  total: number;
  status: string;
  shippingAddress: string;
  phone: string;
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const API = (import.meta as any).env?.VITE_API_URL || 'http://localhost:4000';
      const response = await fetch(`${API}/api/orders`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }
      
      const data = await response.json();
      setOrders(data.orders || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Lỗi tải danh sách đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId: string, newStatus: string) => {
    try {
      const API = (import.meta as any).env?.VITE_API_URL || 'http://localhost:4000';
      const response = await fetch(`${API}/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) {
        throw new Error('Failed to update order status');
      }

      // Update local state
      setOrders(orders.map(o => 
        o.id === orderId ? { ...o, status: newStatus } : o
      ));
      toast.success('Cập nhật trạng thái thành công');
    } catch (error) {
      console.error('Error updating order:', error);
      toast.error('Lỗi cập nhật đơn hàng');
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <h1 className="text-2xl font-bold mb-4">Quản lý Đơn hàng</h1>
        <div className="bg-gray-800 rounded-xl p-8 text-center">
          <p className="text-gray-400">Đang tải danh sách đơn hàng...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-4">Quản lý Đơn hàng ({orders.length})</h1>
      <div className="bg-gray-800 rounded-xl p-4">
        {orders.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            Không có đơn hàng nào
          </div>
        ) : (
          <>
            <OrdersTable orders={orders} onStatusChange={updateStatus} />
            <div className="mt-4">
              <h4 className="text-gray-300 mb-2">Cập nhật trạng thái nhanh</h4>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {orders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between border-t border-gray-700 py-2">
                    <div className="flex-1">
                      <div className="font-medium text-sm">{order.id}</div>
                      <div className="text-xs text-gray-400">
                        {new Date(order.createdAt).toLocaleDateString('vi-VN')} • {order.total.toLocaleString('vi-VN')} VNĐ
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <select 
                        value={order.status} 
                        onChange={(e) => updateStatus(order.id, e.target.value)}
                        className="p-2 text-sm bg-gray-700 rounded text-white"
                      >
                        <option value="pending">Chờ xử lý</option>
                        <option value="processing">Đang xử lý</option>
                        <option value="completed">Hoàn thành</option>
                        <option value="cancelled">Đã hủy</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}
