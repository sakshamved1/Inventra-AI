# 📦 Inventra AI

> **An AI-Powered Inventory Intelligence Platform built with the MERN Stack.**

Inventra AI is a modern inventory management platform that combines traditional inventory operations with Artificial Intelligence to help businesses monitor stock, manage products, analyze inventory health, and make smarter decisions.

Unlike conventional inventory systems that simply store data, Inventra AI provides intelligent insights through Google's Gemini AI, real-time inventory monitoring, and enterprise-grade role-based access control.

---

## 🚀 Features

### 🔐 Authentication & Security

* Secure User Registration & Login
* JWT Authentication
* Protected Routes
* Password Hashing
* Session Management

---

### 👨‍💼 Admin Approval Workflow

Every newly registered user must be approved by an administrator before accessing the system.

Workflow:

```text
User Registration
        ↓
Pending Approval
        ↓
Admin Reviews Request
        ↓
Approved / Rejected
        ↓
User Can Login
```

This ensures that only authorized users can access the platform.

---

### 🛡️ Role-Based Permission Management (RBAC)

Administrators have complete control over user permissions.

Each user is assigned permissions individually.

| Permission | Description                       |
| ---------- | --------------------------------- |
| 👁 View    | Enabled by default after approval |
| ➕ Add      | Create new inventory items        |
| ✏ Edit     | Modify existing products          |
| 🗑 Delete  | Remove products                   |

This makes Inventra AI suitable for teams where different users require different levels of access.

---

## 📊 Dashboard

The dashboard provides a complete overview of inventory.

* Total Products
* Inventory Value
* Inventory Health Score
* Low Stock Products
* Recent Transactions
* Inventory Analytics
* Interactive Charts

---

## 📦 Product Management

* Add Products
* Edit Products
* Delete Products
* Search Products
* Category Filtering
* SKU Management
* Minimum Stock Threshold

---

## 📈 Inventory Management

Track inventory movement in real time.

* Stock In
* Stock Out
* Inventory Updates
* Transaction History
* Low Stock Detection

---

## 🤖 AI Inventory Assistant

Inventra AI integrates **Google Gemini AI** to analyze live inventory data and provide intelligent recommendations.

Example questions:

* Which products need restocking?
* Which products are overstocked?
* Summarize inventory health.
* What inventory risks should I address?
* Which products have the highest inventory value?

The AI analyzes real-time inventory information before generating responses, making recommendations accurate and context-aware.

---

## ❤️ Inventory Health Score

The system continuously evaluates inventory health based on:

* Low Stock Items
* Overstocked Products
* Product Availability
* Overall Inventory Balance

This provides administrators with a quick overview of the overall condition of their inventory.

---

## 💻 Tech Stack

### Frontend

* React.js
* Vite
* Tailwind CSS
* Framer Motion
* React Router
* Axios
* Recharts

### Backend

* Node.js
* Express.js
* JWT Authentication
* REST API

### Database

* MongoDB
* Mongoose

### AI Integration

* Google Gemini API

---

## 📁 Project Structure

```text
Inventra-AI/
│
├── client/
│   ├── components/
│   ├── pages/
│   ├── layouts/
│   ├── services/
│   ├── hooks/
│   ├── context/
│   └── assets/
│
├── server/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── config/
│   └── utils/
│
└── README.md
```

---

## 🔒 Security Features

* JWT Authentication
* Password Encryption
* Protected API Routes
* Admin Approval Workflow
* Role-Based Access Control (RBAC)
* Permission Middleware
* Input Validation

---

## 👨‍💻 User Workflow

```text
User Registration
        ↓
Admin Approval
        ↓
Login
        ↓
Dashboard
        ↓
Manage Inventory
        ↓
Stock In / Stock Out
        ↓
Transaction Recorded
        ↓
Inventory Updated
        ↓
Ask AI Assistant
        ↓
Receive Intelligent Recommendations
```

---

## 🌟 Future Enhancements

* QR Code & Barcode Scanner
* Multi-Warehouse Management
* Purchase Order Management
* Supplier Management
* Email Notifications
* AI Demand Forecasting
* Sales Analytics
* Export Reports (PDF / Excel)
* Audit Logs

---

## ⚙️ Installation

### Clone Repository

```bash
git clone https://github.com/your-username/inventra-ai.git
cd inventra-ai
```

### Backend

```bash
cd server
npm install
npm run dev
```

### Frontend

```bash
cd client
npm install
npm run dev
```

---

## 📸 Screenshots

Add screenshots of:

* Login
* Dashboard
* Products
* Inventory
* Transactions
* Admin Panel
* AI Assistant

---

## 🎯 Project Goal

Inventra AI was developed to demonstrate how modern inventory management can be enhanced using Artificial Intelligence and enterprise-level access control.

The project focuses on building a secure, scalable, and user-friendly platform that not only manages inventory but also helps businesses make informed decisions through AI-powered insights.

---

## 👨‍💻 Developed By

Developed an Project using the **MERN Stack**, integrating **Google Gemini AI**, **Role-Based Access Control (RBAC)**, and a modern SaaS-inspired user experience.
