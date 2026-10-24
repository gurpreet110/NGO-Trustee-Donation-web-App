import api from "./axios";
import { trustees as fallbackTrustees } from "./mockData";

export const trusteeApi = {
  getAll: async () => {
    try {
      const { data } = await api.get("/trustees");
      return Array.isArray(data) && data.length > 0 ? data : fallbackTrustees;
    } catch {
      return fallbackTrustees;
    }
  },
  getById: async (id) => {
    try {
      const { data } = await api.get(`/trustees/${id}`);
      return data;
    } catch {
      return fallbackTrustees.find((t) => t.id === id) || fallbackTrustees[0];
    }
  },
  create: async (payload) => {
    try {
      const { data } = await api.post("/trustees", payload);
      return data;
    } catch {
      return { id: `t-${Date.now()}`, ...payload };
    }
  },
  update: async (id, payload) => {
    try {
      const { data } = await api.put(`/trustees/${id}`, payload);
      return data;
    } catch {
      return { id, ...payload };
    }
  },
  remove: async (id) => {
    try {
      const { data } = await api.delete(`/trustees/${id}`);
      return data;
    } catch {
      return { success: true };
    }
  },
};
