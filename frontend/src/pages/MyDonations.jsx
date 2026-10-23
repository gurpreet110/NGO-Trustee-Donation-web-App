import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Receipt, Heart } from "lucide-react";
import { donationApi } from "@/api";
import { useAuth } from "@/hooks/useAuth";
import { formatCurrency } from "@/utils";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import Loader from "@/components/common/Loader";
import ErrorState from "@/components/common/ErrorState";
import DonationTable from "@/components/donation/DonationTable";

export default function MyDonations() {
  useDocumentTitle("My Donations — GiveHope");

  const { user } = useAuth();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const data = await donationApi.getByUser(user.id);
      setDonations(data);
      setLoading(false);
    } catch {
      setError("Failed to load your donations. Please try again.");
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const totalDonated = donations.reduce((sum, d) => sum + d.amount, 0);

  if (loading) return <Loader />;
  if (error) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <ErrorState message={error} onRetry={fetchData} />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center gap-3 mb-8">
        <span className="flex items-center justify-center w-11 h-11 rounded-xl bg-teal-50 text-teal-600">
          <Receipt className="w-5 h-5" />
        </span>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Donations</h1>
          <p className="text-sm text-gray-500">Track your contributions and impact.</p>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <p className="text-sm text-gray-500 mb-1">Total Donated</p>
          <p className="text-2xl font-bold text-teal-700">{formatCurrency(totalDonated)}</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <p className="text-sm text-gray-500 mb-1">Campaigns Supported</p>
          <p className="text-2xl font-bold text-gray-900">{donations.length}</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <p className="text-sm text-gray-500 mb-1">Lives Impacted</p>
          <p className="text-2xl font-bold text-gray-900">
            {Math.round(totalDonated / 25)}
          </p>
        </div>
      </div>

      {/* Table */}
      <DonationTable donations={donations} />

      {donations.length === 0 && (
        <div className="text-center mt-6">
          <p className="text-gray-500 mb-4">
            You haven't made any donations yet.
          </p>
          <Link
            to="/campaigns"
            className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 text-white font-semibold rounded-xl hover:bg-teal-700 transition-colors"
          >
            <Heart className="w-4 h-4" />
            Browse Campaigns
          </Link>
        </div>
      )}
    </div>
  );
}
