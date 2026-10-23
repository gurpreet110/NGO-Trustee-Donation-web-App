import api from "./axios";

export const userApi = {
  getAll: async () => {
    const { data } = await api.get("/users");
    return data;
  },
  getById: async (id) => {
    const { data } = await api.get(`/users/${id}`);
    return data;
  },
  updateRole: async (userId, newRole) => {
    const { data } = await api.patch(`/users/${userId}/role`, { role: newRole });
    return data;
  },
};
