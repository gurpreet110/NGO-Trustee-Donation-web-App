import { donations } from "./mockData";
import { delay } from "./delay";

export const donationApi = {
  getByUser: (userId) =>
    delay(donations.filter((d) => d.userId === userId)),
  getAll: () => delay(donations),
  create: ({ userId, campaignId, campaignTitle, amount }) => {
    const newDonation = {
      id: `d${Date.now()}`,
      userId,
      campaignId,
      campaignTitle,
      amount: Number(amount),
      date: new Date().toISOString().split("T")[0],
      status: "completed",
    };
    donations.push(newDonation);
    return delay(newDonation);
  },
};
