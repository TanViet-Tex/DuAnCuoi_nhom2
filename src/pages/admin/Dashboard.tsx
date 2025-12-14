import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { getStats, getRevenueSeries, getTopProducts, getRecentOrders } from '../../services/admin.service';
import Statistics from './Statistics';
import AdminLayout from '../../components/admin/AdminLayout';
import OrdersTable from '../../components/admin/OrdersTable';
import ProductsList from '../../components/admin/ProductsList';

const StatCard = ({ title, value, sub }: { title: string; value: string; sub?: string }) => (
  <div className="bg-gradient-to-br from-gray-800 to-gray-900 text-white rounded-xl p-5 shadow-md">
    <div className="text-sm text-gray-400">{title}</div>
    <div className="text-2xl font-bold mt-2">{value}</div>
    {sub && <div className="text-xs text-gray-500 mt-1">{sub}</div>}
  </div>
);

export default function AdminDashboardPage() {
  const { user } = useAuth();

  if (!user || user.email !== 'admin@gmail.com') {
    return <Navigate to="/login" replace />;
  }

  const stats = getStats();
  const revenueSeries = getRevenueSeries();
  const products = getTopProducts();
  const orders = getRecentOrders();

  return (
    <AdminLayout>
      <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard Quản Trị</h1>
          <p className="text-gray-400 mt-1">Tổng quan kinh doanh cửa hàng đồng hồ</p>
        </div>
        <div className="text-sm text-gray-400">Xin chào, {user.fullName || user.email}</div>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard title="Tổng doanh thu" value={`${(stats.revenue / 1000000).toLocaleString('vi-VN')}tr ₫`} sub="Thống kê 7 tháng" />
        <StatCard title="Đơn hàng" value={`${stats.orders}`} sub="Tổng đơn" />
        <StatCard title="Khách hàng" value={`${stats.customers}`} sub="Khách hàng hoạt động" />
        <StatCard title="Sản phẩm" value={`${stats.products}`} sub="Các mặt hàng" />
      </section>

      <Statistics revenueSeries={revenueSeries} />

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2">
          <OrdersTable orders={orders} />
        </div>
        <div>
          <ProductsList products={products} />
        </div>
      </section>
    </AdminLayout>
  );
}
