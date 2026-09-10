const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

// Medicines
export async function getAllMedicines() {
    const res = await fetch(`${API_URL}/api/medicines`);
    return res.json();
}

export async function addMedicine(data) {
    const res = await fetch(`${API_URL}/api/medicines`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    return res.json();
}

export async function updateMedicine(id, data) {
    const res = await fetch(`${API_URL}/api/medicines/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    return res.json();
}

export async function deleteMedicine(id) {
    const res = await fetch(`${API_URL}/api/medicines/${id}`, {
        method: 'DELETE'
    });
    return res.json();
}

export async function getLowStock() {
    const res = await fetch(`${API_URL}/api/medicines/low-stock`);
    return res.json();
}

export async function getExpiringSoon() {
    const res = await fetch(`${API_URL}/api/medicines/expiring-soon`);
    return res.json();
}

// Sales
export async function getAllSales() {
    const res = await fetch(`${API_URL}/api/sales`);
    return res.json();
}

export async function createSale(data) {
    const res = await fetch(`${API_URL}/api/sales`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    return res.json();
}

export async function getDailySales() {
    const res = await fetch(`${API_URL}/api/sales/daily`);
    return res.json();
}

// Customers
export async function getAllCustomers() {
    const res = await fetch(`${API_URL}/api/customers`);
    return res.json();
}

export async function addCustomer(data) {
    const res = await fetch(`${API_URL}/api/customers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    return res.json();
}

export async function updateCustomer(id, data) {
    const res = await fetch(`${API_URL}/api/customers/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    return res.json();
}

export async function deleteCustomer(id) {
    const res = await fetch(`${API_URL}/api/customers/${id}`, {
        method: 'DELETE'
    });
    return res.json();
}