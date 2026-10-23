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
};
