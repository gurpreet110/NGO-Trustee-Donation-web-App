import api from "./axios";

export const campaignApi = {
  getAll: async () => {
    const { data } = await api.get("/campaigns");
    return data;
  },
  getActive: async () => {
    const { data } = await api.get("/campaigns?status=active");
    return data;
  },
  getById: async (id) => {
    const { data } = await api.get(`/campaigns/${id}`);
    return data;
  },
  getMine: async () => {
    const { data } = await api.get("/campaigns/mine");
    return data;
  },
  getByTrustee: async () => {
    const { data } = await api.get("/campaigns/mine");
    return data;
  },
  create: async (data) => {
    const { data: created } = await api.post("/campaigns", data);
    return created;
  },
  update: async (id, data) => {
    const { data: updated } = await api.put(`/campaigns/${id}`, data);
    return updated;
  },
  remove: async (id) => {
    const { data } = await api.delete(`/campaigns/${id}`);
    return data;
  },
};
