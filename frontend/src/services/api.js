import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth endpoints
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getCurrentUser: () => api.get('/auth/me')
};

// Product endpoints
export const productAPI = {
  getAllProducts: (params) => api.get('/products', { params }),
  getProductById: (id) => api.get(`/products/${id}`),
  createProduct: (data) => api.post('/products', data),
  updateProduct: (id, data) => api.put(`/products/${id}`, data),
  deleteProduct: (id) => api.delete(`/products/${id}`),
  getLowStockProducts: () => api.get('/products/low-stock'),
  getInventorySummary: () => api.get('/products/summary')
};

// Transaction endpoints
export const transactionAPI = {
  createTransaction: (data) => api.post('/transactions', data),
  getTransactionHistory: () => api.get('/transactions'),
  getRecentTransactions: (limit = 10) => api.get('/transactions/recent', { params: { limit } }),
  getProductTransactions: (productId) => api.get(`/transactions/product/${productId}`)
};

// AI endpoints
export const aiAPI = {
  getInventoryInsights: (question) => api.post('/ai/insights', { question }),
  getHealthScore: () => api.get('/ai/health-score')
};

export default api;
