// src/components/home/Banner.tsx

import React from "react";
import { motion } from "framer-motion";
import banner4 from "../../assets/banner4.jpg";

const Banner: React.FC = () => {
  return (
    <div className="w-full bg-gray-900 text-white relative h-96 md:h-[500px] overflow-hidden">

      {/* Background image – zoom nhẹ */}
      <motion.div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${banner4})` }}
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 6, ease: "easeOut" }}
      >
        <div className="absolute inset-0 bg-black/1" />
      </motion.div>

      {/* Content */}
      <div className="relative z-10 container mx-auto flex items-center h-full px-4 md:px-8">
        <motion.div
          className="max-w-xl text-left bg-black/40 backdrop-blur-md p-6 md:p-8 rounded-2xl shadow-2xl"
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          {/* Badge */}
          <motion.p
            className="text-yellow-400 text-sm uppercase tracking-widest mb-2"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            Ưu đãi đặc biệt
          </motion.p>

          {/* Title */}
          <motion.h1
            className="text-4xl md:text-6xl font-extrabold leading-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            SĂN SALE ĐẾN 40% <br /> ĐỒNG HỒ CAO CẤP
          </motion.h1>

          {/* Description */}
          <motion.p
            className="mt-4 text-gray-200 text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            Khám phá bộ sưu tập mới nhất từ các thương hiệu Thụy Sĩ.
          </motion.p>

          {/* Button */}
          <motion.button
            className="mt-8 bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-3 px-8 rounded-full shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            MUA NGAY
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default Banner;
