import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Tag,
  Calendar,
  Target,
  TrendingUp,
  Heart,
  ArrowLeft,
} from "lucide-react";
import { campaignApi } from "@/api";
import { formatCurrency, formatDate, formatPercent } from "@/utils";
import { useAuth } from "@/hooks/useAuth";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import Loader from "@/components/common/Loader";
import ErrorState from "@/components/common/ErrorState";
import Button from "@/components/common/Button";
import ProgressBar from "@/components/campaign/ProgressBar";
import DonateModal from "@/components/donation/DonateModal";

export default function CampaignDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useDocumentTitle(campaign ? `${campaign.title} — GiveHope` : "Campaign — GiveHope");

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await campaignApi.getById(id);
      setCampaign(data);
      setLoading(false);
    } catch {
      setError("Failed to load campaign details. Please try again.");
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Called by DonateModal after a successful donation.
  const handleDonateSuccess = (amount) => {
    setCampaign((prev) =>
      prev ? { ...prev, raised: prev.raised + amount } : prev
    );
  };

  if (loading) return <Loader />;
  if (error) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <ErrorState message={error} onRetry={fetchData} />
      </div>
    );
  }
  if (!campaign)
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <p className="text-gray-500 text-lg">Campaign not found.</p>
      </div>
    );

  return (
    <div>
      {/* Hero image */}
      <div className="relative h-64 sm:h-96 bg-gray-200 overflow-hidden">
        <img
          src={campaign.image}
          alt={campaign.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10">
          <div className="max-w-4xl mx-auto">
            <button
              onClick={() => navigate("/campaigns")}
              className="inline-flex items-center gap-1.5 text-white/80 hover:text-white text-sm mb-3 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to campaigns
            </button>
            <div className="flex flex-wrap gap-2 mb-3">
              <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold bg-white/90 text-teal-700 rounded-full">
                <Tag className="w-3 h-3" />
                {campaign.category}
              </span>
              {campaign.status === "completed" && (
                <span className="px-3 py-1 text-xs font-semibold bg-teal-600 text-white rounded-full">
                  Fully Funded
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-4xl font-bold text-white max-w-2xl">
              {campaign.title}
            </h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Description */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">
                About this campaign
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {campaign.description}
              </p>
            </div>

            {/* Meta info */}
            <div className="flex flex-wrap gap-4 pt-4 border-t border-gray-100">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Calendar className="w-4 h-4 text-teal-600" />
                Deadline: {formatDate(campaign.deadline)}
              </div>
            </div>
          </div>

          {/* Donation sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 lg:sticky lg:top-24">
              <div className="mb-4">
                <div className="flex items-baseline justify-between mb-3">
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatCurrency(campaign.raised)}
                    </p>
                    <p className="text-sm text-gray-400">
                      raised of {formatCurrency(campaign.goal)}
                    </p>
                  </div>
                  <span className="text-2xl font-bold text-teal-600">
                    {formatPercent(campaign.raised, campaign.goal)}%
                  </span>
                </div>
                <ProgressBar raised={campaign.raised} goal={campaign.goal} />
              </div>

              {/* Mini stats */}
              <div className="grid grid-cols-3 gap-2 py-4 border-y border-gray-100 mb-4">
                {[
                  { icon: TrendingUp, label: "Raised", value: formatCurrency(campaign.raised) },
                  { icon: Target, label: "Goal", value: formatCurrency(campaign.goal) },
                  { icon: Heart, label: "Progress", value: `${formatPercent(campaign.raised, campaign.goal)}%` },
                ].map((s) => (
                  <div key={s.label} className="text-center">
                    <s.icon className="w-4 h-4 mx-auto text-teal-500 mb-1" />
                    <p className="text-sm font-bold text-gray-900">{s.value}</p>
                    <p className="text-[11px] text-gray-400">{s.label}</p>
                  </div>
                ))}
              </div>

              <Button
                fullWidth
                size="lg"
                onClick={() => setModalOpen(true)}
                disabled={campaign.status === "completed"}
              >
                {campaign.status === "completed" ? "Goal Reached" : "Donate Now"}
              </Button>
              {!isAuthenticated && campaign.status !== "completed" && (
                <p className="text-xs text-gray-400 text-center mt-2">
                  You'll need to sign in to complete your donation.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Donate modal (extracted component) */}
      <DonateModal
        campaign={campaign}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={handleDonateSuccess}
      />
    </div>
  );
}
