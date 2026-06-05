# 🍽️ MenuCard

> A full-stack digital food ordering and menu management application for restaurants.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-menu--card--iota.vercel.app-brightgreen)](https://menu-card-iota.vercel.app)
[![Last Commit](https://img.shields.io/github/last-commit/Bhavesh-Karki/MenuCard)](https://github.com/Bhavesh-Karki/MenuCard/commits/main)
[![Top Language](https://img.shields.io/github/languages/top/Bhavesh-Karki/MenuCard)](https://github.com/Bhavesh-Karki/MenuCard)

---

## 📖 Overview

MenuCard is a full-stack web application that helps restaurants manage their menu and handle customer orders digitally. It replaces paper-based menus with a clean, interactive interface letting customers browse items and place orders while giving restaurant staff a structured order management system backed by a PostgreSQL database.

---

## ✨ Features

- 🍔 **Digital Menu Display** — Browse menu items in a clean, responsive UI
- 🛒 **Order Management** — Place and track orders in real time
- 📜 **Order History** — View past orders and their statuses
- ⚡ **Responsive UI** — Works across desktop and mobile devices
- 🔐 **API-Driven Backend** — RESTful Express API decoupled from the frontend
- 📦 **Scalable Structure** — Organized monorepo with separate frontend and backend

---

## 🛠️ Tech Stack

| Layer     | Technology                        |
|-----------|-----------------------------------|
| Frontend  | React, Bootstrap, CSS, HTML       |
| Backend   | Node.js, Express                  |
| Database  | PostgreSQL (`pg`)                 |
| Tools     | npm, dotenv, Git                  |
| Hosting   | Vercel (frontend),  Render (backend), Neon (database)                  |


---

## 🗂️ Project Structure

```
MenuCard/
├── Frontend/
│   └── frontend/          # React application
│       ├── public/
│       └── src/
├── backend/               # Node.js / Express API
│   ├── routes/
│   ├── controllers/
│   └── index.js
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- [npm](https://www.npmjs.com/)
- [PostgreSQL](https://www.postgresql.org/) (local instance or a cloud database like [Supabase](https://supabase.com/) / [Neon](https://neon.tech/))
- [Git](https://git-scm.com/)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Bhavesh-Karki/MenuCard.git
   cd MenuCard
   ```

2. **Install backend dependencies**

   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**

   ```bash
   cd ../Frontend/frontend
   npm install
   ```

4. **Configure environment variables**

   Create a `.env` file inside the `backend/` directory:

   ```env
   PORT=5000
   DATABASE_URL=your_postgresql_connection_string
   ```

### Running Locally

**Start the backend server:**

```bash
cd backend
npm start
```

The API will be available at `http://localhost:5000`.

**Start the frontend development server:**

```bash
cd Frontend/frontend
npm start
```

The app will open at `http://localhost:3000`.

---

## 🌐 Live Demo

The application is deployed and accessible at:

**[https://menu-card-iota.vercel.app](https://menu-card-iota.vercel.app)**

---

## 🧪 Running Tests

```bash
npm test
```

---

## 🤝 Contributing

Contributions are welcome! To get started:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add your feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

---

## 📄 License

This project is open source. See the repository for details.

---

## 👥 Authors

**Bhavesh Karki**
- GitHub: [@Bhavesh-Karki](https://github.com/Bhavesh-Karki)

**Mamta Kurdia**
- GitHub: [@mamtakurdia808-code](https://github.com/mamtakurdia808-code)

**Lishan Aik**
- GitHub: [@Lishanaik11](https://github.com/Lishanaik11)
