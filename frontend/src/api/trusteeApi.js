import api from "./axios";

export const trusteeApi = {
  getAll: async () => {
    const { data } = await api.get("/trustees");
    return data;
  },
  getById: async (id) => {
    const { data } = await api.get(`/trustees/${id}`);
    return data;
  },
  create: async (payload) => {
    const { data } = await api.post("/trustees", payload);
    return data;
  },
  update: async (id, payload) => {
    const { data } = await api.put(`/trustees/${id}`, payload);
    return data;
  },
  remove: async (id) => {
    const { data } = await api.delete(`/trustees/${id}`);
    return data;
  },
};
