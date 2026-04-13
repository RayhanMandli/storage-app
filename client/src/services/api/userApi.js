import { apiClient } from "./client";

export const userApi = {
  me: () => apiClient.get("/user"),
  setPassword: (password) => apiClient.post("/user/set-password", { password }),
};
