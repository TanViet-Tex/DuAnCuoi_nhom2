import React from 'react';
import { Link } from 'react-router-dom';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis,
  Tooltip, PieChart, Pie, Cell, Legend
} from 'recharts';
import { getRevenueSeries } from '../../services/admin.service';

const COLORS = ['#1f77b4', '#ff7f0e', '#2ca02c'];

export default function Statistics({ revenueSeries }: { revenueSeries?: any[] }) {
  const pieData = [
    { name: 'Đồng hồ nam', value: 65 },
    { name: 'Đồng hồ nữ', value: 25 },
    { name: 'Đồng hồ thể thao', value: 10 },
  ];

  const series = revenueSeries ?? getRevenueSeries();

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Thống kê</h1>
        <Link
          to="/admin"
          className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded text-sm text-white"
        >
          Quay lại Dashboard
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-4">
          <h2 className="text-lg font-semibold mb-4">Doanh thu theo tháng</h2>
          <div className="w-full h-[300px]">
            <ResponsiveContainer>
              <AreaChart data={series}>
                <defs>
                  <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#7c3aed"
                  fill="url(#colorUv)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-4">
          <h2 className="text-lg font-semibold mb-4">Phân loại sản phẩm</h2>
          <div className="w-full h-[300px]">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={3}
                >
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </>
  );
}
