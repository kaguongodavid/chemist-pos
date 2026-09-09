const db = require('../config/db');
const { v4: uuidv4 } = require('uuid');

async function getAllCustomers(req, res) {
    const result = await db.query('SELECT * FROM customers ORDER BY name ASC');
    res.json(result.rows);
}

async function addCustomer(req, res) {
    const { name, phone, email, creditLimit } = req.body;

    if (!name || !phone) {
        return res.status(400).json({ error: 'Name and phone are required' });
    }

    const result = await db.query(
        `INSERT INTO customers (id, name, phone, email, credit_limit)
         VALUES ($1,$2,$3,$4,$5) RETURNING *`,
        [uuidv4(), name, phone, email || null, creditLimit || 0]
    );
    res.status(201).json(result.rows[0]);
}

async function updateCustomer(req, res) {
    const { id } = req.params;
    const { name, phone, email, creditLimit } = req.body;

    const result = await db.query(
        `UPDATE customers SET name=$1, phone=$2, email=$3, credit_limit=$4
         WHERE id=$5 RETURNING *`,
        [name, phone, email, creditLimit, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Customer not found' });
    res.json(result.rows[0]);
}

async function deleteCustomer(req, res) {
    const { id } = req.params;
    await db.query('DELETE FROM customers WHERE id=$1', [id]);
    res.json({ message: 'Customer deleted' });
}

module.exports = { getAllCustomers, addCustomer, updateCustomer, deleteCustomer };