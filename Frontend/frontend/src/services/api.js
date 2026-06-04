const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    let message = 'Request failed';
    try {
      const body = await response.json();
      message = body.message || body.error || JSON.stringify(body);
    } catch {
      const text = await response.text();
      // Strip HTML tags if the server returned an HTML error page
      const cleaned = text.replace(/<[^>]*>/g, '').trim();
      if (cleaned) {
        message = cleaned;
      }
    }
    throw new Error(message);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export function fetchMenuItems() {
  return request('/menu').catch(() =>
    fetch('/menu.json').then(response => {
      if (!response.ok) {
        throw new Error('Unable to load menu.json');
      }

      return response.json();
    })
  );
}

export function registerUser(payload) {
  return request('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function loginUser(payload) {
  return request('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function logoutUser(token) {
  return request('/auth/logout', {
    method: 'POST',
    body: JSON.stringify({ token }),
  });
}

export function createOrder(order) {
  return request('/orders', {
    method: 'POST',
    body: JSON.stringify(order),
  });
}

export function getOrders(userId) {
  return request(`/orders?userId=${encodeURIComponent(userId)}`);
}

export function deleteOrder(orderId, userId) {
  return request(`/orders/${orderId}?userId=${encodeURIComponent(userId)}`, {
    method: 'DELETE',
  });
}

export function clearOrders(userId) {
  return request(`/orders?userId=${encodeURIComponent(userId)}`, {
    method: 'DELETE',
  });
}

export function markOrderPaid(orderId, userId, razorpayResponse = {}) {
  return request(`/orders/${orderId}/payment`, {
    method: 'PATCH',
    body: JSON.stringify({
      user_id: userId,
      razorpay_payment_id: razorpayResponse.razorpay_payment_id,
      razorpay_order_id: razorpayResponse.razorpay_order_id,
      razorpay_signature: razorpayResponse.razorpay_signature,
    }),
  });
}

export function createRazorpayOrder(orderId, userId) {
  return request('/payments/razorpay/order', {
    method: 'POST',
    body: JSON.stringify({
      order_id: orderId,
      user_id: userId,
    }),
  });
}

export function verifyRazorpayPayment(orderId, userId, razorpayResponse) {
  return request('/payments/razorpay/verify', {
    method: 'POST',
    body: JSON.stringify({
      order_id: orderId,
      user_id: userId,
      razorpay_order_id: razorpayResponse.razorpay_order_id,
      razorpay_payment_id: razorpayResponse.razorpay_payment_id,
      razorpay_signature: razorpayResponse.razorpay_signature,
    }),
  });
}
