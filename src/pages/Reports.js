import React, { useState } from 'react';
import { TrendingUp, ShoppingCart, Package, Users, Download, Calendar } from 'lucide-react';

const dailySales = [
    { day: 'Mon', sales: 8500},
    { day: 'Tue', sales: 12300},
    { day: 'Wed', sales: 9800},
    { day: 'Thu', sales: 15600},
    { day: 'Fri', sales: 18200},
    { day: 'Sat', sales: 22100},
    { day: 'Sun', sales: 6400},
];

const topMedicines = [
    { name: 'Paracetamol 500mg', units: 245, revenue: 6125 },
  { name: 'Amoxicillin 250mg', units: 89, revenue: 16020 },
  { name: 'ORS Sachets', units: 312, revenue: 4680 },
  { name: 'Metformin 500mg', units: 124, revenue: 14880 },
  { name: 'Vitamin C 500mg', units: 198, revenue: 6930 },
];

const maxSales = Math.max(...dailySales.map(d => d.sales));

function Reports() {
  const [period, setPeriod] = useState('week');

  const totalRevenue = dailySales.reduce((sum, d) => sum + d.sales, 0);
  const totalTransactions = 142;
  const avgSale = totalRevenue / totalTransactions;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Reports & Analytics</h2>
          <p className="text-gray-500">Track your pharmacy performance</p>
        </div>
        <div className="flex gap-3">
          <div className="flex bg-white rounded-lg border border-gray-200 overflow-hidden">
            {['week', 'month', 'year'].map(p => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-4 py-2 text-sm font-medium capitalize transition-colors ${
                  period === p ? 'bg-green-600 text-white' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
            <Download size={16} />
            Export
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Total Revenue', value: `KES ${totalRevenue.toLocaleString()}`, icon: TrendingUp, color: 'bg-green-500' },
          { label: 'Transactions', value: totalTransactions, icon: ShoppingCart, color: 'bg-blue-500' },
          { label: 'Avg Sale Value', value: `KES ${avgSale.toFixed(0)}`, icon: Calendar, color: 'bg-purple-500' },
          { label: 'Items Sold', value: '968', icon: Package, color: 'bg-orange-500' },
        ].map(stat => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white rounded-xl shadow-sm p-6">
              <div className={`${stat.color} p-3 rounded-lg w-fit mb-4`}>
                <Icon className="text-white" size={22} />
              </div>
              <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
              <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Sales Chart */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">Daily Sales (This Week)</h3>
          <div className="flex items-end gap-3 h-48">
            {dailySales.map(day => (
              <div key={day.day} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-xs text-gray-500">
                  {(day.sales / 1000).toFixed(1)}k
                </span>
                <div
                  className="w-full bg-green-500 rounded-t-lg transition-all hover:bg-green-600"
                  style={{ height: `${(day.sales / maxSales) * 160}px` }}
                />
                <span className="text-xs text-gray-600 font-medium">{day.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Medicines */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Top Selling Medicines</h3>
          <div className="space-y-4">
            {topMedicines.map((medicine, index) => (
              <div key={medicine.name}>
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-400 w-4">#{index + 1}</span>
                    <span className="text-sm font-medium text-gray-800">{medicine.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-green-700">KES {medicine.revenue.toLocaleString()}</span>
                    <span className="text-xs text-gray-500 ml-2">{medicine.units} units</span>
                  </div>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: `${(medicine.revenue / topMedicines[0].revenue) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-xl shadow-sm p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Transactions</h3>
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-gray-500 border-b">
                <th className="pb-3">Invoice</th>
                <th className="pb-3">Customer</th>
                <th className="pb-3">Items</th>
                <th className="pb-3">Amount</th>
                <th className="pb-3">Date</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {[
                { inv: 'INV001', customer: 'John Kamau', items: 3, amount: 450, date: 'Today 10:23 AM', status: 'Paid' },
                { inv: 'INV002', customer: 'Walk-in', items: 1, amount: 120, date: 'Today 10:45 AM', status: 'Paid' },
                { inv: 'INV003', customer: 'Mary Wanjiku', items: 4, amount: 890, date: 'Today 11:02 AM', status: 'Credit' },
                { inv: 'INV004', customer: 'Walk-in', items: 2, amount: 230, date: 'Today 11:30 AM', status: 'Paid' },
                { inv: 'INV005', customer: 'Peter Odhiambo', items: 5, amount: 1240, date: 'Today 12:15 PM', status: 'Paid' },
              ].map(tx => (
                <tr key={tx.inv} className="border-b last:border-0">
                  <td className="py-3 text-blue-600 font-medium text-sm">{tx.inv}</td>
                  <td className="py-3 text-gray-800 text-sm">{tx.customer}</td>
                  <td className="py-3 text-gray-600 text-sm">{tx.items}</td>
                  <td className="py-3 font-medium text-gray-800 text-sm">KES {tx.amount}</td>
                  <td className="py-3 text-gray-500 text-sm">{tx.date}</td>
                  <td className="py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      tx.status === 'Paid'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-orange-100 text-orange-700'
                    }`}>
                      {tx.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Reports;
