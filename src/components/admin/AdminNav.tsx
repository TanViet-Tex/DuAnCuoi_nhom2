import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, BarChart2, Box, ShoppingCart, Users, Settings } from 'lucide-react';
import { loadOrders } from '../../services/admin.service';
import { useAuth } from '../../contexts/AuthContext';

const items = [
  { to: '/admin', label: 'Tổng quan', icon: <Home size={18} /> },
  { to: '/admin/statistics', label: 'Thống kê', icon: <BarChart2 size={18} /> },
  { to: '/admin/orders', label: 'Đơn hàng', icon: <ShoppingCart size={18} /> },
  { to: '/admin/products', label: 'Sản phẩm', icon: <Box size={18} /> },
  { to: '/admin/users', label: 'Khách hàng', icon: <Users size={18} /> },
  { to: '/admin/settings', label: 'Cài đặt', icon: <Settings size={18} /> },
];

export default function AdminNav() {
  const orders = loadOrders();
  const { user } = useAuth();

  const initials = user && (user as any).name ? (user as any).name.split(' ').map((s: string) => s[0]).slice(0,2).join('').toUpperCase() : 'AD';

  return (
    <aside className="w-72 bg-[#060617] text-gray-200 min-h-screen p-6 flex flex-col justify-between">
      <div>
        {/* Brand */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-blue-400 flex items-center justify-center text-white shadow-lg">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="9" strokeWidth="1.2" /></svg>
          </div>
          <div>
            <div className="font-bold text-lg text-white">WatchShop</div>
            <div className="text-xs text-gray-400">Admin Dashboard</div>
          </div>
        </div>

        {/* Nav items */}
        <nav className="space-y-2">
          {items.map(it => (
            <NavLink
              key={it.to}
              to={it.to}
              className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-full text-sm font-medium transition ${isActive ? 'bg-gradient-to-r from-blue-500 to-violet-500 text-white' : 'text-gray-300 hover:bg-white/5'}`}
            >
              <div className="w-6 h-6 flex items-center justify-center text-inherit">{it.icon}</div>
              <div className="flex-1">{it.label}</div>
              {it.to === '/admin/orders' && orders.length > 0 && (
                <div className="ml-2 inline-flex items-center justify-center text-xs font-bold bg-emerald-700 text-white px-2 py-0.5 rounded-full">
                  {orders.length}
                </div>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Footer user card */}
      <div className="mt-8">
        <div className="bg-[#0b1020] rounded-xl p-3 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center text-white font-semibold">{initials}</div>
          <div className="flex-1">
            <div className="text-sm font-semibold">{(user as any)?.name ?? 'Admin User'}</div>
            <div className="text-xs text-gray-400">{(user as any)?.email ?? 'admin@watchshop.vn'}</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
