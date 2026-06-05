const RAW_API_BASE_URL = process.env.REACT_APP_API_URL || 'https://menucard-x6t6.onrender.com';
const API_BASE_URL = RAW_API_BASE_URL.replace(/\/$/, '').endsWith('/api')
  ? RAW_API_BASE_URL.replace(/\/$/, '')
  : `${RAW_API_BASE_URL.replace(/\/$/, '')}/api`;

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  const text = await response.text();
  const contentType = response.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');
  let data = null;

  if (text && isJson) {
    try {
      data = JSON.parse(text);
    } catch {
      data = null;
    }
  }

  if (!response.ok) {
    let message = data?.message || data?.error || 'Request failed';

    if (!data && text) {
      const cleaned = text.replace(/<[^>]*>/g, '').trim();
      message = cleaned || message;
    }

    throw new Error(message);
  }

  if (response.status === 204) {
    return null;
  }

  return data ?? text;
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
