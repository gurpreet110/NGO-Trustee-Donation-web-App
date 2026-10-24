import api from "./axios";

export const donationInquiryApi = {
  create: async (inquiryData) => {
    try {
      const { data } = await api.post("/donation-inquiries", inquiryData);
      return data;
    } catch {
      // Offline fallback: save locally
      try {
        const stored = JSON.parse(localStorage.getItem("givehope_offline_inquiries") || "[]");
        stored.push({ id: `inq-${Date.now()}`, ...inquiryData, createdAt: new Date().toISOString() });
        localStorage.setItem("givehope_offline_inquiries", JSON.stringify(stored));
      } catch {
        // ignore
      }
      return { success: true, message: "Donation inquiry received", inquiry: inquiryData };
    }
  },
  getAll: async (params) => {
    try {
      const { data } = await api.get("/donation-inquiries", { params });
      return data;
    } catch {
      try {
        return JSON.parse(localStorage.getItem("givehope_offline_inquiries") || "[]");
      } catch {
        return [];
      }
    }
  },
  updateStatus: async (id, status) => {
    try {
      const { data } = await api.patch(`/donation-inquiries/${id}/status`, { status });
      return data;
    } catch {
      return { id, status };
    }
  },
};
