const pool = require('../database/pool');

async function createOrder(req, res) {
  const {
    user_id,
    item_id,
    item_name,
    price,
    quantity = 1,
    total_price,
    order_status = 'Preparing',
  } = req.body;

  if (!user_id || !item_name || !price) {
    return res.status(400).json({ message: 'User, item name, and price are required.' });
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');
    const orderResult = await client.query(
      `INSERT INTO orders (user_id, total_price, order_status)
       VALUES ($1, $2, $3)
       RETURNING id, user_id, total_price, order_status, created_at`,
      [String(user_id), Number(total_price || price) * Number(quantity), order_status]
    );

    await client.query(
      `INSERT INTO order_items (order_id, food_item_id, item_name, price, quantity)
       VALUES ($1, $2, $3, $4, $5)`,
      [orderResult.rows[0].id, item_id || null, item_name, price, quantity]
    );

    await client.query(
      `INSERT INTO order_history (order_id, user_id, action)
       VALUES ($1, $2, $3)`,
      [orderResult.rows[0].id, String(user_id), 'created']
    );

    await client.query('COMMIT');

    return res.status(201).json({
      message: 'Order placed successfully',
      order: orderResult.rows[0],
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Create order error:', error);
    return res.status(500).json({ message: 'Database error.' });
  } finally {
    client.release();
  }
}

async function getOrders(req, res) {
  const userId = req.query.userId;

  if (!userId) {
    return res.status(400).json({ message: 'userId query parameter is required.' });
  }

  try {
    const result = await pool.query(
      `SELECT
         o.id,
         o.user_id,
         o.total_price,
         o.order_status,
         o.created_at AS order_date,
         oi.item_name,
         oi.price,
         oi.quantity
       FROM orders o
       LEFT JOIN order_items oi ON oi.order_id = o.id
       WHERE o.user_id = $1
       ORDER BY o.created_at DESC`,
      [String(userId)]
    );

    return res.json(result.rows);
  } catch (error) {
    console.error('Fetch orders error:', error);
    return res.status(500).json({ message: 'Database error.' });
  }
}

async function deleteOrder(req, res) {
  const { id } = req.params;
  const { userId } = req.query;

  if (!id || !userId) {
    return res.status(400).json({ message: 'Order id and userId are required.' });
  }

  try {
    await pool.query('DELETE FROM orders WHERE id = $1 AND user_id = $2', [id, String(userId)]);
    return res.status(204).send();
  } catch (error) {
    console.error('Delete order error:', error);
    return res.status(500).json({ message: 'Database error.' });
  }
}

async function clearOrders(req, res) {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ message: 'userId query parameter is required.' });
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');
    await client.query('DELETE FROM order_history WHERE user_id = $1', [String(userId)]);
    await client.query('DELETE FROM orders WHERE user_id = $1', [String(userId)]);
    await client.query('COMMIT');
    return res.status(204).send();
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Clear orders error:', error);
    return res.status(500).json({ message: 'Database error.' });
  } finally {
    client.release();
  }
}

module.exports = {
  createOrder,
  getOrders,
  deleteOrder,
  clearOrders,
};
