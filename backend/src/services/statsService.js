import { Campaign } from "../models/Campaign.js";
import { Donation } from "../models/Donation.js";
import { formatYearMonth } from "../utils/dates.js";

function lastTwelveMonths() {
  const now = new Date();
  const cursor = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
  cursor.setUTCMonth(cursor.getUTCMonth() - 11);
  const months = [];
  for (let i = 0; i < 12; i += 1) {
    months.push(formatYearMonth(cursor));
    cursor.setUTCMonth(cursor.getUTCMonth() + 1);
  }
  const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 11, 1));
  return { months, start };
}

export async function getDashboardStats() {
  const { months, start } = lastTwelveMonths();

  const [totals, campaignCounts, monthlyRows] = await Promise.all([
    Donation.aggregate([
      { $match: { status: "completed" } },
      {
        $group: {
          _id: null,
          totalRaised: { $sum: "$amount" },
          totalDonations: { $sum: 1 },
          donors: { $addToSet: "$user" },
        },
      },
    ]),
    Campaign.aggregate([
      {
        $group: {
          _id: null,
          totalCampaigns: { $sum: 1 },
          activeCampaigns: {
            $sum: { $cond: [{ $eq: ["$status", "active"] }, 1, 0] },
          },
        },
      },
    ]),
    Donation.aggregate([
      { $match: { status: "completed", createdAt: { $gte: start } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$createdAt", timezone: "UTC" } },
          total: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]),
  ]);

  const summary = totals[0] || { totalRaised: 0, totalDonations: 0, donors: [] };
  const campaigns = campaignCounts[0] || { totalCampaigns: 0, activeCampaigns: 0 };
  const monthlyMap = new Map(monthlyRows.map((row) => [row._id, row]));

  return {
    totalRaised: summary.totalRaised || 0,
    totalDonations: summary.totalDonations || 0,
    donorCount: summary.donors?.length || 0,
    activeCampaigns: campaigns.activeCampaigns || 0,
    totalCampaigns: campaigns.totalCampaigns || 0,
    monthly: months.map((month) => {
      const row = monthlyMap.get(month);
      return {
        month,
        total: row?.total || 0,
        count: row?.count || 0,
      };
    }),
  };
}
