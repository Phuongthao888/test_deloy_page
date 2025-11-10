import { api } from "@/core/axios";

export const tagService = {
  async getAll() {
    const res = await api.get("/tags");
    return res.data?.data?.tags || [];
  },

  async create(name) {
    const res = await api.post("/tags", { name });
    return res.data?.data?.tag;
  },

  async remove(id) {
    const res = await api.delete(`/tags/${id}`);
    return res.data;
  },
};
