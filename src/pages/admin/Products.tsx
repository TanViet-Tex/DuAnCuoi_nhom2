import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import AdminLayout from '../../components/admin/AdminLayout';
import type { ProductItem } from '../../services/admin.service';
import { loadProducts, saveProducts } from '../../services/admin.service';

const emptyProduct = (id = ''): ProductItem => ({ id, name: '', brand: '', price: 0, stock: 0, status: 'Còn hàng' });

export default function ProductsPage() {
  const [products, setProducts] = useState<ProductItem[]>(() => loadProducts());
  const [editing, setEditing] = useState<ProductItem | null>(null);
  const [form, setForm] = useState<ProductItem>(emptyProduct());

  useEffect(() => {
    saveProducts(products);
  }, [products]);

  const startAdd = () => {
    setEditing(null);
    setForm(emptyProduct(`p${Date.now()}`));
  };

  const startEdit = (p: ProductItem) => {
    setEditing(p);
    setForm(p);
  };

  const save = () => {
    if (!form.name) {
      toast.error('Tên sản phẩm là bắt buộc');
      return;
    }
    if (editing) {
      setProducts((s) => s.map((x) => (x.id === form.id ? form : x)));
    } else {
      setProducts((s) => [form, ...s]);
    }
    setEditing(null);
    setForm(emptyProduct());
  };

  const remove = (id: string) => {
    if (!confirm('Xóa sản phẩm này?')) return;
    setProducts((s) => s.filter((p) => p.id !== id));
  };

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-4">Quản lý Sản phẩm</h1>

      <div className="mb-4 flex gap-2">
        <button onClick={startAdd} className="px-4 py-2 bg-amber-500 text-black rounded">Thêm sản phẩm</button>
      </div>

      <div className="bg-gray-800 rounded-xl p-4 mb-6">
        <h3 className="font-semibold mb-3">Danh sách đồng hồ</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="text-gray-400">
              <tr>
                <th className="py-2">Tên</th>
                <th className="py-2">Giá</th>
                <th className="py-2">Thương hiệu</th>
                <th className="py-2">Tồn kho</th>
                <th className="py-2">Trạng thái</th>
                <th className="py-2">Hành động</th>
              </tr>
            </thead>
            <tbody className="text-gray-200">
              {products.map((p) => (
                <tr key={p.id} className="border-t border-gray-700">
                  <td className="py-3">{p.name}</td>
                  <td className="py-3">{p.price.toLocaleString('vi-VN')}₫</td>
                  <td className="py-3">{p.brand}</td>
                  <td className="py-3">{p.stock}</td>
                  <td className="py-3">{p.status}</td>
                  <td className="py-3">
                    <button onClick={() => startEdit(p)} className="px-3 text-black py-1 bg-blue-600 rounded mr-2">Sửa</button>
                    <button onClick={() => remove(p.id)} className="px-3 text-black py-1 bg-red-600 rounded">Xóa</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-gray-800 rounded-xl p-4">
        <h3 className="font-semibold mb-3">{editing ? 'Sửa sản phẩm' : 'Thêm sản phẩm'}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Tên đồng hồ" className="p-2 bg-gray-700 rounded" />
          <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} placeholder="Giá" className="p-2 bg-gray-700 rounded" />
          <input value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} placeholder="Thương hiệu" className="p-2 bg-gray-700 rounded" />
          <input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })} placeholder="Tồn kho" className="p-2 bg-gray-700 rounded" />
          <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as any })} className="p-2 bg-gray-700 rounded">
            <option value="Còn hàng">Còn hàng</option>
            <option value="Hết hàng">Hết hàng</option>
          </select>
        </div>
        <div className="mt-3">
          <button onClick={save} className="px-4 py-2 bg-amber-500 rounded text-black">Lưu</button>
        </div>
      </div>
    </AdminLayout>
  );
}
