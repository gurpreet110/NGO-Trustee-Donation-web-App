import api from "./axios";

export const donationInquiryApi = {
  create: async (inquiryData) => {
    const { data } = await api.post("/donation-inquiries", inquiryData);
    return data;
  },
  getAll: async (params) => {
    const { data } = await api.get("/donation-inquiries", { params });
    return data;
  },
  updateStatus: async (id, status) => {
    const { data } = await api.patch(`/donation-inquiries/${id}/status`, { status });
    return data;
  },
};
