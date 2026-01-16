import React from "react";
import { Facebook, Instagram, Youtube, Mail, Phone } from "lucide-react";
import logo from "../../assets/logo.png";
import { MapPin } from "lucide-react";


export default function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-300 mt-24">
      
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-3 gap-10">

        {/* Brand */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <img src={logo} alt="MyStore" className="h-10 w-10 object-contain" />
            <h2 className="text-2xl font-extrabold text-amber-500">
              MyStore
            </h2>
          </div>
          <p className="text-gray-400 leading-relaxed">
            Nền tảng mua sắm đồng hồ hiện đại, uy tín và tiện lợi.
            Cam kết sản phẩm chính hãng, giao hàng nhanh chóng.
          </p>
        </div>

        {/* Links */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-white">
            Liên kết nhanh
          </h3>
          <ul className="space-y-3">
            <li className="hover:text-amber-400 transition cursor-pointer">
              Về chúng tôi
            </li>
            <li className="hover:text-amber-400 transition cursor-pointer">
              Chính sách bảo mật
            </li>
            <li className="hover:text-amber-400 transition cursor-pointer">
              Điều khoản sử dụng
            </li>
            <li className="hover:text-amber-400 transition cursor-pointer">
              Liên hệ
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-white">
            Liên hệ với chúng tôi
          </h3>

          <div className="flex items-center gap-3 text-gray-400 mb-4">
            <Mail size={18} />
            <span>tanviet3105@mystore.com</span>
          </div>
          <div className="flex items-center gap-3 text-gray-400 mb-4">
            <Phone size={18} />
            <span>0396340034</span>
          </div>
          <div className="flex items-center gap-3 text-gray-400 mb-4">
            <MapPin size={18} />
            <span>TP. Hồ Chí Minh, Quận 12, An Phú Đông</span>
          </div>


          <div className="flex gap-4">
            <a className="p-2 rounded-full bg-gray-800 hover:bg-amber-500 hover:text-black transition">
              <Facebook size={18} />
            </a>
            <a className="p-2 rounded-full bg-gray-800 hover:bg-amber-500 hover:text-black transition">
              <Instagram size={18} />
            </a>
            <a className="p-2 rounded-full bg-gray-800 hover:bg-amber-500 hover:text-black transition">
              <Youtube size={18} />
            </a>
          </div>
        </div>

      </div>

      {/* Bottom */}
      <div className="border-t border-gray-800 py-6 text-center text-gray-500 text-sm">
        © 2025 <span className="text-amber-500 font-semibold">MyStore</span>. All rights reserved.
      </div>
    </footer>
  );
}
