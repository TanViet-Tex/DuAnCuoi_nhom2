import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, BarChart2, Box, ShoppingCart, Users, Settings } from 'lucide-react';
// ĐÃ SỬA LỖI: Loại bỏ khoảng trắng thừa trong đường dẫn import
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

// Khai báo kiểu dữ liệu cho người dùng (user) để tránh dùng `as any` nhiều lần
interface User {
    name?: string;
    email?: string;
    // Thêm các trường khác nếu cần
}

export default function AdminNav() {
  const location = useLocation();
  
  // Tối ưu hóa: Dùng useState và useEffect để quản lý trạng thái đơn hàng bất đồng bộ
  const [orders, setOrders] = React.useState<any[]>([]);
  
  React.useEffect(() => {
    // Giả định loadOrders là hàm bất đồng bộ, nên gọi nó trong useEffect
    const fetchOrders = async () => {
        try {
            const data = await loadOrders();
            setOrders(data);
        } catch (error) {
            console.error("Failed to load orders:", error);
        }
    };
    fetchOrders();
    // Nếu loadOrders là hàm đồng bộ, bạn có thể gọi nó trực tiếp ngoài useEffect.
  }, []); // Chỉ chạy một lần khi component được mount

  const { user } = useAuth();

  // Ép kiểu (Type assertion) một lần và xử lý giá trị mặc định cho user
  const adminUser = user as User; 

  const initials = adminUser?.name 
    ? adminUser.name.split(' ').map((s: string) => s[0]).slice(0,2).join('').toUpperCase() 
    : 'AD';
  
  const userName = adminUser?.name ?? 'Admin User';
  const userEmail = adminUser?.email ?? 'admin@watchshop.vn';

  // Hàm kiểm tra menu có active hay không
  const isActive = (path: string) => {
    return location.pathname === path;
  };

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
            <Link
              key={it.to}
              to={it.to}
              className={`flex items-center gap-3 px-4 py-3 rounded-full text-sm font-medium transition ${
                isActive(it.to)
                  ? 'bg-gradient-to-r from-blue-500 to-violet-500 text-white'
                  : 'text-gray-300 hover:bg-white/5'
              }`}
            >
              <div className="w-6 h-6 flex items-center justify-center text-inherit">{it.icon}</div>
              <div className="flex-1">{it.label}</div>
              {it.to === '/admin/orders' && orders.length > 0 && (
                <div className="ml-2 inline-flex items-center justify-center text-xs font-bold bg-emerald-700 text-white px-2 py-0.5 rounded-full">
                  {orders.length}
                </div>
              )}
            </Link>
          ))}
        </nav>
      </div>

      {/* Footer user card */}
      <div className="mt-8">
        <div className="bg-[#0b1020] rounded-xl p-3 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center text-white font-semibold">{initials}</div>
          <div className="flex-1">
            <div className="text-sm font-semibold">{userName}</div>
            <div className="text-xs text-gray-400">{userEmail}</div>
          </div>
        </div>
      </div>
    </aside>
  );
}