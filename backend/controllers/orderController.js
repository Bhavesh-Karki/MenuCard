const path = require('path');
const fs = require('fs');
const pool = require('../database/pool');

const menuPath = path.join(__dirname, '../database/menu.json');

function readMenu() {
  try {
    const data = fs.readFileSync(menuPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading menu.json in orderController:', error);
    return [];
  }
}

function toPositiveNumber(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) && number >= 0 ? number : fallback;
}

function normalizeOrderItems(body) {
  if (Array.isArray(body.items) && body.items.length) {
    return body.items.map(item => ({
      food_item_id: item.food_item_id || item.item_id || item.id,
      item_name: item.item_name || item.title || item.name,
      item_price: toPositiveNumber(item.item_price || item.price),
      quantity: Math.max(1, Number.parseInt(item.quantity || 1, 10)),
    }));
  }

  return [
    {
      food_item_id: body.food_item_id || body.item_id,
      item_name: body.item_name,
      item_price: toPositiveNumber(body.item_price || body.price),
      quantity: Math.max(1, Number.parseInt(body.quantity || 1, 10)),
    },
  ];
}

async function createOrder(req, res) {
  const userId = Number.parseInt(req.body.user_id, 10);
  const items = normalizeOrderItems(req.body);

  if (!userId || !items.length || items.some(item => !item.food_item_id || !item.item_price)) {
    return res.status(400).json({
      message: 'User id, food item id, item price, and quantity are required.',
    });
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const totalAmount = items.reduce(
      (sum, item) => sum + item.item_price * item.quantity,
      0
    );

    console.log(`[Database] Placing order: User ID ${userId}, items count: ${items.length}, total: $${totalAmount}`);

    const orderResult = await client.query(
      `INSERT INTO orders_history (user_id, total_amount, order_status, payment_status)
       VALUES ($1, $2, 'pending', 'pending')
       RETURNING id, user_id, total_amount, order_status, payment_status, ordered_at`,
      [userId, totalAmount]
    );

    const order = orderResult.rows[0];
    const savedItems = [];

    for (const item of items) {
      const itemResult = await client.query(
        `INSERT INTO user_order_history
          (order_id, user_id, food_item_id, quantity, item_price)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id, order_id, user_id, food_item_id, quantity, item_price`,
        [order.id, userId, item.food_item_id, item.quantity, item.item_price]
      );

      savedItems.push({
        ...itemResult.rows[0],
        item_name: item.item_name,
      });
    }

    await client.query('COMMIT');
    console.log(`✅ [Database] Order committed successfully. Order ID: ${order.id}`);

    return res.status(201).json({
      message: 'Order placed successfully',
      order: {
        ...order,
        order_date: order.ordered_at,
        total_price: order.total_amount,
        items: savedItems,
      },
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ [Database] Create order error, transaction rolled back:', error.message);
    return res.status(500).json({ message: 'Database error.' });
  } finally {
    client.release();
  }
}

async function getOrders(req, res) {
  const userId = Number.parseInt(req.query.userId, 10);

  if (!userId) {
    return res.status(400).json({ message: 'userId query parameter is required.' });
  }

  try {
    console.log(`[Database] Fetching orders for User ID: ${userId}`);
    const result = await pool.query(
      `SELECT
         oh.id,
         oh.user_id,
         oh.total_amount,
         oh.total_amount AS total_price,
         oh.order_status,
         oh.payment_status,
         oh.ordered_at,
         oh.ordered_at AS order_date,
         COALESCE(
           JSON_AGG(
             JSON_BUILD_OBJECT(
               'id', uoh.id,
               'food_item_id', uoh.food_item_id,
               'quantity', uoh.quantity,
               'item_price', uoh.item_price,
               'price', uoh.item_price
             )
             ORDER BY uoh.id
           ) FILTER (WHERE uoh.id IS NOT NULL),
           '[]'
         ) AS items
       FROM orders_history oh
       LEFT JOIN user_order_history uoh ON uoh.order_id = oh.id
       WHERE oh.user_id = $1
       GROUP BY oh.id
       ORDER BY oh.ordered_at DESC`,
      [userId]
    );

    const menu = readMenu();

    const enrichedOrders = result.rows.map(order => {
      let enrichedItems = [];
      if (Array.isArray(order.items)) {
        enrichedItems = order.items.map(item => {
          const menuDetail = menu.find(m => m.id === item.food_item_id);
          return {
            ...item,
            title: menuDetail ? menuDetail.title : 'Unknown Item',
            item_name: menuDetail ? menuDetail.title : 'Unknown Item',
            category: menuDetail ? menuDetail.category : '',
            image: menuDetail ? menuDetail.image : '',
          };
        });
      }

      const itemNames = enrichedItems
        .map(item => item.title)
        .filter(Boolean)
        .join(', ');

      const totalQuantity = enrichedItems.reduce((sum, item) => sum + item.quantity, 0);

      return {
        ...order,
        items: enrichedItems,
        item_name: itemNames,
        quantity: totalQuantity,
      };
    });

    console.log(`✅ [Database] Retrieved and enriched ${enrichedOrders.length} orders for User ID: ${userId}`);
    return res.json(enrichedOrders);
  } catch (error) {
    console.error('❌ [Database] Fetch orders error:', error.message);
    return res.status(500).json({ message: 'Database error.' });
  }
}

async function updatePaymentStatus(req, res) {
  const orderId = Number.parseInt(req.params.id, 10);
  const userId = Number.parseInt(req.body.user_id || req.query.userId, 10);

  if (!orderId || !userId) {
    return res.status(400).json({ message: 'Order id and user id are required.' });
  }

  try {
    console.log(`[Database] Updating payment status for Order ID: ${orderId}, User ID: ${userId}`);
    const result = await pool.query(
      `UPDATE orders_history
       SET order_status = 'success',
           payment_status = 'paid'
       WHERE id = $1 AND user_id = $2
       RETURNING id, user_id, total_amount, order_status, payment_status, ordered_at`,
      [orderId, userId]
    );

    if (!result.rows.length) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    console.log(`✅ [Database] Payment marked PAID for Order ID: ${orderId}, User ID: ${userId}`);
    return res.json({
      message: 'Payment Successful',
      order: {
        ...result.rows[0],
        order_date: result.rows[0].ordered_at,
        total_price: result.rows[0].total_amount,
      },
    });
  } catch (error) {
    console.error('❌ [Database] Update payment error:', error.message);
    return res.status(500).json({ message: 'Database error.' });
  }
}

async function deleteOrder(req, res) {
  const id = Number.parseInt(req.params.id, 10);
  const userId = Number.parseInt(req.query.userId, 10);

  if (!id || !userId) {
    return res.status(400).json({ message: 'Order id and userId are required.' });
  }

  try {
    await pool.query('DELETE FROM orders_history WHERE id = $1 AND user_id = $2', [
      id,
      userId,
    ]);
    return res.status(204).send();
  } catch (error) {
    console.error('Delete order error:', error);
    return res.status(500).json({ message: 'Database error.' });
  }
}

async function clearOrders(req, res) {
  const userId = Number.parseInt(req.query.userId, 10);

  if (!userId) {
    return res.status(400).json({ message: 'userId query parameter is required.' });
  }

  try {
    await pool.query('DELETE FROM orders_history WHERE user_id = $1', [userId]);
    return res.status(204).send();
  } catch (error) {
    console.error('Clear orders error:', error);
    return res.status(500).json({ message: 'Database error.' });
  }
}

module.exports = {
  createOrder,
  getOrders,
  updatePaymentStatus,
  deleteOrder,
  clearOrders,
};
