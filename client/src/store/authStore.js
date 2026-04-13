import { create } from "zustand";
import { authApi } from "../services/api/authApi";
import { userApi } from "../services/api/userApi";

export const useAuthStore = create((set, get) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  error: "",

  bootstrap: async () => {
    if (!get().isLoading) return;

    try {
      const { data } = await userApi.me();
      set({ user: data, isAuthenticated: true, isLoading: false, error: "" });
    } catch {
      set({ user: null, isAuthenticated: false, isLoading: false, error: "" });
    }
  },

  signup: async (payload) => {
    await authApi.signup(payload);
  },

  login: async (payload) => {
    await authApi.login(payload);
    const { data } = await userApi.me();
    set({ user: data, isAuthenticated: true, isLoading: false, error: "" });
  },

  loginWithGoogle: async (credential) => {
    await authApi.googleLogin(credential);
    const { data } = await userApi.me();
    set({ user: data, isAuthenticated: true, isLoading: false, error: "" });
  },

  logout: async () => {
    try {
      await authApi.logout();
    } finally {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  refreshUser: async () => {
    const { data } = await userApi.me();
    set({ user: data, isAuthenticated: true });
    return data;
  },
}));
