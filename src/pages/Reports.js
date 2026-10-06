import React, { useState, useEffect } from 'react';
import { TrendingUp, ShoppingCart, Package, Users, Download } from 'lucide-react';
import { getAllSales, getAllMedicines, getAllCustomers } from '../utils/api';

function Reports() {
  const [sales, setSales] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('week');

  useEffect(() => {
    Promise.all([getAllSales(), getAllMedicines(), getAllCustomers()])
      .then(([s, m, c]) => {
        setSales(s);
        setMedicines(m);
        setCustomers(c);
        setLoading(false);
      });
  }, []);

  const totalRevenue = sales.reduce((sum, s) => sum + Number(s.total), 0);
  const totalTransactions = sales.length;
  const avgSale = totalTransactions > 0 ? totalRevenue / totalTransactions : 0;

  // Group sales by day for chart
  const salesByDay = {};
  sales.forEach(sale => {
    const day = new Date(sale.created_at).toLocaleDateString('en-US', { weekday: 'short' });
    salesByDay[day] = (salesByDay[day] || 0) + Number(sale.total);
  });

  const chartData = Object.entries(salesByDay).slice(-7);
  const maxSales = Math.max(...chartData.map(([, v]) => v), 1);

  if (loading) return <div className="p-6 text-gray-500">Loading reports...</div>;

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
          { label: 'Avg Sale Value', value: `KES ${avgSale.toFixed(0)}`, icon: Package, color: 'bg-purple-500' },
          { label: 'Total Customers', value: customers.length, icon: Users, color: 'bg-orange-500' },
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
          <h3 className="text-lg font-semibold text-gray-800 mb-6">Sales by Day</h3>
          {chartData.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No sales data yet</p>
          ) : (
            <div className="flex items-end gap-3 h-48">
              {chartData.map(([day, amount]) => (
                <div key={day} className="flex-1 flex flex-col items-center gap-2">
                  <span className="text-xs text-gray-500">{(amount / 1000).toFixed(1)}k</span>
                  <div
                    className="w-full bg-green-500 rounded-t-lg hover:bg-green-600 transition-colors"
                    style={{ height: `${(amount / maxSales) * 160}px` }}
                  />
                  <span className="text-xs text-gray-600 font-medium">{day}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Stock Overview */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Stock Overview</h3>
          <div className="space-y-4">
            {medicines.slice(0, 5).map((medicine) => (
              <div key={medicine.id}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gray-800">{medicine.name}</span>
                  <span className="text-sm font-bold text-green-700">
                    {medicine.units} {medicine.unit_type}
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      medicine.units <= medicine.reorder_level ? 'bg-red-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${Math.min((medicine.units / 100) * 100, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-xl shadow-sm p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">All Transactions</h3>
          {sales.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No transactions yet</p>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-gray-500 border-b">
                  <th className="pb-3">Invoice</th>
                  <th className="pb-3">Customer</th>
                  <th className="pb-3">Amount</th>
                  <th className="pb-3">Date</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {sales.map(tx => (
                  <tr key={tx.id} className="border-b last:border-0">
                    <td className="py-3 text-blue-600 font-medium text-sm">{tx.invoice_number}</td>
                    <td className="py-3 text-gray-800 text-sm">{tx.customer_name}</td>
                    <td className="py-3 font-medium text-gray-800 text-sm">KES {Number(tx.total).toLocaleString()}</td>
                    <td className="py-3 text-gray-500 text-sm">
                      {new Date(tx.created_at).toLocaleDateString()}
                    </td>
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
          )}
        </div>
      </div>
    </div>
  );
}

export default Reports;