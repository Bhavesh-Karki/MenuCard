require('dotenv').config();

const express = require('express');
const cors = require('cors');
const pool = require('./database/pool');
const authRoutes = require('./routes/authRoutes');
const menuRoutes = require('./routes/menuRoutes');
const orderRoutes = require('./routes/orderRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || 'http://localhost:3000',
    credentials: true,
  })
);
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  if (req.body && Object.keys(req.body).length) {
    const bodyCopy = { ...req.body };
    if (bodyCopy.password) bodyCopy.password = '[HIDDEN]';
    console.log('  Request Body:', bodyCopy);
  }
  next();
});

app.get('/', (req, res) => {
  res.send('Food ordering backend is running');
});

app.get('/api/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok', database: 'connected' });
  } catch (error) {
    res.status(500).json({ status: 'error', database: 'unavailable', error: error.message });
  }
});

// Debug endpoint to check table contents
app.get('/api/debug/tables', async (req, res) => {
  try {
    const tables = ['users', 'orders_history', 'user_order_history'];
    const counts = {};
    for (const table of tables) {
      const result = await pool.query(`SELECT COUNT(*) FROM ${table}`);
      counts[table] = parseInt(result.rows[0].count, 10);
    }
    res.json({ success: true, message: 'Table counts retrieved', counts });
  } catch (error) {
    console.error('❌ Debug route error:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);

// Backward compatibility for the original frontend endpoint.
app.post('/api/order', (req, res, next) => {
  req.url = '/';
  orderRoutes(req, res, next);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
