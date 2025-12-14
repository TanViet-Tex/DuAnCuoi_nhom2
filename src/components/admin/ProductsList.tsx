import React from 'react';
import type { ProductItem } from '../../services/admin.service';

export default function ProductsList({ products }: { products: ProductItem[] }) {
  return (
    <div className="bg-gray-800 rounded-xl p-4">
      <h3 className="text-lg font-semibold mb-3">Sản phẩm</h3>
      <ul className="divide-y divide-gray-700">
        {products.map((p, idx) => (
          <li key={p.id} className="py-3 flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-300">{idx + 1}. {p.name}</div>
              <div className="text-xs text-gray-500">Thương hiệu: {p.brand} · {p.status}</div>
            </div>
            <div className="text-green-400 font-medium">
              {p.price.toLocaleString('vi-VN')} VNĐ
              <div className="text-xs text-gray-400">Kho: {p.stock}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
