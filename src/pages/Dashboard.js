import React from 'react';
import { ShoppingCart, Package, Users, TrendingUp, AlertTriangle, Clock } from 'lucide-react';

const stats = [
  { label: 'Today\'s Sales', value: 'KES 12,450', icon: ShoppingCart, color: 'bg-green-500', change: '+12%' },
  { label: 'Total Medicines', value: '248', icon: Package, color: 'bg-blue-500', change: '+3 new' },
  { label: 'Customers', value: '1,204', icon: Users, color: 'bg-purple-500', change: '+8 today' },
  { label: 'Revenue (Month)', value: 'KES 284,000', icon: TrendingUp, color: 'bg-orange-500', change: '+18%' },
];

const lowStock = [
  { name: 'Paracetamol 500mg', stock: 5, unit: 'strips' },
  { name: 'Amoxicillin 250mg', stock: 3, unit: 'bottles' },
  { name: 'ORS Sachets', stock: 8, unit: 'pcs' },
  { name: 'Metformin 500mg', stock: 4, unit: 'strips' },
];

const recentSales = [
  { id: 'INV001', customer: 'John Kamau', amount: 'KES 450', time: '10:23 AM', items: 3 },
  { id: 'INV002', customer: 'Walk-in', amount: 'KES 120', time: '10:45 AM', items: 1 },
  { id: 'INV003', customer: 'Mary Wanjiku', amount: 'KES 890', time: '11:02 AM', items: 4 },
  { id: 'INV004', customer: 'Walk-in', amount: 'KES 230', time: '11:30 AM', items: 2 },
];

const expiringItems = [
  { name: 'Augmentin 625mg', expiry: 'Aug 2026', stock: 24 },
  { name: 'Ciprofloxacin 500mg', expiry: 'Sep 2026', stock: 12 },
  { name: 'Vitamin C 500mg', expiry: 'Oct 2026', stock: 36 },
];

function Dashboard() {
  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
        <p className="text-gray-500">Welcome back. Here's what's happening today.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="text-white" size={22} />
                </div>
                <span className="text-green-600 text-sm font-medium">{stat.change}</span>
              </div>
              <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
              <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Recent Sales */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Recent Sales</h3>
            <Clock size={18} className="text-gray-400" />
          </div>
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-gray-500 border-b">
                <th className="pb-3">Invoice</th>
                <th className="pb-3">Customer</th>
                <th className="pb-3">Items</th>
                <th className="pb-3">Amount</th>
                <th className="pb-3">Time</th>
              </tr>
            </thead>
            <tbody>
              {recentSales.map((sale) => (
                <tr key={sale.id} className="border-b last:border-0">
                  <td className="py-3 text-blue-600 font-medium text-sm">{sale.id}</td>
                  <td className="py-3 text-gray-800 text-sm">{sale.customer}</td>
                  <td className="py-3 text-gray-600 text-sm">{sale.items}</td>
                  <td className="py-3 text-gray-800 font-medium text-sm">{sale.amount}</td>
                  <td className="py-3 text-gray-500 text-sm">{sale.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Right column */}
        <div className="space-y-6">

          {/* Low Stock Alert */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle size={18} className="text-red-500" />
              <h3 className="text-lg font-semibold text-gray-800">Low Stock Alert</h3>
            </div>
            <div className="space-y-3">
              {lowStock.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-800">{item.name}</p>
                    <p className="text-xs text-gray-500">{item.unit}</p>
                  </div>
                  <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-medium">
                    {item.stock} left
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Expiring Soon */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <Clock size={18} className="text-orange-500" />
              <h3 className="text-lg font-semibold text-gray-800">Expiring Soon</h3>
            </div>
            <div className="space-y-3">
              {expiringItems.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-800">{item.name}</p>
                    <p className="text-xs text-gray-500">{item.stock} units</p>
                  </div>
                  <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-xs font-medium">
                    {item.expiry}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Dashboard;