const express = require('express');
const router = express.Router();
const { getAllSales, createSale, getSaleById, getDailySales } = require('../controllers/saleController');

router.get('/', getAllSales);
router.post('/', createSale);
router.get('/daily', getDailySales);
router.get('/:id', getSaleById);

module.exports = router;