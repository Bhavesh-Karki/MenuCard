const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
const PORT = 5000;

/* =========================
   Middleware
========================= */
app.use(cors());
app.use(express.json());

/* =========================
   PostgreSQL Connection
========================= */
const pool = new Pool({
  host: "localhost",
  user: "postgres",          // change if different
  password: "Admin#123", // your postgres password
  database: "food_order_db",
  port: 5432,
});

pool.connect()
  .then(() => console.log("PostgreSQL Connected Successfully"))
  .catch((err) => console.error("PostgreSQL connection failed:", err));

/* =========================
   Test Route
========================= */
app.get("/", (req, res) => {
  res.send("Backend is running");
});

/* =========================
   PLACE ORDER API
========================= */
app.post("/api/order", async (req, res) => {
  const { user_id, item_name, price, quantity } = req.body;

  if (!item_name || !price) {
    return res.status(400).json({
      message: "Invalid order data",
    });
  }

  try {
    const result = await pool.query(
      `INSERT INTO orders (user_id, item_name, price, quantity)
       VALUES ($1, $2, $3, $4)
       RETURNING id`,
      [user_id, item_name, price, quantity]
    );

    res.status(201).json({
      message: "Order placed successfully",
      orderId: result.rows[0].id,
    });
  } catch (err) {
    console.error("Insert error:", err);
    res.status(500).json({
      message: "Database error",
    });
  }
});

/* =========================
   ORDER HISTORY API
========================= */
app.get("/api/orders", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM orders ORDER BY order_date DESC"
    );

    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Fetch orders error:", err);
    res.status(500).json({
      message: "Database error",
    });
  }
});

/* =========================
   Start Server
========================= */
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
