# KodnestBank App

A college-level mini banking system built with React, Node.js, Express, and MongoDB.

## Tech Stack

- **Frontend:** React.js, TailwindCSS, Chart.js, jsPDF
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Auth:** JWT + bcrypt
- **Architecture:** MVC

## Features

- **Authentication:** Register (Customer), Login (Admin & Customer), JWT, bcrypt
- **Customer:** Create Savings/Current account, deposit, withdraw, transfer, view transactions
- **Admin:** View customers, accounts, freeze/unfreeze, view transactions, analytics
- **Extras:** Dark mode, PDF statement download, email notifications (optional)

## Business Rules

- Savings min balance: ₹1,000
- Current min balance: ₹5,000
- No overdraft allowed

## Setup

### 1. Backend

```bash
cd backend
npm install
# Create .env from .env.example and set MONGODB_URI, JWT_SECRET
node scripts/seedAdmin.js   # Creates admin: admin@kodnestbank.com / admin123
npm run dev
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

### 3. MongoDB

Ensure MongoDB is running (local or Atlas). Update `MONGODB_URI` in `.env`.

## Default Admin

- Email: `admin@kodnestbank.com`
- Password: `admin123`

## API Proxy

Frontend proxies `/api` to `http://localhost:5000` (see `vite.config.js`).
