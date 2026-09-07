const API_BASE_URL = '/api';

/**
 * Get JWT auth token from localStorage
 */
export const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('localkart_token') || '';
  }
  return '';
};

/**
 * Set JWT auth token in localStorage
 */
export const setAuthToken = (token) => {
  if (typeof window !== 'undefined') {
    if (token) {
      localStorage.setItem('localkart_token', token);
    } else {
      localStorage.removeItem('localkart_token');
    }
  }
};

/**
 * Universal Fetch Wrapper for backend APIs
 */
export async function apiFetch(endpoint, options = {}) {
  const token = getAuthToken();

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers
  };

  const config = {
    ...options,
    headers
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `API Error (${response.status})`);
    }

    return data;
  } catch (error) {
    console.warn(`[apiFetch Warning] ${endpoint}: ${error.message}`);
    throw error;
  }
}

// API Methods
export const authApi = {
  login: (credentials) => apiFetch('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  register: (userData) => apiFetch('/auth/register', { method: 'POST', body: JSON.stringify(userData) }),
  sendOtp: (userData) => apiFetch('/auth/send-otp', { method: 'POST', body: JSON.stringify(userData) }),
  getProfile: () => apiFetch('/auth/me'),
  updateProfile: (profileData) => apiFetch('/auth/profile', { method: 'PUT', body: JSON.stringify(profileData) }),
  updateFcmToken: (fcmToken) => apiFetch('/auth/fcm-token', { method: 'PUT', body: JSON.stringify({ fcmToken }) })
};

export const productsApi = {
  getAll: (params = {}) => {
    const queryStr = new URLSearchParams(params).toString();
    return apiFetch(`/products${queryStr ? `?${queryStr}` : ''}`);
  },
  getById: (id) => apiFetch(`/products/${id}`),
  getMerchantProducts: () => apiFetch('/products/merchant/my-products'),
  create: (productData) => apiFetch('/products', { method: 'POST', body: JSON.stringify(productData) }),
  update: (id, productData) => apiFetch(`/products/${id}`, { method: 'PUT', body: JSON.stringify(productData) }),
  delete: (id) => apiFetch(`/products/${id}`, { method: 'DELETE' })
};

export const ordersApi = {
  create: (orderData) => apiFetch('/orders', { method: 'POST', body: JSON.stringify(orderData) }),
  getMyOrders: () => apiFetch('/orders/myorders'),
  getStoreOrders: () => apiFetch('/orders/store-orders'),
  updateStatus: (id, status) => apiFetch(`/orders/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) })
};

export const cartApi = {
  get: () => apiFetch('/cart'),
  addItem: (productId, quantity = 1) => apiFetch('/cart/items', { method: 'POST', body: JSON.stringify({ productId, quantity }) }),
  updateQuantity: (productId, quantity) => apiFetch(`/cart/items/${productId}`, { method: 'PUT', body: JSON.stringify({ quantity }) }),
  removeItem: (productId) => apiFetch(`/cart/items/${productId}`, { method: 'DELETE' }),
  clear: () => apiFetch('/cart', { method: 'DELETE' })
};
