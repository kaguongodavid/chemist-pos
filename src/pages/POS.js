import React, { useState } from 'react';
import { Search, Plus, Minus, Trash2, ShoppingCart, Printer, User } from 'lucide-react';

const medicines = [
  { id: 1, name: 'Paracetamol 500mg', price: 25, stock: 50, category: 'Painkillers', batchNumber: 'BT2024001' },
  { id: 2, name: 'Amoxicillin 250mg', price: 180, stock: 30, category: 'Antibiotics', batchNumber: 'BT2024002' },
  { id: 3, name: 'Metformin 500mg', price: 120, stock: 45, category: 'Diabetes', batchNumber: 'BT2024003' },
  { id: 4, name: 'ORS Sachets', price: 15, stock: 100, category: 'Other', batchNumber: 'BT2024004' },
  { id: 5, name: 'Vitamin C 500mg', price: 35, stock: 60, category: 'Vitamins', batchNumber: 'BT2024005' },
  { id: 6, name: 'Ciprofloxacin 500mg', price: 250, stock: 25, category: 'Antibiotics', batchNumber: 'BT2024006' },
  { id: 7, name: 'Ibuprofen 400mg', price: 40, stock: 55, category: 'Painkillers', batchNumber: 'BT2024007' },
  { id: 8, name: 'Omeprazole 20mg', price: 90, stock: 35, category: 'Other', batchNumber: 'BT2024008' },
];

