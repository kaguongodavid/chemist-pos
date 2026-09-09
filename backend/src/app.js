const express = require('express');
const cors = require('cors');
require('dotenv').config();

const medicineRoutes = require('./routes/medicines');
const saleRoutes = require('./routes/sales');
const customerRoutes = require('./routes/customers');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({ project: 'ChemistPOS API', status: 'running' });
});

app.use('/api/medicines', medicineRoutes);
app.use('/api/sales', saleRoutes);
app.use('/api/customers', customerRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`ChemistPOS API running on port ${PORT}`);
});