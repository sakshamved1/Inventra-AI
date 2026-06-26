import { create } from 'zustand';
import { authAPI } from '../services/api';

const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem('token') || null,
  isLoading: false,
  error: null,

  register: async (name, email, password, confirmPassword) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authAPI.register({ name, email, password, confirmPassword });
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        set({ user: response.data.user, token: response.data.token, isLoading: false });
      } else {
        set({ user: response.data.user, token: null, isLoading: false });
      }
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authAPI.login({ email, password });
      localStorage.setItem('token', response.data.token);
      set({ user: response.data.user, token: response.data.token, isLoading: false });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  getCurrentUser: async () => {
    set({ isLoading: true });
    try {
      const response = await authAPI.getCurrentUser();
      set({ user: response.data.user, isLoading: false });
      return response.data.user;
    } catch (error) {
      set({ error: 'Failed to fetch user', isLoading: false });
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null, error: null });
  },

  clearError: () => set({ error: null })
}));

export default useAuthStore;
