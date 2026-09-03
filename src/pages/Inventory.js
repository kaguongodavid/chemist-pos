import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, AlertTriangle } from 'lucide-react';

const initialMedicines = [
  {
    id: 1,
    name: 'Paracetamol 500mg',
    genericName: 'Acetaminophen',
    category: 'Painkillers',
    batchNumber: 'BT2024001',
    units: 5,
    unitType: 'strips',
    buyingPrice: 15,
    sellingPrice: 25,
    manufactureDate: '2024-01-15',
    expiryDate: '2026-01-15',
    supplier: 'Cosmos Pharmaceuticals',
    reorderLevel: 10,
  },
  {
    id: 2,
    name: 'Amoxicillin 250mg',
    genericName: 'Amoxicillin',
    category: 'Antibiotics',
    batchNumber: 'BT2024002',
    units: 3,
    unitType: 'bottles',
    buyingPrice: 120,
    sellingPrice: 180,
    manufactureDate: '2024-03-10',
    expiryDate: '2026-03-10',
    supplier: 'Beta Healthcare',
    reorderLevel: 5,
  },
  {
    id: 3,
    name: 'Metformin 500mg',
    genericName: 'Metformin HCL',
    category: 'Diabetes',
    batchNumber: 'BT2024003',
    units: 45,
    unitType: 'strips',
    buyingPrice: 80,
    sellingPrice: 120,
    manufactureDate: '2024-02-20',
    expiryDate: '2027-02-20',
    supplier: 'Dawa Limited',
    reorderLevel: 15,
  },
];

const categories = ['All', 'Antibiotics', 'Painkillers', 'Diabetes', 'Vitamins', 'Antifungals', 'Antiparasitics', 'Other'];

const emptyForm = {
  name: '', genericName: '', category: '', batchNumber: '',
  units: '', unitType: 'strips', buyingPrice: '', sellingPrice: '',
  manufactureDate: '', expiryDate: '', supplier: '', reorderLevel: ''
};

function Inventory() {
  const [medicines, setMedicines] = useState(initialMedicines);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [form, setForm] = useState(emptyForm);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      setMedicines(medicines.map(m => m.id === editingId ? { ...form, id: editingId } : m));
      setEditingId(null);
    } else {
      setMedicines([...medicines, { ...form, id: Date.now() }]);
    }
    setForm(emptyForm);
    setShowForm(false);
  };

  const handleEdit = (medicine) => {
    setForm(medicine);
    setEditingId(medicine.id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this medicine?')) {
      setMedicines(medicines.filter(m => m.id !== id));
    }
  };

  const isExpiringSoon = (date) => {
    const expiry = new Date(date);
    const today = new Date();
    const diff = (expiry - today) / (1000 * 60 * 60 * 24);
    return diff <= 90;
  };

  const isExpired = (date) => new Date(date) < new Date();

  const filtered = medicines.filter(m => {
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.batchNumber.toLowerCase().includes(search.toLowerCase()) ||
      m.genericName.toLowerCase().includes(search.toLowerCase());
    const matchCategory = selectedCategory === 'All' || m.category === selectedCategory;
    return matchSearch && matchCategory;
  });

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Inventory</h2>
          <p className="text-gray-500">Manage medicines, batches and stock levels</p>
        </div>
        <button
          onClick={() => { setShowForm(!showForm); setEditingId(null); setForm(emptyForm); }}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
        >
          <Plus size={18} />
          Add Medicine
        </button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            {editingId ? 'Edit Medicine' : 'Add New Medicine'}
          </h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Medicine Name *</label>
              <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="e.g. Paracetamol 500mg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Generic Name</label>
              <input value={form.genericName} onChange={e => setForm({ ...form, genericName: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="e.g. Acetaminophen" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
              <select required value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500">
                <option value="">Select category</option>
                {categories.filter(c => c !== 'All').map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Batch Number *</label>
              <input required value={form.batchNumber} onChange={e => setForm({ ...form, batchNumber: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="e.g. BT2024001" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Units in Stock *</label>
              <input required type="number" value={form.units} onChange={e => setForm({ ...form, units: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="0" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Unit Type *</label>
              <select required value={form.unitType} onChange={e => setForm({ ...form, unitType: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500">
                <option value="strips">Strips</option>
                <option value="tablets">Tablets</option>
                <option value="capsules">Capsules</option>
                <option value="bottles">Bottles</option>
                <option value="vials">Vials</option>
                <option value="sachets">Sachets</option>
                <option value="tubes">Tubes</option>
                <option value="pcs">Pieces</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Buying Price (KES) *</label>
              <input required type="number" value={form.buyingPrice} onChange={e => setForm({ ...form, buyingPrice: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="0.00" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Selling Price (KES) *</label>
              <input required type="number" value={form.sellingPrice} onChange={e => setForm({ ...form, sellingPrice: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="0.00" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Reorder Level *</label>
              <input required type="number" value={form.reorderLevel} onChange={e => setForm({ ...form, reorderLevel: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Minimum stock before alert" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Manufacture Date *</label>
              <input required type="date" value={form.manufactureDate} onChange={e => setForm({ ...form, manufactureDate: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date *</label>
              <input required type="date" value={form.expiryDate} onChange={e => setForm({ ...form, expiryDate: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Supplier</label>
              <input value={form.supplier} onChange={e => setForm({ ...form, supplier: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Supplier name" />
            </div>
            <div className="md:col-span-3 flex gap-3">
              <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700">
                {editingId ? 'Update Medicine' : 'Add Medicine'}
              </button>
              <button type="button" onClick={() => { setShowForm(false); setEditingId(null); setForm(emptyForm); }}
                className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Search & Filter */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-4 flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2 flex-1">
          <Search size={18} className="text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, generic name or batch number..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full focus:outline-none text-gray-700"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === cat
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-sm text-gray-500 border-b bg-gray-50">
              <th className="px-4 py-3">Medicine</th>
              <th className="px-4 py-3">Batch No.</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Buying</th>
              <th className="px-4 py-3">Selling</th>
              <th className="px-4 py-3">Expiry</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((medicine) => {
              const expired = isExpired(medicine.expiryDate);
              const expiringSoon = !expired && isExpiringSoon(medicine.expiryDate);
              const lowStock = Number(medicine.units) <= Number(medicine.reorderLevel);
              return (
                <tr key={medicine.id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-800">{medicine.name}</p>
                    <p className="text-xs text-gray-500">{medicine.genericName}</p>
                  </td>
                  <td className="px-4 py-3 text-sm text-blue-600 font-medium">{medicine.batchNumber}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{medicine.category}</td>
                  <td className="px-4 py-3">
                    <span className={`text-sm font-medium ${lowStock ? 'text-red-600' : 'text-gray-800'}`}>
                      {medicine.units} {medicine.unitType}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">KES {medicine.buyingPrice}</td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-800">KES {medicine.sellingPrice}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{medicine.expiryDate}</td>
                  <td className="px-4 py-3">
                    {expired ? (
                      <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-medium">Expired</span>
                    ) : expiringSoon ? (
                      <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit">
                        <AlertTriangle size={10} /> Expiring Soon
                      </span>
                    ) : lowStock ? (
                      <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-medium">Low Stock</span>
                    ) : (
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">Good</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(medicine)}
                        className="text-blue-600 hover:text-blue-800 p-1 rounded">
                        <Edit size={16} />
                      </button>
                      <button onClick={() => handleDelete(medicine.id)}
                        className="text-red-600 hover:text-red-800 p-1 rounded">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className="text-center text-gray-400 py-8">No medicines found</p>
        )}
      </div>
    </div>
  );
}

export default Inventory;