import api from "./axios";

export const contactApi = {
  getAll: async () => {
    const { data } = await api.get("/contact");
    return data;
  },
  create: async ({ name, email, message }) => {
    const { data } = await api.post("/contact", { name, email, message });
    return data;
  },
};
