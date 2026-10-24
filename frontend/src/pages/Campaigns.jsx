import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Search,
  SlidersHorizontal,
  Sparkles,
  HeartHandshake,
  CheckCircle2,
  Clock,
  ArrowUpDown,
  BookOpen,
} from "lucide-react";
import { campaignApi } from "@/api";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import CampaignCard from "@/components/campaign/CampaignCard";
import Loader from "@/components/common/Loader";
import ErrorState from "@/components/common/ErrorState";

export default function Campaigns() {
  useDocumentTitle("Campaign Blog & Impact Stories — GiveHope");

  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await campaignApi.getAll();
      setCampaigns(data || []);
      setLoading(false);
    } catch {
      setError("Failed to load campaigns and impact stories. Please try again.");
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Derive categories from data
  const categories = useMemo(() => {
    const unique = new Set(campaigns.map((c) => c.category).filter(Boolean));
    return ["all", ...Array.from(unique)];
  }, [campaigns]);

  // Aggregate high-level verified impact metrics across all loaded campaigns
  const aggregateStats = useMemo(() => {
    const totalRaised = campaigns.reduce((acc, c) => acc + (Number(c.raised) || 0), 0);
    const completedCount = campaigns.filter((c) => c.status === "completed").length;
    const ongoingCount = campaigns.filter((c) => c.status === "active").length;

    return {
      totalCampaigns: campaigns.length,
      completedCount,
      ongoingCount,
      totalRaised,
    };
  }, [campaigns]);

  // Filtering & Sorting
  const filteredCampaigns = useMemo(() => {
    return campaigns
      .filter((c) => {
        // Category filter
        if (selectedCategory !== "all" && c.category !== selectedCategory) {
          return false;
        }

        // Status filter: "ongoing" -> active; "completed" -> completed or closed
        if (selectedStatus === "ongoing" && c.status !== "active") {
          return false;
        }
        if (
          selectedStatus === "completed" &&
          c.status !== "completed" &&
          c.status !== "closed"
        ) {
          return false;
        }

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = c.title?.toLowerCase().includes(q);
          const matchDesc = c.description?.toLowerCase().includes(q) || c.shortDescription?.toLowerCase().includes(q);
          const matchCategory = c.category?.toLowerCase().includes(q);
          if (!matchTitle && !matchDesc && !matchCategory) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "raised") {
          return (b.raised || 0) - (a.raised || 0);
        }
        if (sortBy === "goal") {
          return (b.goal || 0) - (a.goal || 0);
        }
        // Default newest
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      });
  }, [campaigns, selectedCategory, selectedStatus, searchQuery, sortBy]);

  const handleResetFilters = () => {
    setSelectedCategory("all");
    setSelectedStatus("all");
    setSearchQuery("");
    setSortBy("newest");
  };

  if (error && !loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <ErrorState message={error} onRetry={fetchData} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      {/* Blog & Impact Header */}
      <div className="bg-gradient-to-b from-teal-900 to-teal-800 text-white pt-16 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-700/60 border border-teal-500/30 text-teal-200 text-xs font-semibold mb-4">
            <BookOpen className="w-3.5 h-3.5" />
            GiveHope NGO Impact & Campaign Journal
          </div>

          <div className="grid lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-8">
              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
                Our Work, Campaigns & Verified Community Impact
              </h1>
              <p className="mt-4 text-base sm:text-lg text-teal-100/90 max-w-3xl leading-relaxed">
                Explore GiveHope's completed initiatives, ongoing relief operations, and field reports.
                Every campaign is overseen by verified trustees with 100% transparent tracking.
              </p>
            </div>

            {/* Quick summary stats */}
            <div className="lg:col-span-4 grid grid-cols-2 gap-3">
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-3.5 border border-white/10">
                <div className="flex items-center gap-1.5 text-teal-200 text-xs font-medium mb-1">
                  <Clock className="w-3.5 h-3.5" />
                  Ongoing Causes
                </div>
                <div className="text-2xl font-bold text-white">
                  {aggregateStats.ongoingCount}
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-xl p-3.5 border border-white/10">
                <div className="flex items-center gap-1.5 text-teal-200 text-xs font-medium mb-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Completed Projects
                </div>
                <div className="text-2xl font-bold text-white">
                  {aggregateStats.completedCount}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content & Controls */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        {/* Search & Filter Bar */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-5 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search campaigns, causes, or locations..."
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all"
              />
            </div>

            {/* Status & Sort Controls */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Status Selector */}
              <div className="inline-flex rounded-xl bg-gray-100 p-1 text-xs font-medium text-gray-600">
                <button
                  type="button"
                  onClick={() => setSelectedStatus("all")}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    selectedStatus === "all"
                      ? "bg-white text-gray-900 shadow-sm font-semibold"
                      : "hover:text-gray-900"
                  }`}
                >
                  All Status
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedStatus("ongoing")}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    selectedStatus === "ongoing"
                      ? "bg-teal-600 text-white shadow-sm font-semibold"
                      : "hover:text-gray-900"
                  }`}
                >
                  Ongoing
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedStatus("completed")}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    selectedStatus === "completed"
                      ? "bg-emerald-600 text-white shadow-sm font-semibold"
                      : "hover:text-gray-900"
                  }`}
                >
                  Completed
                </button>
              </div>

              {/* Sort Dropdown */}
              <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-medium text-gray-700">
                <ArrowUpDown className="w-3.5 h-3.5 text-gray-400" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent border-none outline-none cursor-pointer pr-2 font-medium"
                >
                  <option value="newest">Latest Added</option>
                  <option value="raised">Most Funded</option>
                  <option value="goal">Highest Target</option>
                </select>
              </div>
            </div>
          </div>

          {/* Category Filter Chips */}
          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100 overflow-x-auto no-scrollbar pb-1">
            <span className="text-xs font-medium text-gray-400 shrink-0 flex items-center gap-1">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Causes:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all shrink-0 capitalize ${
                  selectedCategory === cat
                    ? "bg-teal-700 text-white shadow-sm"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {cat === "all" ? "All Causes" : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Campaign Cards Grid */}
        {loading ? (
          <div className="py-20">
            <Loader />
          </div>
        ) : filteredCampaigns.length === 0 ? (
          <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center max-w-xl mx-auto shadow-sm my-8">
            <div className="w-14 h-14 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">
              No matching campaigns found
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              Try adjusting your search criteria or resetting filters to see all initiatives.
            </p>
            <button
              type="button"
              onClick={handleResetFilters}
              className="px-5 py-2.5 rounded-xl bg-teal-600 text-white text-sm font-semibold hover:bg-teal-700 transition-colors shadow-sm"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-6 text-sm text-gray-500">
              <p>
                Showing <span className="font-bold text-gray-900">{filteredCampaigns.length}</span>{" "}
                {filteredCampaigns.length === 1 ? "campaign" : "campaigns"}
              </p>
              <div className="flex items-center gap-2 text-xs text-teal-700 font-medium">
                <HeartHandshake className="w-4 h-4" />
                Verified Trustee Initiatives
              </div>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCampaigns.map((c) => (
                <CampaignCard key={c.id} campaign={c} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
