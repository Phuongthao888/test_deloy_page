import { api, setAccessToken } from "@/core/axios";

export const authService = {
  async register(data) {
    const res = await api.post("/auth/register", data);
    const token = res?.data?.data?.accessToken;
    if (token) setAccessToken(token);
    return res.data;
  },

  async login(data) {
    const res = await api.post("/auth/login", data);
    const token = res?.data?.data?.accessToken;
    if (token) setAccessToken(token);
    return res.data;
  },

  async refresh() {
    const res = await api.post("/auth/refresh", {}, { withCredentials: true });
    const token = res?.data?.data?.accessToken;
    if (token) setAccessToken(token);
    return res.data;
  },

  async logout() {
    await api.post("/auth/logout", {}, { withCredentials: true });
    setAccessToken(null);
  },
};
