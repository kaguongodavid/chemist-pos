const db = require('../config/db');
const { v4: uuidv4 } = require('uuid');

async function getAllSales(req, res) {
    const result = await db.query('SELECT * FROM sales ORDER BY created_at DESC');
    res.json(result.rows);
}

async function createSale(req, res) {
    const { customerName, customerId, items, subtotal, tax, total, amountPaid, changeAmount, status } = req.body;

    if (!items || items.length === 0) {
        return res.status(400).json({ error: 'Sale must have at least one item' });
    }

    const invoiceNumber = `INV${Date.now()}`;
    const saleId = uuidv4();

    // Insert sale
    const saleResult = await db.query(
        `INSERT INTO sales (id, invoice_number, customer_id, customer_name, subtotal, tax, total, amount_paid, change_amount, status)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
        [saleId, invoiceNumber, customerId || null, customerName || 'Walk-in', subtotal, tax, total, amountPaid, changeAmount, status || 'Paid']
    );

    // Insert sale items and update stock
    for (const item of items) {
        await db.query(
            `INSERT INTO sale_items (id, sale_id, medicine_id, medicine_name, quantity, unit_price, total_price)
             VALUES ($1,$2,$3,$4,$5,$6,$7)`,
            [uuidv4(), saleId, item.id, item.name, item.quantity, item.price, item.price * item.quantity]
        );

        // Deduct stock
        await db.query(
            `UPDATE medicines SET units = units - $1 WHERE id = $2`,
            [item.quantity, item.id]
        );
    }

    res.status(201).json(saleResult.rows[0]);
}

async function getSaleById(req, res) {
    const { id } = req.params;
    const sale = await db.query('SELECT * FROM sales WHERE id=$1', [id]);
    const items = await db.query('SELECT * FROM sale_items WHERE sale_id=$1', [id]);

    if (sale.rows.length === 0) return res.status(404).json({ error: 'Sale not found' });

    res.json({ ...sale.rows[0], items: items.rows });
}

async function getDailySales(req, res) {
    const result = await db.query(
        `SELECT DATE(created_at) as date, COUNT(*) as transactions, SUM(total) as revenue
         FROM sales
         WHERE created_at >= NOW() - INTERVAL '7 days'
         GROUP BY DATE(created_at)
         ORDER BY date ASC`
    );
    res.json(result.rows);
}

module.exports = { getAllSales, createSale, getSaleById, getDailySales };