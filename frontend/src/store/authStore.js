import { create } from "zustand";
import api from "../services/api.js";

const savedUser = localStorage.getItem("skillbarter-user");
const savedToken = localStorage.getItem("skillbarter-token");

const saveAuthData = (user, token) => {
  localStorage.setItem("skillbarter-user", JSON.stringify(user));
  localStorage.setItem("skillbarter-token", token);
};

const clearAuthData = () => {
  localStorage.removeItem("skillbarter-user");
  localStorage.removeItem("skillbarter-token");
};

export const useAuthStore = create((set) => ({
  user: savedUser ? JSON.parse(savedUser) : null,
  token: savedToken || null,
  initialized: false,
  setAuth: ({ user, token }) => {
    saveAuthData(user, token);
    set({ user, token, initialized: true });
  },
  setUser: (user) => {
    const currentToken = localStorage.getItem("skillbarter-token");

    if (currentToken) {
      saveAuthData(user, currentToken);
    }

    set({ user, initialized: true });
  },
  logout: () => {
    clearAuthData();
    set({ user: null, token: null, initialized: true });
  },
  fetchMe: async () => {
    const token = localStorage.getItem("skillbarter-token");

    if (!token) {
      set({ user: null, token: null, initialized: true });
      return;
    }

    try {
      const response = await api.get("/auth/me");
      saveAuthData(response.data, token);
      set({ user: response.data, token, initialized: true });
    } catch (_error) {
      clearAuthData();
      set({ user: null, token: null, initialized: true });
    }
  }
}));
