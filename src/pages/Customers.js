import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Phone, Mail } from 'lucide-react';
import { getAllCustomers, addCustomer, updateCustomer, deleteCustomer } from '../utils/api';

const emptyForm = { name: '', phone: '', email: '', creditLimit: 0 };

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllCustomers().then(data => {
      setCustomers(data);
      setLoading(false);
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        const updated = await updateCustomer(editingId, form);
        setCustomers(customers.map(c => c.id === editingId ? updated : c));
        setEditingId(null);
      } else {
        const newCustomer = await addCustomer(form);
        setCustomers([newCustomer, ...customers]);
      }
      setForm(emptyForm);
      setShowForm(false);
    } catch (err) {
      alert('Error saving customer');
    }
  };

  const handleEdit = (customer) => {
    setForm({
      name: customer.name,
      phone: customer.phone,
      email: customer.email || '',
      creditLimit: customer.credit_limit
    });
    setEditingId(customer.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this customer?')) {
      await deleteCustomer(id);
      setCustomers(customers.filter(c => c.id !== id));
    }
  };

  const filtered = customers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search)
  );

  if (loading) return <div className="p-6 text-gray-500">Loading customers...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Customers</h2>
          <p className="text-gray-500">Manage customer records and credit</p>
        </div>
        <button
          onClick={() => { setShowForm(!showForm); setEditingId(null); setForm(emptyForm); }}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
        >
          <Plus size={18} />
          Add Customer
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            {editingId ? 'Edit Customer' : 'Add New Customer'}
          </h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
              <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Customer name" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
              <input required value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="+254712345678" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email (optional)</label>
              <input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="email@example.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Credit Limit (KES)</label>
              <input type="number" value={form.creditLimit} onChange={e => setForm({ ...form, creditLimit: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="0" />
            </div>
            <div className="md:col-span-2 flex gap-3">
              <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700">
                {editingId ? 'Update Customer' : 'Add Customer'}
              </button>
              <button type="button" onClick={() => { setShowForm(false); setEditingId(null); setForm(emptyForm); }}
                className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm p-4 mb-4 flex items-center gap-2">
        <Search size={18} className="text-gray-400" />
        <input
          type="text"
          placeholder="Search by name or phone..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full focus:outline-none text-gray-700"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(customer => (
          <div key={customer.id} className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="bg-green-100 rounded-full w-12 h-12 flex items-center justify-center">
                <span className="text-green-700 font-bold text-lg">{customer.name.charAt(0)}</span>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(customer)} className="text-blue-600 hover:text-blue-800 p-1">
                  <Edit size={16} />
                </button>
                <button onClick={() => handleDelete(customer.id)} className="text-red-500 hover:text-red-700 p-1">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            <h3 className="font-bold text-gray-800 text-lg mb-1">{customer.name}</h3>
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Phone size={14} />
                <span>{customer.phone}</span>
              </div>
              {customer.email && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail size={14} />
                  <span>{customer.email}</span>
                </div>
              )}
            </div>
            <div className="border-t border-gray-100 pt-4 grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-gray-500">Total Purchases</p>
                <p className="font-bold text-gray-800">KES {Number(customer.total_purchases).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Credit Used</p>
                <p className="font-bold text-gray-800">KES {Number(customer.credit_used).toLocaleString()}</p>
              </div>
            </div>
            {Number(customer.credit_limit) > 0 && (
              <div className="mt-3">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Credit Limit</span>
                  <span>KES {Number(customer.credit_limit).toLocaleString()}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full"
                    style={{ width: `${Math.min((customer.credit_used / customer.credit_limit) * 100, 100)}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="text-gray-400 col-span-3 text-center py-8">No customers found</p>
        )}
      </div>
    </div>
  );
}

export default Customers;