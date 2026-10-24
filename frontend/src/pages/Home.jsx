import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  Heart,
  Users,
  Globe2,
  HandHeart,
  ArrowRight,
  ShieldCheck,
  Target,
  TrendingUp,
} from "lucide-react";
import { campaignApi, donationApi } from "@/api";
import { useAuth } from "@/hooks/useAuth";
import { formatCurrency } from "@/utils";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import CampaignCard from "@/components/campaign/CampaignCard";
import ErrorState from "@/components/common/ErrorState";

export default function Home() {
  useDocumentTitle("GiveHope — Donate to Verified Campaigns");

  const { user } = useAuth();
  const [featured, setFeatured] = useState([]);
  const [stats, setStats] = useState({ totalRaised: 0, totalDonors: 0, totalCampaigns: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const campaigns = await campaignApi.getActive();
      const totalRaised = campaigns.reduce((sum, campaign) => sum + Number(campaign.raised || 0), 0);

      let totalDonors = 0;
      const canLoadAdminStats = user?.role === "trustee" || user?.role === "admin";
      if (canLoadAdminStats) {
        try {
          const allDonations = await donationApi.getAll();
          totalDonors = new Set(allDonations.map((d) => d.userId)).size;
        } catch {
          totalDonors = 0;
        }
      }

      setFeatured(campaigns.slice(0, 3));
      setStats({
        totalRaised,
        totalDonors,
        totalCampaigns: campaigns.length,
      });
      setLoading(false);
    } catch {
      setError("Failed to load campaigns. Please try again.");
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (error && !loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ErrorState message={error} onRetry={fetchData} />
      </div>
    );
  }

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-teal-600 via-teal-700 to-teal-800 text-white">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: "radial-gradient(circle at 20% 50%, white 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/15 backdrop-blur rounded-full text-sm font-medium mb-6">
              <Heart className="w-4 h-4" />
              Over ₹2 Cr raised for communities in need
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight mb-6">
              Your generosity changes lives.
            </h1>
            <p className="text-lg sm:text-xl text-teal-50 leading-relaxed mb-8 max-w-2xl">
              Join thousands of donors supporting clean water, education, healthcare,
              and emergency relief projects across the globe. Every contribution,
              big or small, makes a measurable impact.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to="/campaigns"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-white text-teal-700 font-semibold rounded-xl hover:bg-teal-50 transition-colors shadow-lg active:scale-[0.98]"
              >
                Explore Campaigns
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/donate"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-white/10 backdrop-blur text-white font-semibold rounded-xl hover:bg-white/20 transition-colors border border-white/20"
              >
                Donate Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { icon: TrendingUp, label: "Total Raised", value: formatCurrency(stats.totalRaised) },
              { icon: Users, label: "Active Donors", value: stats.totalDonors },
              { icon: Target, label: "Active Campaigns", value: stats.totalCampaigns },
            ].map((s) => (
              <div key={s.label} className="flex items-center gap-4">
                <span className="flex items-center justify-center w-12 h-12 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 shrink-0 border border-teal-100/50 dark:border-teal-800/40">
                  <s.icon className="w-6 h-6" />
                </span>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{s.value}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{s.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured campaigns */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              Featured Campaigns
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Urgent causes that need your support today.
            </p>
          </div>
          <Link
            to="/campaigns"
            className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 transition-colors"
          >
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-100 dark:bg-gray-800/60 rounded-2xl h-80 animate-pulse border border-transparent dark:border-gray-800" />
            ))}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((c) => (
              <CampaignCard key={c.id} campaign={c} />
            ))}
          </div>
        )}

        <div className="sm:hidden mt-6">
          <Link
            to="/campaigns"
            className="inline-flex items-center gap-1 text-sm font-semibold text-teal-600 dark:text-teal-400"
          >
            View all campaigns <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Value props */}
      <section className="bg-gray-50 dark:bg-gray-900/50 py-16 transition-colors border-y border-gray-100 dark:border-gray-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              Why donors trust GiveHope
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-xl mx-auto">
              We believe in transparency, accountability, and real impact.
            </p>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { icon: ShieldCheck, title: "Transparent & Verified", desc: "Every campaign is reviewed and verified by our board of trustees before going live." },
              { icon: HandHeart, title: "Direct Impact", desc: "100% of your donation goes to the cause. We show you exactly where every rupee goes." },
              { icon: Globe2, title: "Global Reach", desc: "Supporting communities across 30+ countries with on-the-ground local partners." },
            ].map((v) => (
              <div
                key={v.title}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700/70 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
              >
                <span className="flex items-center justify-center w-12 h-12 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 mb-4 border border-teal-100/50 dark:border-teal-800/40">
                  <v.icon className="w-6 h-6" />
                </span>
                <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">{v.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 dark:from-gray-800 dark:via-gray-900 dark:to-teal-950 rounded-3xl px-6 py-12 sm:px-12 sm:py-16 text-center text-white border border-gray-800 dark:border-gray-700 shadow-2xl">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            Ready to make a difference?
          </h2>
          <p className="text-gray-300 dark:text-gray-300 max-w-xl mx-auto mb-8">
            Browse our active campaigns and find a cause that resonates with you.
            Every donation, no matter the size, brings us closer to our goals.
          </p>
          <Link
            to="/campaigns"
            className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-teal-600 hover:bg-teal-500 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-teal-900/30 active:scale-[0.98]"
          >
            Browse Campaigns
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
