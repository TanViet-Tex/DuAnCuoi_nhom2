import { Link } from "react-router-dom";
import { Search, ShoppingCart, User, LogOut } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useEffect, useState } from "react";
import { useCart } from "../../contexts/CartContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const [cartCount, setCartCount] = useState<number>(totalItems);

  // Keep local state in sync with context (so component still renders when context changes)
  useEffect(() => {
    setCartCount(totalItems);
  }, [totalItems]);

  return (
    <nav className="fixed top-0 left-0 w-full bg-white/90 backdrop-blur-sm shadow-lg z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-bold text-amber-600 hover:text-amber-800 transition"
        >
          MyStore
        </Link>

        {/* Search */}
        <div className="hidden lg:flex items-center w-96 relative">
          <input
            type="text"
            placeholder="Tìm kiếm đồng hồ..."
            className="w-full py-2 pl-4 pr-10 text-gray-700 border border-gray-300 rounded-full 
            focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 transition duration-200"
          />
          <Search className="absolute right-3 h-5 w-5 text-gray-400" />
        </div>

        {/* MENU + ACTIONS */}
        <div className="flex items-center gap-6 text-lg font-medium">

          {/* Menu links */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-gray-700 hover:text-amber-600 transition">
              Trang chủ
            </Link>
            <Link to="/products" className="text-gray-700 hover:text-amber-600 transition">
              Sản phẩm
            </Link>
            {/* Admin link for admin user */}
            {user && user.email === 'admin@gmail.com' && (
              <Link to="/admin" className="text-gray-700 hover:text-amber-600 transition">
                Admin
              </Link>
            )}
          </div>

          {/* Cart + Login/Profile */}
          <div className="flex items-center gap-5">

            {/* Cart */}
            <Link
              to="/cart"
              className="text-gray-700 hover:text-amber-600 transition relative"
            >
              <ShoppingCart className="h-6 w-6" />

              {/* Hiển thị số lượng */}
              {cartCount > 0 && (
                <span
                  className="absolute -top-1 -right-2 bg-red-600 text-white text-xs rounded-full 
                  h-4 w-4 flex items-center justify-center"
                >
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Nếu user đã đăng nhập */}
            {user ? (
              <div className="flex items-center gap-3">

                {/* Hồ sơ */}
                <Link
                  to="/profile"
                  className="flex items-center gap-1 px-4 py-2 rounded-full border border-amber-500 
                  text-amber-600 hover:bg-amber-500 hover:text-white transition duration-300 shadow-md"
                >
                  <User className="h-5 w-5" />
                  Hồ sơ
                </Link>

                {/* Logout */}
                <button
                  onClick={logout}
                  className="p-2 rounded-full border border-red-500 text-red-600 hover:bg-red-500 
                  hover:text-white transition duration-300 shadow-md"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              // Nếu chưa đăng nhập → Login
              <Link
                to="/login"
                className="px-4 py-2 rounded-full border border-amber-500 text-amber-600 
                hover:bg-amber-500 hover:text-white font-semibold transition duration-300 shadow-md"
              >
                Đăng nhập
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
