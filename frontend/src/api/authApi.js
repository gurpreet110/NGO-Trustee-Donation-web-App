import api from "./axios";

export const authApi = {
  login: async (email, password) => {
    const normalizedEmail = String(email ?? "").trim().toLowerCase();
    const normalizedPassword = String(password ?? "");

    const { data } = await api.post("/auth/login", {
      email: normalizedEmail,
      password: normalizedPassword,
    });
    return data;
  },
  register: async ({ name, email, password }) => {
    const { data } = await api.post("/auth/register", {
      name: String(name ?? "").trim(),
      email: String(email ?? "").trim().toLowerCase(),
      password: String(password ?? ""),
    });
    return data;
  },
};
