import { Link } from "react-router-dom";
import {
  Search,
  ShoppingCart,
  Heart,
  User,
  LogOut,
  ChevronDown
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useEffect, useState } from "react";
import { useCart } from "../../contexts/CartContext";
import { useWishlist } from "../../contexts/WishlistContext";
import logo from "../../assets/logo.png";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const { wishlistCount } = useWishlist();
  const [cartCount, setCartCount] = useState(totalItems);
  const [openMenu, setOpenMenu] = useState(false);

  useEffect(() => {
    setCartCount(totalItems);
  }, [totalItems]);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white/70 backdrop-blur-xl border-b border-white/20 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Logo */}
              <Link
        to="/"
        className="flex items-center gap-3 group"
      >
        <img
          src={logo}
          alt="MyStore Logo"
          className="h-20 w-20 object-contain group-hover:scale-105 transition"
        />

        <div className="leading-tight">
          <span className="block text-xl font-extrabold text-amber-600 group-hover:text-amber-700 transition">
            MyStore
          </span>
          <span className="block text-[10px] tracking-widest text-gray-500 uppercase">
            Watch Store
          </span>
        </div>
</Link>

        {/* Search */}
        <div className="hidden lg:flex relative w-96">
          <input
            type="text"
            placeholder="Tìm kiếm đồng hồ..."
            className="w-full rounded-full pl-5 pr-10 py-2 text-sm bg-white/80 border border-gray-200 
            focus:ring-2 focus:ring-amber-500 focus:outline-none transition"
          />
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>

        {/* Menu */}
        <div className="flex items-center gap-6">

          {/* Nav links */}
          <div className="hidden md:flex items-center gap-8 text-sm font-semibold">
            {["Trang chủ", "Sản phẩm"].map((item, i) => (
              <Link
                key={i}
                to={item === "Trang chủ" ? "/" : "/products"}
                className="relative text-gray-700 hover:text-amber-600 transition after:absolute after:-bottom-1 
                after:left-0 after:h-[2px] after:w-0 after:bg-amber-600 hover:after:w-full after:transition-all"
              >
                {item}
              </Link>
            ))}

            {user?.email === "admin@gmail.com" && (
              <Link
                to="/admin"
                className="text-gray-700 hover:text-amber-600 transition"
              >
                Admin
              </Link>
            )}
          </div>

          {/* Wishlist */}
          <IconBadge to="/wishlist" count={wishlistCount}>
            <Heart className="h-5 w-5" />
          </IconBadge>

          {/* Cart */}
          <IconBadge to="/cart" count={cartCount}>
            <ShoppingCart className="h-5 w-5" />
          </IconBadge>

          {/* Auth */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setOpenMenu(!openMenu)}
                className="flex items-center gap-2 px-4 py-2 rounded-full border border-amber-500 
                text-amber-600 hover:bg-amber-500 hover:text-blue transition shadow-sm"
              >
                <User className="h-4 w-4" />
                <span className="text-sm font-semibold">Tài khoản</span>
                <ChevronDown size={16} />
              </button>

              {openMenu && (
                <div className="absolute right-0 mt-3 w-44 bg-white rounded-xl shadow-xl border overflow-hidden animate-fadeIn">
                  <Link
                    to="/profile"
                    className="block px-4 py-3 text-sm hover:bg-gray-100 transition"
                    onClick={() => setOpenMenu(false)}
                  >
                    Hồ sơ
                  </Link>
                  <button
                    onClick={logout}
                    className="w-full text-left px-3 py-3 text-sm text-gray-600 hover:bg-red-50 transition"
                  >
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="px-5 py-2 rounded-full bg-amber-500 text-white font-semibold 
              hover:bg-amber-600 transition shadow-md"
            >
              Đăng nhập
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

/* ---------- Badge Component ---------- */
function IconBadge({
  to,
  count,
  children
}: {
  to: string;
  count: number;
  children: React.ReactNode;
}) {
  return (
    <Link to={to} className="relative text-gray-700 hover:text-amber-600 transition">
      {children}
      {count > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] 
        rounded-full h-4 min-w-[16px] flex items-center justify-center font-bold px-1">
          {count > 9 ? "9+" : count}
        </span>
      )}
    </Link>
  );
}
