const express = require('express');
const router = express.Router();
const { getAllMedicines, addMedicine, updateMedicine, deleteMedicine, getLowStock, getExpiringSoon } = require('../controllers/medicineController');

router.get('/', getAllMedicines);
router.post('/', addMedicine);
router.put('/:id', updateMedicine);
router.delete('/:id', deleteMedicine);
router.get('/low-stock', getLowStock);
router.get('/expiring-soon', getExpiringSoon);

module.exports = router;