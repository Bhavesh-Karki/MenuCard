require('dotenv').config();

const express = require('express');
const cors = require('cors');
const pool = require('./database/pool');
const authRoutes = require('./routes/authRoutes');
const orderRoutes = require('./routes/orderRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || 'http://localhost:3000',
    credentials: true,
  })
);
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Food ordering backend is running');
});

app.get('/api/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok', database: 'connected' });
  } catch (error) {
    res.status(500).json({ status: 'error', database: 'unavailable' });
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);

// Backward compatibility for the original frontend endpoint.
app.post('/api/order', (req, res, next) => {
  req.url = '/';
  orderRoutes(req, res, next);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
