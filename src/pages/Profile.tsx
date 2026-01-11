// src/pages/Profile.tsx

import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useOrders } from '../hooks/useOrders';
import { toast } from 'react-toastify';
import { User, Lock, MapPin, Package, Camera, Save, Edit2, X, Trash2 } from 'lucide-react';

interface UserProfile {
  fullName: string;
  email: string;
  phone: string;
  avatar: string;
  addresses: {
    id: string;
    label: string;
    address: string;
    isDefault: boolean;
  }[];
}

const Profile: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'info' | 'password' | 'address' | 'orders'>('info');
  const [isEditing, setIsEditing] = useState(false);
  const [selectedOrderToCancel, setSelectedOrderToCancel] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState('');
  const [isCancelling, setIsCancelling] = useState(false);
  
  const [profile, setProfile] = useState<UserProfile>({
    fullName: 'Khách hàng',
    email: '',
    phone: '',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
    addresses: [
      { id: '1', label: 'Nhà riêng', address: '', isDefault: true }
    ]
  });

  const { user } = useAuth();

  useEffect(() => {
    // Load stored profiles map and populate profile for logged-in user
    try {
      const profilesRaw = localStorage.getItem('user_profiles') || '{}';
      const profiles = JSON.parse(profilesRaw || '{}');
      if (user && user.email && profiles[user.email]) {
        const stored = profiles[user.email];
        setProfile(prev => ({
          fullName: stored.fullName || prev.fullName,
          email: stored.email || (user.email || prev.email),
          phone: stored.phone || prev.phone,
          avatar: stored.avatar || prev.avatar,
          addresses: stored.addresses || prev.addresses
        }));
        return;
      }

      // Fallback: if legacy single profile exists, use it
      const legacy = localStorage.getItem('userProfile');
      if (legacy) {
        const lp = JSON.parse(legacy);
        setProfile(prev => ({ ...prev, ...lp }));
      }
    } catch (e) {
      // ignore parsing errors
    }
  }, [user]);

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile({ ...profile, avatar: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = () => {
    // Save into per-email profiles map if logged in
    try {
      if (user && user.email) {
        const profilesRaw = localStorage.getItem('user_profiles') || '{}';
        const profiles = JSON.parse(profilesRaw || '{}');
        profiles[user.email] = { ...profiles[user.email], fullName: profile.fullName, email: profile.email, phone: profile.phone, avatar: profile.avatar, addresses: profile.addresses };
        localStorage.setItem('user_profiles', JSON.stringify(profiles));
      } else {
        // legacy fallback
        localStorage.setItem('userProfile', JSON.stringify(profile));
      }
    } catch (e) {}
    setIsEditing(false);
    toast.success('Đã lưu thông tin!');
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Mật khẩu xác nhận không khớp!');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      toast.error('Mật khẩu phải có ít nhất 6 ký tự!');
      return;
    }
    toast.success('Đã đổi mật khẩu thành công!');
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  const handleAddAddress = () => {
    const newAddress = prompt('Nhập địa chỉ mới:');
    if (newAddress) {
      const label = prompt('Nhãn địa chỉ (VD: Nhà riêng, Văn phòng):') || 'Địa chỉ khác';
      setProfile({
        ...profile,
        addresses: [...profile.addresses, {
          id: Date.now().toString(),
          label,
          address: newAddress,
          isDefault: false
        }]
      });
    }
  };

  const handleSetDefaultAddress = (id: string) => {
    setProfile({
      ...profile,
      addresses: profile.addresses.map(addr => ({
        ...addr,
        isDefault: addr.id === id
      }))
    });
  };

  const handleDeleteAddress = (id: string) => {
    if (confirm('Xóa địa chỉ này?')) {
      setProfile({
        ...profile,
        addresses: profile.addresses.filter(addr => addr.id !== id)
      });
    }
  };

  // Get user's orders from backend
  const { orders, loading: ordersLoading, refetch: refetchOrders } = useOrders(
    user?.id ? { userId: user.id } : undefined
  );

  const handleCancelOrder = async () => {
    if (!selectedOrderToCancel || !user) return;

    try {
      setIsCancelling(true);
      const API = (import.meta as any).env?.VITE_API_URL || 'http://localhost:4000';
      const response = await fetch(`${API}/api/orders/${selectedOrderToCancel}/cancel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          reason: cancelReason || 'User cancelled'
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Không thể hủy đơn hàng');
      }

      toast.success('Đơn hàng đã được hủy thành công');
      setSelectedOrderToCancel(null);
      setCancelReason('');
      // Refetch orders to update the list
      await refetchOrders();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Lỗi khi hủy đơn hàng';
      toast.error(message);
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <div className="bg-gray-50 pt-20 min-h-screen">
      <div className="container mx-auto px-4 md:px-8 py-8">
        
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8">Tài khoản của tôi</h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6">
              
              {/* Avatar Section */}
              <div className="text-center mb-6 pb-6 border-b">
                <div className="relative inline-block">
                  <img 
                    src={profile.avatar} 
                    alt="Avatar"
                    className="w-24 h-24 rounded-full object-cover border-4 border-yellow-200"
                  />
                  <label className="absolute bottom-0 right-0 bg-yellow-600 text-white p-2 rounded-full cursor-pointer hover:bg-yellow-700 transition">
                    <Camera size={16} />
                    <input 
                      type="file" 
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarChange}
                    />
                  </label>
                </div>
                <h3 className="font-bold text-gray-800 mt-3">{profile.fullName}</h3>
                <p className="text-sm text-gray-500">{profile.email}</p>
              </div>

              {/* Menu Items */}
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab('info')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    activeTab === 'info' 
                      ? 'bg-yellow-100 text-yellow-700 font-semibold' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <User size={20} />
                  Thông tin cá nhân
                </button>

                <button
                  onClick={() => setActiveTab('password')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    activeTab === 'password' 
                      ? 'bg-yellow-100 text-yellow-700 font-semibold' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Lock size={20} />
                  Đổi mật khẩu
                </button>

                <button
                  onClick={() => setActiveTab('address')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    activeTab === 'address' 
                      ? 'bg-yellow-100 text-yellow-700 font-semibold' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <MapPin size={20} />
                  Địa chỉ giao hàng
                </button>

                <button
                  onClick={() => setActiveTab('orders')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    activeTab === 'orders' 
                      ? 'bg-yellow-100 text-yellow-700 font-semibold' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Package size={20} />
                  Đơn hàng của tôi
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
              
              {/* Personal Info Tab */}
              {activeTab === 'info' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Thông tin cá nhân</h2>
                    <button 
                      onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
                      className="flex items-center gap-2 bg-yellow-600 hover:bg-yellow-700 text-white font-semibold px-4 py-2 rounded-lg transition"
                    >
                      {isEditing ? <><Save size={18} /> Lưu</> : <><Edit2 size={18} /> Chỉnh sửa</>}
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Họ và tên</label>
                      <input 
                        type="text"
                        value={profile.fullName}
                        onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                        disabled={!isEditing}
                        className={`w-full px-4 py-3 border rounded-lg ${
                          isEditing 
                            ? 'border-gray-300 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500' 
                            : 'bg-gray-50 border-gray-200 cursor-not-allowed'
                        }`}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                        <input 
                          type="email"
                          value={profile.email}
                          onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                          disabled={!isEditing}
                          className={`w-full px-4 py-3 border rounded-lg ${
                            isEditing 
                              ? 'border-gray-300 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500' 
                              : 'bg-gray-50 border-gray-200 cursor-not-allowed'
                          }`}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Số điện thoại</label>
                        <input 
                          type="tel"
                          value={profile.phone}
                          onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                          disabled={!isEditing}
                          className={`w-full px-4 py-3 border rounded-lg ${
                            isEditing 
                              ? 'border-gray-300 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500' 
                              : 'bg-gray-50 border-gray-200 cursor-not-allowed'
                          }`}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Change Password Tab */}
              {activeTab === 'password' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Đổi mật khẩu</h2>
                  
                  <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Mật khẩu hiện tại</label>
                      <input 
                        type="password"
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Mật khẩu mới</label>
                      <input 
                        type="password"
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Xác nhận mật khẩu mới</label>
                      <input 
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                        required
                      />
                    </div>

                    <button 
                      type="submit"
                      className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300"
                    >
                      Đổi mật khẩu
                    </button>
                  </form>
                </div>
              )}

              {/* Address Tab */}
              {activeTab === 'address' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Địa chỉ giao hàng</h2>
                    <button 
                      onClick={handleAddAddress}
                      className="bg-yellow-600 hover:bg-yellow-700 text-white font-semibold px-4 py-2 rounded-lg transition"
                    >
                      + Thêm địa chỉ
                    </button>
                  </div>

                  <div className="space-y-4">
                    {profile.addresses.map(addr => (
                      <div key={addr.id} className="border-2 rounded-lg p-4 hover:border-yellow-300 transition">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-bold text-gray-800">{addr.label}</span>
                              {addr.isDefault && (
                                <span className="bg-yellow-100 text-yellow-700 text-xs font-semibold px-2 py-1 rounded">
                                  Mặc định
                                </span>
                              )}
                            </div>
                            <p className="text-gray-600">{addr.address}</p>
                          </div>
                          
                          <div className="flex gap-2">
                            {!addr.isDefault && (
                              <button 
                                onClick={() => handleSetDefaultAddress(addr.id)}
                                className="text-sm text-yellow-600 hover:text-yellow-700 font-semibold"
                              >
                                Đặt mặc định
                              </button>
                            )}
                            <button 
                              onClick={() => handleDeleteAddress(addr.id)}
                              className="text-sm text-red-600 hover:text-red-700 font-semibold"
                            >
                              Xóa
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Orders Tab */}
              {activeTab === 'orders' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Đơn hàng của tôi</h2>
                  
                  {ordersLoading ? (
                    <div className="text-center py-12">
                      <p className="text-gray-600">Đang tải đơn hàng...</p>
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="text-center py-12">
                      <Package size={60} className="mx-auto text-gray-300 mb-4" />
                      <p className="text-gray-600">Bạn chưa có đơn hàng nào</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.reverse().map((order: any) => (
                        <div key={order.id} className="border rounded-lg p-6 hover:shadow-lg transition">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <p className="font-bold text-gray-800">Đơn hàng #{order.id}</p>
                              <p className="text-sm text-gray-500">
                                {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                              </p>
                            </div>
                            <span className={`text-sm font-semibold px-3 py-1 rounded ${
                              order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                              order.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                              order.status === 'completed' ? 'bg-green-100 text-green-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {order.status === 'pending' ? 'Đang xử lý' :
                               order.status === 'processing' ? 'Đang giao' :
                               order.status === 'completed' ? 'Đã giao' :
                               'Đã hủy'}
                            </span>
                          </div>
                          
                          <div className="space-y-2 mb-4">
                            {order.items.map((item: any, idx: number) => (
                              <div key={idx} className="flex items-center gap-3 text-sm">
                                <img src={item.imageUrl} alt={item.name} className="w-12 h-12 object-cover rounded" />
                                <span className="flex-1 text-gray-700">{item.name} x{item.quantity}</span>
                                <span className="font-semibold text-gray-800">
                                  {(item.price * item.quantity).toLocaleString('vi-VN')} VNĐ
                                </span>
                              </div>
                            ))}
                          </div>
                          
                          <div className="flex justify-between items-center pt-4 border-t">
                            <div>
                              <span className="text-gray-600">Tổng cộng:</span>
                              <span className="text-xl font-bold text-red-600 ml-2">
                                {order.total.toLocaleString('vi-VN')} VNĐ
                              </span>
                            </div>
                            {(order.status === 'pending' || order.status === 'processing') && (
                              <button
                                onClick={() => setSelectedOrderToCancel(order.id)}
                                className="flex items-center gap-2 border-2 border-red-500 text-red-500 hover:bg-red-50 px-4 py-2 rounded-lg font-semibold transition"
                              >
                                <Trash2 size={18} />
                                Hủy đơn
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>
        </div>

        {/* Cancel Order Modal */}
        {selectedOrderToCancel && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
              <div className="flex justify-between items-center p-6 border-b">
                <h3 className="text-lg font-bold text-gray-800">Hủy đơn hàng</h3>
                <button
                  onClick={() => {
                    setSelectedOrderToCancel(null);
                    setCancelReason('');
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <p className="text-gray-600">
                  Bạn có chắc chắn muốn hủy đơn hàng <strong>#{selectedOrderToCancel}</strong>?
                </p>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Lý do hủy (tùy chọn):
                  </label>
                  <textarea
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    placeholder="Nhập lý do hủy đơn hàng..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    rows={3}
                  />
                </div>

                <div className="flex gap-3 justify-end">
                  <button
                    onClick={() => {
                      setSelectedOrderToCancel(null);
                      setCancelReason('');
                    }}
                    className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 font-semibold transition"
                    disabled={isCancelling}
                  >
                    Không
                  </button>
                  <button
                    onClick={handleCancelOrder}
                    disabled={isCancelling}
                    className="px-4 py-2 bg-red-500 hover:bg-red-600 text-black rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isCancelling ? 'Đang hủy...' : 'Xác nhận hủy'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;