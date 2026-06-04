const crypto = require('crypto');
const https = require('https');
const pool = require('../database/pool');

function requestRazorpayOrder(payload) {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  return new Promise((resolve, reject) => {
    const request = https.request(
      {
        hostname: 'api.razorpay.com',
        path: '/v1/orders',
        method: 'POST',
        auth: `${keyId}:${keySecret}`,
        headers: {
          'Content-Type': 'application/json',
        },
      },
      response => {
        let body = '';

        response.on('data', chunk => {
          body += chunk;
        });

        response.on('end', () => {
          const parsedBody = body ? JSON.parse(body) : {};

          if (response.statusCode >= 400) {
            reject(new Error(parsedBody.error?.description || 'Razorpay order creation failed.'));
            return;
          }

          resolve(parsedBody);
        });
      }
    );

    request.on('error', reject);
    request.write(JSON.stringify(payload));
    request.end();
  });
}

async function createRazorpayOrder(req, res) {
  const orderId = Number.parseInt(req.body.order_id, 10);
  const userId = Number.parseInt(req.body.user_id, 10);
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!orderId || !userId) {
    return res.status(400).json({ message: 'Order id and user id are required.' });
  }

  const isDummyKey = !keyId || !keySecret || keyId.includes('dummy') || keyId.includes('YOUR_KEY') || keySecret.includes('secret') || keySecret.includes('YOUR_SECRET') || keyId === 'rzp_test_dummy';

  // Fallback to simulation if keys are missing or dummy
  if (isDummyKey) {
    console.log(`[Payment] Razorpay keys not configured or dummy detected. Simulating order creation for Order ID: ${orderId}, User ID: ${userId}`);
    try {
      const orderResult = await pool.query(
        `SELECT id, total_amount, payment_status
         FROM orders_history
         WHERE id = $1 AND user_id = $2
         LIMIT 1`,
        [orderId, userId]
      );
      const order = orderResult.rows[0];

      if (!order) {
        return res.status(404).json({ message: 'Order not found.' });
      }

      if (order.payment_status === 'paid') {
        return res.status(409).json({ message: 'Order is already paid.' });
      }

      return res.json({
        simulation: true,
        key: 'SIMULATED_KEY',
        razorpay_order_id: `sim_order_${order.id}_${Date.now()}`,
        amount: Math.round(Number(order.total_amount) * 100),
        currency: 'INR',
        name: 'Menu Card (Simulated)',
        description: `Order #${order.id} (Simulated Payment)`,
      });
    } catch (error) {
      console.error('❌ [Payment] Simulated create order error:', error.message);
      return res.status(500).json({ message: error.message || 'Payment simulation error.' });
    }
  }

  try {
    const orderResult = await pool.query(
      `SELECT id, total_amount, payment_status
       FROM orders_history
       WHERE id = $1 AND user_id = $2
       LIMIT 1`,
      [orderId, userId]
    );
    const order = orderResult.rows[0];

    if (!order) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    if (order.payment_status === 'paid') {
      return res.status(409).json({ message: 'Order is already paid.' });
    }

    const razorpayOrder = await requestRazorpayOrder({
      amount: Math.round(Number(order.total_amount) * 100),
      currency: 'INR',
      receipt: `order_${order.id}`,
    });

    console.log(`[Payment] Created Razorpay Order: ${razorpayOrder.id} for Order ID: ${order.id}`);

    return res.json({
      key: keyId,
      razorpay_order_id: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      name: 'Menu Card',
      description: `Order #${order.id}`,
    });
  } catch (error) {
    console.error('❌ [Payment] Create Razorpay order error:', error.message);
    return res.status(500).json({ message: error.message || 'Payment error.' });
  }
}

async function verifyRazorpayPayment(req, res) {
  const {
    order_id,
    user_id,
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
  } = req.body;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  const orderId = Number.parseInt(order_id, 10);
  const userId = Number.parseInt(user_id, 10);

  if (!orderId || !userId || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return res.status(400).json({ message: 'Payment verification details are required.' });
  }

  const isSimulation = razorpay_order_id.startsWith('sim_order_') || razorpay_payment_id.startsWith('sim_pay_') || razorpay_signature === 'sim_signature';

  if (!isSimulation && !keySecret) {
    return res.status(500).json({ message: 'Razorpay secret is missing on the backend.' });
  }

  if (!isSimulation) {
    const expectedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      console.warn('❌ [Payment] Invalid signature provided in verifyRazorpayPayment');
      return res.status(400).json({ message: 'Invalid payment signature.' });
    }
  } else {
    console.log(`[Payment] Verifying simulated payment: Order ID ${orderId}, User ID ${userId}`);
  }

  try {
    const result = await pool.query(
      `UPDATE orders_history
       SET order_status = 'success',
           payment_status = 'paid'
       WHERE id = $1 AND user_id = $2
       RETURNING id, user_id, total_amount, order_status, payment_status, ordered_at`,
      [orderId, userId]
    );

    if (!result.rows.length) {
      console.error(`❌ [Payment] Order not found for update: Order ID ${orderId}, User ID ${userId}`);
      return res.status(404).json({ message: 'Order not found.' });
    }

    console.log(`` + `✅ [Payment] Simulated/Razorpay Payment verified successfully. Order ID: ${orderId} is paid.`);

    return res.json({
      message: 'Payment Successful',
      order: {
        ...result.rows[0],
        order_date: result.rows[0].ordered_at,
        total_price: result.rows[0].total_amount,
      },
    });
  } catch (error) {
    console.error('❌ [Payment] Verify payment DB update error:', error.message);
    return res.status(500).json({ message: 'Database error.' });
  }
}

module.exports = {
  createRazorpayOrder,
  verifyRazorpayPayment,
};
