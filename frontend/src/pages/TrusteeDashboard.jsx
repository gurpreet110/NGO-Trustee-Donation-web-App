import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  TrendingUp,
  Receipt,
  Target,
  ArrowRight,
} from "lucide-react";
import { campaignApi, donationApi } from "@/api";
import { useAuth } from "@/hooks/useAuth";
import { ROLES, formatCurrency } from "@/utils";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import Loader from "@/components/common/Loader";
import ErrorState from "@/components/common/ErrorState";
import StatCard from "@/components/dashboard/StatCard";
import CampaignCard from "@/components/campaign/CampaignCard";
import DonationChart from "@/components/dashboard/DonationChart";

export default function TrusteeDashboard() {
  useDocumentTitle("Dashboard — GiveHope");

  const { user, role } = useAuth();
  const [myCampaigns, setMyCampaigns] = useState([]);
  const [allDonations, setAllDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const [campaigns, donations] = await Promise.all([
        role === ROLES.ADMIN ? campaignApi.getAll() : campaignApi.getMine(),
        donationApi.getAll(),
      ]);
      setMyCampaigns(campaigns);
      setAllDonations(donations);
      setLoading(false);
    } catch {
      setError("Failed to load dashboard data. Please try again.");
      setLoading(false);
    }
  }, [user, role]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) return <Loader />;
  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <ErrorState message={error} onRetry={fetchData} />
      </div>
    );
  }

  // Calculate dashboard metrics.
  const totalRaised = myCampaigns.reduce((sum, c) => sum + c.raised, 0);
  const campaignDonations = allDonations.filter((d) =>
    myCampaigns.some((c) => c.id === d.campaignId)
  );
  const activeCampaigns = myCampaigns.filter((c) => c.status === "active").length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center gap-3 mb-8">
        <span className="flex items-center justify-center w-11 h-11 rounded-xl bg-teal-50 text-teal-600">
          <LayoutDashboard className="w-5 h-5" />
        </span>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Trustee Dashboard
          </h1>
          <p className="text-sm text-gray-500">
            Overview of your campaigns and their performance.
          </p>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
        <StatCard
          label="Total Raised"
          value={formatCurrency(totalRaised)}
          icon={TrendingUp}
          accent="teal"
        />
        <StatCard
          label="Total Donations"
          value={campaignDonations.length}
          icon={Receipt}
          accent="blue"
        />
        <StatCard
          label="Active Campaigns"
          value={activeCampaigns}
          icon={Target}
          accent="amber"
        />
      </div>

      {/* Donation charts */}
      <div className="mb-10">
        <DonationChart donations={campaignDonations} />
      </div>

      {/* My campaigns */}
      <div className="mb-8">
        <div className="flex items-end justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">My Campaigns</h2>
          <Link
            to="/campaigns"
            className="inline-flex items-center gap-1 text-sm font-semibold text-teal-600 hover:text-teal-700"
          >
            All campaigns <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {myCampaigns.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-2xl">
            <p className="text-gray-500">You don't have any campaigns yet.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {myCampaigns.map((c) => (
              <CampaignCard key={c.id} campaign={c} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
