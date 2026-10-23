import { campaigns } from "./mockData";
import { delay } from "./delay";

export const campaignApi = {
  getAll: () => delay(campaigns),
  getActive: () => delay(campaigns.filter((c) => c.status === "active")),
  getById: (id) => delay(campaigns.find((c) => c.id === id)),
  getByTrustee: (trusteeId) =>
    delay(campaigns.filter((c) => c.trusteeId === trusteeId)),
  create: (data) => {
    const newCampaign = {
      id: `c${Date.now()}`,
      raised: 0,
      ...data,
    };
    campaigns.push(newCampaign);
    return delay(newCampaign);
  },
  update: (id, data) => {
    const campaign = campaigns.find((c) => c.id === id);
    if (campaign) Object.assign(campaign, data);
    return delay(campaign);
  },
  remove: (id) => {
    const idx = campaigns.findIndex((c) => c.id === id);
    if (idx !== -1) campaigns.splice(idx, 1);
    return delay({ success: true });
  },
};
