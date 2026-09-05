# 💰 Expense Tracker

A full-stack expense tracking application built with modern web technologies. This application helps users manage their daily expenses, track spending patterns, and maintain financial discipline through an intuitive and responsive user interface.

---

## 📌 Project Overview

The **Expense Tracker** is a full-stack web application designed to simplify personal expense management. Users can securely register and log in, add and manage their expenses, filter and search transactions, and visualize their spending patterns through interactive charts.

The application provides a clean and responsive interface that works across desktop, tablet, and mobile devices.

---

## 🎯 Purpose

The main purposes of this project are:

- Simplify daily expense tracking
- Help users organize their financial records
- Provide visual insights into spending habits
- Support better financial decision-making
- Maintain financial discipline
- Provide a responsive and user-friendly experience

---

## ✨ Features

### 👤 Authentication

- User Registration
- User Login
- JWT Token Authentication
- Password Hashing using Bcrypt
- Protected Routes
- Session Management using LocalStorage
- Automatic Logout on Token Expiry
- Profile Management
- Password Change Functionality

### 💰 Expense Management

- Add New Expenses
- Edit Existing Expenses
- Delete Single Expense
- Bulk Delete Multiple Expenses
- View All Expenses
- Filter Expenses by Category
- Search Expenses by Description
- Sort Expenses by Date
  - Newest First
  - Oldest First
- Pagination Support

### 📊 Analytics & Insights

- Total Expenses Summary
- Category-wise Spending Breakdown
- Interactive Pie Chart
- Current Month Statistics
- Monthly Spending Trends
- Daily Average Expense Calculation
- Top Spending Categories
- Recent Transactions
- Percentage Distribution by Category

### 🎨 User Interface

- Modern Glass-morphism Design
- Gradient Backgrounds
- Responsive Layout
- Mobile, Tablet and Desktop Support
- Modal-based Forms
- Delete Confirmation Dialogs
- Toast Notifications
- Loading States
- Error Handling
- Smooth Animations
- Category Icons
- Category Color Coding

### 🛡️ Security

- JWT-based Authentication
- Password Hashing using Bcrypt
- Protected API Routes
- Input Validation
- MongoDB-based Data Storage
- CORS Configuration
- XSS Protection
- Secure Environment Variables

---

## 🛠️ Technology Stack

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 14.x | React framework with App Router |
| React | 18.x | UI library |
| Tailwind CSS | 3.x | Styling and responsive design |
| React Hook Form | 7.x | Form handling |
| Yup | 1.x | Schema validation |
| Axios | 1.x | HTTP client for API requests |
| Chart.js | 4.x | Data visualization |
| React-Chartjs-2 | 5.x | Chart.js integration with React |
| Date-fns | 2.x | Date manipulation |
| React-Hot-Toast | 2.x | Toast notifications |

### Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | 18+ | Runtime environment |
| Express.js | 4.x | Backend web framework |
| MongoDB | 6.x | NoSQL database |
| MongoDB Native Driver | 6.x | MongoDB database connection |
| JWT | 9.x | Authentication |
| Bcryptjs | 2.x | Password hashing |
| CORS | 2.x | Cross-Origin Resource Sharing |
| Dotenv | 16.x | Environment variable management |
| Nodemon | 3.x | Development auto-reload |

---

## 📁 Project Structure

### Backend

```text
expense-tracker-backend/
├── src/
│   ├── config/
│   │   └── db.js
│   │
│   └── index.js
│
├── .env
├── .gitignore
├── package.json
└── nodemon.json