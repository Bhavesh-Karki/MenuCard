
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json()); // VERY IMPORTANT

// TEST ROUTE
app.get("/", (req, res) => {
  res.send("Backend is running");
});

// ORDER NOW API
app.post("/api/order", (req, res) => {
  const { user_id, item_name, price, quantity } = req.body;

  // Validation
  if (!item_name || !price) {
    return res.status(400).json({ message: "Invalid order data" });
  }

  // For now just log (later DB insert)
  console.log("New Order Received:", {
    user_id,
    item_name,
    price,
    quantity,
  });

  res.status(201).json({
    message: "Order placed successfully",
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
