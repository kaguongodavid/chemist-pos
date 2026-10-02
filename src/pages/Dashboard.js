import React, { useState, useEffect } from 'react';
import { ShoppingCart, Package, Users, TrendingUp, AlertTriangle, Clock } from 'lucide-react';
import { getAllMedicines, getAllSales, getAllCustomers, getLowStock, getExpiringSoon } from '../utils/api';

function Dashboard() {
  const [stats, setStats] = useState({ sales: 0, medicines: 0, customers: 0, revenue: 0 });
  const [recentSales, setRecentSales] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [expiring, setExpiring] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getAllSales(),
      getAllMedicines(),
      getAllCustomers(),
      getLowStock(),
      getExpiringSoon()
    ]).then(([sales, medicines, customers, lowStockData, expiringData]) => {
      const todayRevenue = sales
        .filter(s => new Date(s.created_at).toDateString() === new Date().toDateString())
        .reduce((sum, s) => sum + Number(s.total), 0);

      setStats({
        sales: sales.filter(s => new Date(s.created_at).toDateString() === new Date().toDateString()).length,
        medicines: medicines.length,
        customers: customers.length,
        revenue: todayRevenue
      });
      setRecentSales(sales.slice(0, 5));
      setLowStock(lowStockData.slice(0, 4));
      setExpiring(expiringData.slice(0, 3));
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="p-6 text-gray-500">Loading dashboard...</div>;

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
        <p className="text-gray-500">Welcome back. Here's what's happening today.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { label: "Today's Sales", value: stats.sales, icon: ShoppingCart, color: 'bg-green-500' },
          { label: 'Total Medicines', value: stats.medicines, icon: Package, color: 'bg-blue-500' },
          { label: 'Customers', value: stats.customers, icon: Users, color: 'bg-purple-500' },
          { label: "Today's Revenue", value: `KES ${stats.revenue.toLocaleString()}`, icon: TrendingUp, color: 'bg-orange-500' },
        ].map((stat) => {
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Recent Sales */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Recent Sales</h3>
            <Clock size={18} className="text-gray-400" />
          </div>
          {recentSales.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No sales yet today</p>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-gray-500 border-b">
                  <th className="pb-3">Invoice</th>
                  <th className="pb-3">Customer</th>
                  <th className="pb-3">Amount</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Time</th>
                </tr>
              </thead>
              <tbody>
                {recentSales.map((sale) => (
                  <tr key={sale.id} className="border-b last:border-0">
                    <td className="py-3 text-blue-600 font-medium text-sm">{sale.invoice_number}</td>
                    <td className="py-3 text-gray-800 text-sm">{sale.customer_name}</td>
                    <td className="py-3 text-gray-800 font-medium text-sm">KES {Number(sale.total).toLocaleString()}</td>
                    <td className="py-3">
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                        {sale.status}
                      </span>
                    </td>
                    <td className="py-3 text-gray-500 text-sm">
                      {new Date(sale.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Right column */}
        <div className="space-y-6">

          {/* Low Stock Alert */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle size={18} className="text-red-500" />
              <h3 className="text-lg font-semibold text-gray-800">Low Stock Alert</h3>
            </div>
            {lowStock.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-4">All stock levels are good!</p>
            ) : (
              <div className="space-y-3">
                {lowStock.map((item) => (
                  <div key={item.id} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-800">{item.name}</p>
                      <p className="text-xs text-gray-500">{item.unit_type}</p>
                    </div>
                    <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-medium">
                      {item.units} left
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Expiring Soon */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <Clock size={18} className="text-orange-500" />
              <h3 className="text-lg font-semibold text-gray-800">Expiring Soon</h3>
            </div>
            {expiring.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-4">No medicines expiring soon!</p>
            ) : (
              <div className="space-y-3">
                {expiring.map((item) => (
                  <div key={item.id} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-800">{item.name}</p>
                      <p className="text-xs text-gray-500">{item.units} units</p>
                    </div>
                    <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-xs font-medium">
                      {item.expiry_date?.split('T')[0]}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

export default Dashboard;