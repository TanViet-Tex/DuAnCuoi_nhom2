import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Legend } from 'recharts';
import { getStats, getRevenueSeries, getTopProducts, getRecentOrders } from '../services/admin.service';
import OrdersTable from '../components/admin/OrdersTable';
import ProductsList from '../components/admin/ProductsList';
import AdminLayout from '../components/admin/AdminLayout';

const COLORS = ['#1f77b4', '#ff7f0e', '#2ca02c'];

const StatCard = ({ title, value, sub }: { title: string; value: string; sub?: string }) => (
  <div className="bg-gradient-to-br from-gray-800 to-gray-900 text-white rounded-xl p-5 shadow-md">
    <div className="text-sm text-gray-400">{title}</div>
    <div className="text-2xl font-bold mt-2">{value}</div>
    {sub && <div className="text-xs text-gray-500 mt-1">{sub}</div>}
  </div>
);

export default function AdminDashboard() {
  const { user } = useAuth();

  if (!user || user.email !== 'admin@gmail.com') {
    return <Navigate to="/login" replace />;
  }

  const stats = getStats();
  const revenueSeries = getRevenueSeries();
  const products = getTopProducts();
  const orders = getRecentOrders();

  const pieData = [
    { name: 'Đồng hồ nam', value: 65 },
    { name: 'Đồng hồ nữ', value: 25 },
    { name: 'Đồng hồ thể thao', value: 10 },
  ];

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

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-4">
          <h2 className="text-lg font-semibold mb-4">Doanh thu theo tháng</h2>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <AreaChart data={revenueSeries}>
                <defs>
                  <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip />
                <Area type="monotone" dataKey="value" stroke="#7c3aed" fillOpacity={1} fill="url(#colorUv)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-4">
          <h2 className="text-lg font-semibold mb-4">Phân loại sản phẩm</h2>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={60} outerRadius={90} paddingAngle={3}>
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
