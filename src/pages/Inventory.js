import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, AlertTriangle } from 'lucide-react';
import { getAllMedicines, addMedicine, updateMedicine, deleteMedicine } from '../utils/api';

const categories = ['All', 'Antibiotics', 'Painkillers', 'Diabetes', 'Vitamins', 'Antifungals', 'Antiparasitics', 'Other'];

const emptyForm = {
  name: '', genericName: '', category: '', batchNumber: '',
  units: '', unitType: 'strips', buyingPrice: '', sellingPrice: '',
  manufactureDate: '', expiryDate: '', supplier: '', reorderLevel: ''
};

function Inventory() {
  const [medicines, setMedicines] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllMedicines().then(data => {
      setMedicines(data);
      setLoading(false);
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        const updated = await updateMedicine(editingId, form);
        setMedicines(medicines.map(m => m.id === editingId ? updated : m));
        setEditingId(null);
      } else {
        const newMedicine = await addMedicine(form);
        setMedicines([newMedicine, ...medicines]);
      }
      setForm(emptyForm);
      setShowForm(false);
    } catch (err) {
      alert('Error saving medicine');
    }
  };

  const handleEdit = (medicine) => {
    setForm({
      name: medicine.name,
      genericName: medicine.generic_name || '',
      category: medicine.category,
      batchNumber: medicine.batch_number,
      units: medicine.units,
      unitType: medicine.unit_type,
      buyingPrice: medicine.buying_price,
      sellingPrice: medicine.selling_price,
      manufactureDate: medicine.manufacture_date?.split('T')[0],
      expiryDate: medicine.expiry_date?.split('T')[0],
      supplier: medicine.supplier || '',
      reorderLevel: medicine.reorder_level
    });
    setEditingId(medicine.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this medicine?')) {
      await deleteMedicine(id);
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
      m.batch_number.toLowerCase().includes(search.toLowerCase()) ||
      (m.generic_name && m.generic_name.toLowerCase().includes(search.toLowerCase()));
    const matchCategory = selectedCategory === 'All' || m.category === selectedCategory;
    return matchSearch && matchCategory;
  });

  if (loading) return <div className="p-6 text-gray-500">Loading medicines...</div>;

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
              const expired = isExpired(medicine.expiry_date);
              const expiringSoon = !expired && isExpiringSoon(medicine.expiry_date);
              const lowStock = Number(medicine.units) <= Number(medicine.reorder_level);
              return (
                <tr key={medicine.id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-800">{medicine.name}</p>
                    <p className="text-xs text-gray-500">{medicine.generic_name}</p>
                  </td>
                  <td className="px-4 py-3 text-sm text-blue-600 font-medium">{medicine.batch_number}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{medicine.category}</td>
                  <td className="px-4 py-3">
                    <span className={`text-sm font-medium ${lowStock ? 'text-red-600' : 'text-gray-800'}`}>
                      {medicine.units} {medicine.unit_type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">KES {medicine.buying_price}</td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-800">KES {medicine.selling_price}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{medicine.expiry_date?.split('T')[0]}</td>
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