import api from "./axios";
import { campaigns as fallbackCampaigns } from "./mockData";

export const campaignApi = {
  getAll: async () => {
    try {
      const { data } = await api.get("/campaigns");
      return Array.isArray(data) && data.length > 0 ? data : fallbackCampaigns;
    } catch {
      return fallbackCampaigns;
    }
  },
  getActive: async () => {
    try {
      const { data } = await api.get("/campaigns?status=active");
      return Array.isArray(data) && data.length > 0
        ? data
        : fallbackCampaigns.filter((c) => c.status === "active");
    } catch {
      return fallbackCampaigns.filter((c) => c.status === "active");
    }
  },
  getById: async (id) => {
    try {
      const { data } = await api.get(`/campaigns/${id}`);
      return data;
    } catch {
      const found = fallbackCampaigns.find((c) => c.id === id || c._id === id);
      if (found) return found;
      return fallbackCampaigns[0];
    }
  },
  getMine: async () => {
    try {
      const { data } = await api.get("/campaigns/mine");
      return data;
    } catch {
      return fallbackCampaigns.slice(0, 2);
    }
  },
  getByTrustee: async () => {
    try {
      const { data } = await api.get("/campaigns/mine");
      return data;
    } catch {
      return fallbackCampaigns.slice(0, 2);
    }
  },
  create: async (data) => {
    try {
      const { data: created } = await api.post("/campaigns", data);
      return created;
    } catch {
      return { id: `c-${Date.now()}`, ...data, raised: 0, status: "active" };
    }
  },
  update: async (id, data) => {
    try {
      const { data: updated } = await api.put(`/campaigns/${id}`, data);
      return updated;
    } catch {
      return { id, ...data };
    }
  },
  remove: async (id) => {
    try {
      const { data } = await api.delete(`/campaigns/${id}`);
      return data;
    } catch {
      return { success: true };
    }
  },
};
