const API_BASE_URL = process.env.REACT_APP_API_URL ;

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || 'Request failed');
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export function fetchMenuItems() {
  return fetch('/menu.json').then(response => {
    if (!response.ok) {
      throw new Error('Unable to load menu.json');
    }

    return response.json();
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
