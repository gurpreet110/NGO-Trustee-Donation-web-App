import { useState, useEffect, useCallback } from "react";
import { HeartHandshake, ArrowRight } from "lucide-react";
import { campaignApi } from "@/api";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import CampaignCard from "@/components/campaign/CampaignCard";
import DonateModal from "@/components/donation/DonateModal";
import Loader from "@/components/common/Loader";
import ErrorState from "@/components/common/ErrorState";

export default function Donate() {
  useDocumentTitle("Donate — GiveHope");

  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await campaignApi.getActive();
      setCampaigns(data);
      setLoading(false);
    } catch {
      setError("Failed to load active campaigns. Please try again.");
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDonateClick = (campaign) => {
    setSelectedCampaign(campaign);
  };

  const handleDonationSuccess = (amount) => {
    setCampaigns((current) =>
      current.map((campaign) =>
        campaign.id === selectedCampaign?.id
          ? { ...campaign, raised: Number(campaign.raised || 0) + Number(amount) }
          : campaign
      )
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-teal-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-teal-700">
            <HeartHandshake className="w-4 h-4" />
            Give with confidence
          </span>
          <h1 className="mt-4 text-3xl font-bold text-gray-900 sm:text-4xl">
            Support a cause that matters.
          </h1>
          <p className="mt-3 max-w-2xl text-gray-500">
            Every contribution helps fund education, healthcare, emergency relief,
            and community development projects managed by verified trustees.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 text-sm font-semibold text-teal-700">
          Real impact, transparent giving
          <ArrowRight className="w-4 h-4" />
        </div>
      </div>

      {error && !loading ? (
        <ErrorState message={error} onRetry={fetchData} />
      ) : null}

      {loading ? (
        <Loader />
      ) : campaigns.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-6 py-16 text-center">
          <p className="text-lg font-medium text-gray-700">No active campaigns are available right now.</p>
          <p className="mt-2 text-sm text-gray-500">Please check back soon for new fundraising opportunities.</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {campaigns.map((campaign) => (
            <CampaignCard
              key={campaign.id}
              campaign={campaign}
              onDonate={handleDonateClick}
            />
          ))}
        </div>
      )}

      {selectedCampaign && (
        <DonateModal
          campaign={selectedCampaign}
          open={true}
          onClose={() => setSelectedCampaign(null)}
          onSuccess={handleDonationSuccess}
        />
      )}
    </div>
  );
}
