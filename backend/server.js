const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");

const app = express();
const PORT = 5000;


app.use(cors());
app.use(express.json()); 

const db = mysql.createConnection({
  host: "localhost",
  user: "root",              // change if different
  password: "Admin#123", // put your MySQL password
  database: "food_order_db",
});

db.connect((err) => {
  if (err) {
    console.error("MySQL connection failed:", err);
    return;
  }
  console.log("MySQL Connected Successfully");
});

app.get("/", (req, res) => {
  res.send("Backend is running");
});


app.post("/api/order", (req, res) => {
  const { user_id, item_name, price, quantity } = req.body;

  // Basic validation
  if (!item_name || !price) {
    return res.status(400).json({
      message: "Invalid order data",
    });
  }

  const sql =
    "INSERT INTO orders (user_id, item_name, price, quantity) VALUES (?, ?, ?, ?)";

  db.query(sql, [user_id, item_name, price, quantity], (err, result) => {
    if (err) {
      console.error("Database insert error:", err);
      return res.status(500).json({
        message: "Database error",
      });
    }

    res.status(201).json({
      message: "Order placed successfully",
      orderId: result.insertId,
    });
  });
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});