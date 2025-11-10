import { api } from "@/core/axios";

export const eventService = {
  async getAll() {
    const res = await api.get("/events");
    return res.data?.data?.events || [];
  },

  async getById(id) {
    const res = await api.get(`/events/${id}`);
    return res.data?.data?.event || null;
  },

  async create(formData) {
    const res = await api.post("/events", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data?.data?.event;
  },

  async update(id, formData) {
    const res = await api.put(`/events/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data?.data?.event;
  },

  async remove(id) {
    const res = await api.delete(`/events/${id}`);
    return res.data;
  },
};
