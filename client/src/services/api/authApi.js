import { apiClient } from "./client";

export const authApi = {
  signup: (payload) => apiClient.post("/auth/register", payload),
  login: (payload) => apiClient.post("/auth/login", payload),
  googleLogin: (credential) => apiClient.post("/auth/google", { credential }),
  logout: () => apiClient.post("/auth/logout"),
};
