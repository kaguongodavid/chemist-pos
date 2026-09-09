const db = require('../config/db');
const { v4: uuidv4 } = require('uuid');

async function getAllMedicines(req, res) {
    const result = await db.query('SELECT * FROM medicines ORDER BY name ASC');
    res.json(result.rows);
}

async function addMedicine(req, res) {
    const { name, genericName, category, batchNumber, units, unitType, buyingPrice, sellingPrice, manufactureDate, expiryDate, supplier, reorderLevel } = req.body;

    if (!name || !category || !batchNumber || !units || !unitType || !buyingPrice || !sellingPrice || !manufactureDate || !expiryDate) {
        return res.status(400).json({ error: 'All required fields must be filled' });
    }

    const result = await db.query(
        `INSERT INTO medicines (id, name, generic_name, category, batch_number, units, unit_type, buying_price, selling_price, manufacture_date, expiry_date, supplier, reorder_level)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) RETURNING *`,
        [uuidv4(), name, genericName, category, batchNumber, units, unitType, buyingPrice, sellingPrice, manufactureDate, expiryDate, supplier, reorderLevel || 10]
    );
    res.status(201).json(result.rows[0]);
}

async function updateMedicine(req, res) {
    const { id } = req.params;
    const { name, genericName, category, batchNumber, units, unitType, buyingPrice, sellingPrice, manufactureDate, expiryDate, supplier, reorderLevel } = req.body;

    const result = await db.query(
        `UPDATE medicines SET name=$1, generic_name=$2, category=$3, batch_number=$4, units=$5, unit_type=$6, buying_price=$7, selling_price=$8, manufacture_date=$9, expiry_date=$10, supplier=$11, reorder_level=$12
         WHERE id=$13 RETURNING *`,
        [name, genericName, category, batchNumber, units, unitType, buyingPrice, sellingPrice, manufactureDate, expiryDate, supplier, reorderLevel, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Medicine not found' });
    res.json(result.rows[0]);
}

async function deleteMedicine(req, res) {
    const { id } = req.params;
    await db.query('DELETE FROM medicines WHERE id=$1', [id]);
    res.json({ message: 'Medicine deleted' });
}

async function getLowStock(req, res) {
    const result = await db.query('SELECT * FROM medicines WHERE units <= reorder_level ORDER BY units ASC');
    res.json(result.rows);
}

async function getExpiringSoon(req, res) {
    const result = await db.query(
        `SELECT * FROM medicines WHERE expiry_date <= NOW() + INTERVAL '90 days' ORDER BY expiry_date ASC`
    );
    res.json(result.rows);
}

module.exports = { getAllMedicines, addMedicine, updateMedicine, deleteMedicine, getLowStock, getExpiringSoon };