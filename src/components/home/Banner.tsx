// src/components/home/Banner.tsx

import React from 'react';
import banner1 from '../../assets/banner1.png';

const Banner: React.FC = () => {
  return (
    // Banner full width (w-full)
    <div className="w-full bg-gray-900 text-white relative h-96 md:h-[500px] overflow-hidden">
      
      {/* Lớp phủ ảnh nền (Sử dụng ảnh mẫu chất lượng cao) */}
       <div className="absolute inset-0 bg-cover bg-center opacity-70"
         // Sử dụng ảnh `banner1.png` từ `src/assets`
         style={{ backgroundImage: `url(${banner1})` }}>
      </div>

      {/* Nội dung Banner - Căn giữa và nổi bật */}
      <div className="relative z-10 container mx-auto flex items-center h-full px-4 md:px-8">
        <div className="max-w-xl text-left bg-black bg-opacity-40 p-6 rounded-lg">
          <p className="text-yellow-400 text-sm uppercase tracking-widest mb-2">Ưu đãi Đặc biệt</p>
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
            SĂN SALE ĐẾN 40% <br/> ĐỒNG HỒ CAO CẤP
          </h1>
          <p className="mt-4 text-gray-200 text-lg">
            Khám phá bộ sưu tập mới nhất từ các thương hiệu Thụy Sĩ.
          </p>
          <button className="mt-8 bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-3 px-8 rounded-full transition duration-300 shadow-lg">
            MUA NGAY
          </button>
        </div>
      </div>
    </div>
  );
};

export default Banner;