function POS() {
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState('');
  const [customer, setCustomer] = useState('Walk-in');
  const [amountPaid, setAmountPaid] = useState('');
  const [showReceipt, setShowReceipt] = useState(false);
  const [lastSale, setLastSale] = useState(null);

  const filtered = medicines.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.category.toLowerCase().includes(search.toLowerCase())
  );

  const addToCart = (medicine) => {
    const existing = cart.find(item => item.id === medicine.id);
    if (existing) {
      setCart(cart.map(item =>
        item.id === medicine.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...medicine, quantity: 1 }]);
    }
  };

  const updateQuantity = (id, change) => {
    setCart(cart.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + change;
        if (newQty <= 0) return null;
        return { ...item, quantity: newQty };
      }
      return item;
    }).filter(Boolean));
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.16;
  const total = subtotal + tax;
  const change = Number(amountPaid) - total;

  const handleSale = () => {
    if (cart.length === 0) return alert('Cart is empty!');
    if (!amountPaid || Number(amountPaid) < total) return alert('Insufficient amount paid!');

    const sale = {
      invoiceNo: `INV${Date.now()}`,
      customer,
      items: cart,
      subtotal,
      tax,
      total,
      amountPaid: Number(amountPaid),
      change,
      date: new Date().toLocaleString(),
    };
    setLastSale(sale);
    setShowReceipt(true);
  };

  const handleNewSale = () => {
    setCart([]);
    setAmountPaid('');
    setCustomer('Walk-in');
    setShowReceipt(false);
    setLastSale(null);
  };

  if (showReceipt && lastSale) {
    return (
      <div className="p-6 max-w-md mx-auto">
        <div className="bg-white rounded-xl shadow-sm p-6" id="receipt">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-green-700">ChemistPOS</h2>
            <p className="text-gray-500 text-sm">Pharmacy Receipt</p>
            <p className="text-gray-400 text-xs mt-1">{lastSale.date}</p>
          </div>

          <div className="border-t border-dashed border-gray-300 pt-4 mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-500">Invoice:</span>
              <span className="font-medium text-blue-600">{lastSale.invoiceNo}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Customer:</span>
              <span className="font-medium">{lastSale.customer}</span>
            </div>
          </div>

          <div className="border-t border-dashed border-gray-300 pt-4 mb-4">
            {lastSale.items.map(item => (
              <div key={item.id} className="flex justify-between text-sm mb-2">
                <div>
                  <p className="font-medium text-gray-800">{item.name}</p>
                  <p className="text-gray-500 text-xs">{item.quantity} x KES {item.price}</p>
                </div>
                <span className="font-medium">KES {item.price * item.quantity}</span>
              </div>
            ))}
          </div>

          <div className="border-t border-dashed border-gray-300 pt-4 mb-6">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-500">Subtotal:</span>
              <span>KES {lastSale.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-500">VAT (16%):</span>
              <span>KES {lastSale.tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold mt-2">
              <span>Total:</span>
              <span className="text-green-700">KES {lastSale.total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm mt-2">
              <span className="text-gray-500">Amount Paid:</span>
              <span>KES {lastSale.amountPaid.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm font-medium text-green-700">
              <span>Change:</span>
              <span>KES {lastSale.change.toFixed(2)}</span>
            </div>
          </div>

          <p className="text-center text-gray-400 text-xs mb-6">Thank you for your purchase!</p>

          <div className="flex gap-3">
            <button
              onClick={() => window.print()}
              className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white py-3 rounded-xl hover:bg-green-700"
            >
              <Printer size={18} />
              Print Receipt
            </button>
            <button
              onClick={handleNewSale}
              className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl hover:bg-gray-300"
            >
              New Sale
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full">
      {/* Left - Medicine Search */}
      <div className="flex-1 p-6 overflow-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Point of Sale</h2>
          <p className="text-gray-500">Search and add medicines to cart</p>
        </div>

        {/* Search */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-4 flex items-center gap-2">
          <Search size={18} className="text-gray-400" />
          <input
            type="text"
            placeholder="Search medicine by name or category..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full focus:outline-none text-gray-700"
            autoFocus
          />
        </div>

        {/* Medicine Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map(medicine => (
            <button
              key={medicine.id}
              onClick={() => addToCart(medicine)}
              className="bg-white rounded-xl shadow-sm p-4 text-left hover:shadow-md hover:border-green-500 border-2 border-transparent transition-all"
            >
              <div className="bg-green-100 rounded-lg p-3 mb-3 w-fit">
                <ShoppingCart size={20} className="text-green-600" />
              </div>
              <p className="font-medium text-gray-800 text-sm">{medicine.name}</p>
              <p className="text-xs text-gray-500 mb-2">{medicine.category}</p>
              <p className="text-green-700 font-bold">KES {medicine.price}</p>
              <p className="text-xs text-gray-400">Stock: {medicine.stock}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Right - Cart */}
      <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-bold text-gray-800 flex items-center gap-2">
            <ShoppingCart size={18} />
            Cart ({cart.length} items)
          </h3>
        </div>

        {/* Customer */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <User size={16} className="text-gray-400" />
            <input
              type="text"
              value={customer}
              onChange={e => setCustomer(e.target.value)}
              className="w-full text-sm focus:outline-none text-gray-700"
              placeholder="Customer name"
            />
          </div>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-auto p-4 space-y-3">
          {cart.length === 0 ? (
            <p className="text-center text-gray-400 py-8 text-sm">No items in cart</p>
          ) : (
            cart.map(item => (
              <div key={item.id} className="bg-gray-50 rounded-lg p-3">
                <div className="flex justify-between items-start mb-2">
                  <p className="text-sm font-medium text-gray-800">{item.name}</p>
                  <button onClick={() => removeFromCart(item.id)} className="text-red-400 hover:text-red-600">
                    <Trash2 size={14} />
                  </button>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <button onClick={() => updateQuantity(item.id, -1)}
                      className="bg-gray-200 rounded-full w-6 h-6 flex items-center justify-center hover:bg-gray-300">
                      <Minus size={12} />
                    </button>
                    <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, 1)}
                      className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-green-700">
                      <Plus size={12} />
                    </button>
                  </div>
                  <span className="text-sm font-bold text-green-700">KES {item.price * item.quantity}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Totals */}
        <div className="p-4 border-t border-gray-200">
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Subtotal:</span>
              <span>KES {subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>VAT (16%):</span>
              <span>KES {tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-gray-800">
              <span>Total:</span>
              <span className="text-green-700">KES {total.toFixed(2)}</span>
            </div>
          </div>

          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">Amount Paid (KES)</label>
            <input
              type="number"
              value={amountPaid}
              onChange={e => setAmountPaid(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="0.00"
            />
          </div>

          {amountPaid && Number(amountPaid) >= total && (
            <div className="bg-green-50 rounded-lg p-3 mb-3 flex justify-between">
              <span className="text-sm text-green-700">Change:</span>
              <span className="font-bold text-green-700">KES {change.toFixed(2)}</span>
            </div>
          )}

          <button
            onClick={handleSale}
            className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors"
          >
            Complete Sale
          </button>
        </div>
      </div>
    </div>
  );
}

export default POS;