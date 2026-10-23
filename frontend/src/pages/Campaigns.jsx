import { useState, useEffect, useCallback } from "react";
import { campaignApi } from "@/api";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import CampaignCard from "@/components/campaign/CampaignCard";
import Loader from "@/components/common/Loader";
import ErrorState from "@/components/common/ErrorState";

export default function Campaigns() {
  useDocumentTitle("All Campaigns — GiveHope");

  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await campaignApi.getAll();
      setCampaigns(data);
      setLoading(false);
    } catch {
      setError("Failed to load campaigns. Please try again.");
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Derive unique categories from campaigns for filter chips.
  const categories = ["all", ...new Set(campaigns.map((c) => c.category))];
  const filtered =
    filter === "all" ? campaigns : campaigns.filter((c) => c.category === filter);

  if (error && !loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <ErrorState message={error} onRetry={fetchData} />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
          All Campaigns
        </h1>
        <p className="text-gray-500">
          Find a cause you care about and make a direct impact.
        </p>
      </div>

      {/* Filter chips */}
      {!loading && (
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={[
                "px-4 py-2 text-sm font-medium rounded-full transition-colors capitalize",
                filter === cat
                  ? "bg-teal-600 text-white"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-teal-300 hover:text-teal-700",
              ].join(" ")}
            >
              {cat === "all" ? "All Campaigns" : cat}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <Loader />
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-2xl">
          <p className="text-gray-500">No campaigns found in this category.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((c) => (
            <CampaignCard key={c.id} campaign={c} />
          ))}
        </div>
      )}
    </div>
  );
}
