import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import type { UserItem } from '../../services/admin.service';
import { loadUsers, saveUsers } from '../../services/admin.service';

export default function UsersPage() {
  const [users, setUsers] = useState<UserItem[]>(() => loadUsers());

  useEffect(() => {
    saveUsers(users);
  }, [users]);

  const toggleRole = (id: string) => {
    setUsers((s) => s.map((u) => (u.id === id ? { ...u, role: u.role === 'admin' ? 'user' : 'admin' } : u)));
  };

  const toggleLock = (id: string) => {
    setUsers((s) => s.map((u) => (u.id === id ? { ...u, locked: !u.locked } : u)));
  };

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-4">Quản lý Người dùng</h1>
      <div className="bg-gray-800 rounded-xl p-4">
        <table className="min-w-full text-left text-sm">
          <thead className="text-gray-400">
            <tr>
              <th className="py-2">ID</th>
              <th className="py-2">Tên</th>
              <th className="py-2">Email</th>
              <th className="py-2">Vai trò</th>
              <th className="py-2">Trạng thái</th>
              <th className="py-2">Hành động</th>
            </tr>
          </thead>
          <tbody className="text-gray-200">
            {users.map((u) => (
              <tr key={u.id} className="border-t border-gray-700">
                <td className="py-3">{u.id}</td>
                <td className="py-3">{u.name}</td>
                <td className="py-3">{u.email}</td>
                <td className="py-3">{u.role}</td>
                <td className="py-3">{u.locked ? 'Bị khóa' : 'Hoạt động'}</td>
                <td className="py-3">
                  <button onClick={() => toggleRole(u.id)} className="px-3 py-1 bg-blue-600 rounded mr-2">Đổi vai trò</button>
                  <button onClick={() => toggleLock(u.id)} className="px-3 py-1 bg-red-600 rounded">{u.locked ? 'Mở khóa' : 'Khóa'}</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
