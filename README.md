# 💊 ChemistPOS - Pharmacy Point of Sale System

A full-stack Point of Sale system designed for pharmacies and chemists. Manage medicines, process sales, track customers, and view analytics — all in one place.

## 🚀 Live Demo

🔗 https://chemist-ndndfstfe-kaguongodavid1.vercel.app

Login with: admin / admin1234

## 💡 Features

### Point of Sale
- Search medicines by name or category
- Add to cart with quantity control
- Auto-calculate subtotal, VAT (16%) and change
- Print receipt after sale
- Stock automatically deducted after sale

### Inventory Management
- Add medicines with batch number, expiry date, units
- Track buying and selling prices
- Set reorder levels for low stock alerts
- Expiry date tracking with alerts
- Edit and delete medicines

### Customer Management
- Add and manage customer records
- Track total purchases per customer
- Credit limit and credit used tracking
- Search customers by name or phone

### Reports & Analytics
- Daily sales chart
- Total revenue and transactions
- Stock overview
- All transactions history

### Security
- Password protected login
- Session management with logout

## 🔧 API Endpoints

Backend: https://chemist-pos-agtd.onrender.com

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/medicines | Get all medicines |
| POST | /api/medicines | Add medicine |
| PUT | /api/medicines/:id | Update medicine |
| DELETE | /api/medicines/:id | Delete medicine |
| GET | /api/medicines/low-stock | Get low stock medicines |
| GET | /api/medicines/expiring-soon | Get expiring medicines |
| GET | /api/sales | Get all sales |
| POST | /api/sales | Create sale |
| GET | /api/sales/daily | Get daily sales data |
| GET | /api/customers | Get all customers |
| POST | /api/customers | Add customer |
| PUT | /api/customers/:id | Update customer |
| DELETE | /api/customers/:id | Delete customer |

## 📦 Tech Stack

Frontend: React, Tailwind CSS, React Router, Vercel
Backend: Node.js, Express.js, PostgreSQL (Neon), Render

## ⚙️ Run Locally

Frontend:
git clone https://github.com/kaguongodavid/chemist-pos.git
cd chemist-pos
npm install
npm start

Backend:
cd backend
npm install
npm run dev

Create backend/.env:
PORT=5001
DATABASE_URL=your_postgresql_connection_string

## 🗄️ Database Schema

medicines - id, name, generic_name, category, batch_number, units, unit_type, buying_price, selling_price, manufacture_date, expiry_date, supplier, reorder_level
customers - id, name, phone, email, credit_limit, credit_used, total_purchases
sales - id, invoice_number, customer_name, subtotal, tax, total, amount_paid, change_amount, status
sale_items - id, sale_id, medicine_id, medicine_name, quantity, unit_price, total_price

## 🔮 Roadmap

- Python microservice for PDF report generation
- CSV import for bulk medicine upload
- SMS notifications for low stock
- Multiple user roles (admin, cashier)
- Barcode scanner support

## 👨‍💻 Author

David Kaguongo
GitHub: https://github.com/kaguongodavid
