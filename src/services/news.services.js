import { api } from "@/core/axios";

export const newsService = {
  async getAll() {
    const res = await api.get("/news");
    return res.data?.data?.news || [];
  },

  async getById(id) {
    const res = await api.get(`/news/${id}`);
    return res.data?.data?.news;
  },

  async create(formData) {
    const res = await api.post("/news", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data?.data?.news;
  },

  async update(id, formData) {
    const res = await api.put(`/news/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data?.data?.news;
  },

  async remove(id) {
    const res = await api.delete(`/news/${id}`);
    return res.data;
  },
};
