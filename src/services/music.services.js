import { api } from "@/core/axios";

export const musicService = {
  async getAll() {
    const res = await api.get("/music-releases");
    return res.data?.data?.releases || [];
  },

  async getById(id) {
    const res = await api.get(`/music-releases/${id}`);
    return res.data?.data?.release;
  },

  async create(formData) {
    const res = await api.post("/music-releases", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data?.data?.release;
  },

  async update(id, formData) {
    const res = await api.put(`/music-releases/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data?.data?.release;
  },

  async remove(id) {
    const res = await api.delete(`/music-releases/${id}`);
    return res.data;
  },
};
