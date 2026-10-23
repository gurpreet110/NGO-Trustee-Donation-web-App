import api from "./axios";

export const donationApi = {
  getByUser: async () => {
    const { data } = await api.get("/donations/my");
    return data;
  },
  getAll: async () => {
    const { data } = await api.get("/donations");
    return data;
  },
  create: async ({ campaignId, amount }) => {
    const { data } = await api.post("/donations", { campaignId, amount: Number(amount) });
    return data;
  },
};
