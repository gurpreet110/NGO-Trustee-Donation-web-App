import { useState, useEffect, useCallback } from "react";
import {
  HeartHandshake,
  Mail,
  Phone,
  MapPin,
  Search,
} from "lucide-react";
import { donationInquiryApi } from "@/api";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { formatDate } from "@/utils";
import Loader from "@/components/common/Loader";
import ErrorState from "@/components/common/ErrorState";

export default function DonationInquiries() {
  useDocumentTitle("Donation Inquiries — GiveHope");

  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  const fetchInquiries = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await donationInquiryApi.getAll();
      setInquiries(Array.isArray(data) ? data : []);
      setLoading(false);
    } catch {
      setError("Failed to load donation inquiries. Please ensure you are logged in with trustee permissions.");
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInquiries();
  }, [fetchInquiries]);

  const handleStatusChange = async (id, newStatus) => {
    setUpdatingId(id);
    try {
      const updated = await donationInquiryApi.updateStatus(id, newStatus);
      setInquiries((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status: updated.status } : item))
      );
    } catch {
      alert("Failed to update inquiry status. Please try again.");
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredInquiries = inquiries.filter((inq) => {
    if (statusFilter !== "all" && inq.status !== statusFilter) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = inq.name?.toLowerCase().includes(q);
      const matchEmail = inq.email?.toLowerCase().includes(q);
      const matchCampaign = inq.campaignTitle?.toLowerCase().includes(q);
      const matchInterest = inq.donationInterest?.toLowerCase().includes(q);
      return matchName || matchEmail || matchCampaign || matchInterest;
    }
    return true;
  });

  if (loading) return <Loader />;
  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <ErrorState message={error} onRetry={fetchInquiries} />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <span className="flex items-center justify-center w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-400 shadow-sm border border-teal-100 dark:border-teal-800/40">
            <HeartHandshake className="w-6 h-6" />
          </span>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
              Donation Inquiries
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Prospective donor inquiries submitted through the GiveHope donation form.
            </p>
          </div>
        </div>

        {/* Search & Status Filter */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search donor or campaign..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-3 py-2 text-xs bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-teal-500 placeholder-gray-400 dark:placeholder-gray-500"
            />
          </div>

          <div className="inline-flex rounded-xl bg-gray-100 dark:bg-gray-800/80 p-1 text-xs font-medium border border-transparent dark:border-gray-700/60">
            {["all", "new", "contacted", "closed"].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg capitalize transition-all ${
                  statusFilter === st
                    ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm font-semibold"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {filteredInquiries.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 dark:bg-gray-800/60 rounded-3xl border border-gray-100 dark:border-gray-700/60">
          <HeartHandshake className="w-12 h-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
          <p className="text-base font-semibold text-gray-700 dark:text-gray-200">No donation inquiries found</p>
          <p className="text-xs text-gray-400 dark:text-gray-400 mt-1">
            Inquiries submitted via the donation form will appear here for trustee coordination.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700/70 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 dark:bg-gray-900/60 border-b border-gray-100 dark:border-gray-700 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-3.5">Donor Details</th>
                  <th className="px-5 py-3.5">Campaign & Interest</th>
                  <th className="px-5 py-3.5">Intended Contribution</th>
                  <th className="px-5 py-3.5">Background</th>
                  <th className="px-5 py-3.5">Date</th>
                  <th className="px-5 py-3.5 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700/60">
                {filteredInquiries.map((inq) => (
                  <tr key={inq.id} className="hover:bg-gray-50/60 dark:hover:bg-gray-700/30 transition-colors">
                    {/* Donor Details */}
                    <td className="px-5 py-4">
                      <div className="font-bold text-gray-900 dark:text-white">{inq.name}</div>
                      <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 mt-1">
                        <Mail className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        <a href={`mailto:${inq.email}`} className="hover:text-teal-700 dark:hover:text-teal-400">
                          {inq.email}
                        </a>
                      </div>
                      {inq.phone && (
                        <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                          <Phone className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                          <span>{inq.phone}</span>
                        </div>
                      )}
                      {inq.location && (
                        <div className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-400 mt-0.5">
                          <MapPin className="w-3 h-3 shrink-0" />
                          <span>{inq.location}</span>
                        </div>
                      )}
                    </td>

                    {/* Campaign & Interest */}
                    <td className="px-5 py-4">
                      <span className="font-semibold text-gray-900 dark:text-white block line-clamp-1">
                        {inq.campaignTitle}
                      </span>
                      <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-100 dark:border-teal-800/50">
                        {inq.donationInterest}
                      </span>
                      {inq.message && (
                        <p className="mt-1.5 text-xs text-gray-600 dark:text-gray-300 line-clamp-2 italic bg-gray-50 dark:bg-gray-900/50 p-2 rounded-lg border border-transparent dark:border-gray-700/40">
                          "{inq.message}"
                        </p>
                      )}
                    </td>

                    {/* Intended Contribution */}
                    <td className="px-5 py-4">
                      <span className="font-bold text-gray-900 dark:text-white block">
                        {inq.intendedAmount || "Not specified"}
                      </span>
                      <span className="text-xs text-gray-400 dark:text-gray-400">
                        Range / Intended
                      </span>
                    </td>

                    {/* Background */}
                    <td className="px-5 py-4 text-xs">
                      <span className="font-semibold text-gray-700 dark:text-gray-300 block">
                        {inq.donorType}
                      </span>
                      {inq.occupation && (
                        <span className="text-gray-500 dark:text-gray-400 block">
                          {inq.occupation}
                        </span>
                      )}
                      {inq.incomeRange && inq.incomeRange !== "Prefer not to say" && (
                        <span className="text-gray-400 dark:text-gray-400 block text-[11px]">
                          Income: {inq.incomeRange}
                        </span>
                      )}
                    </td>

                    {/* Date */}
                    <td className="px-5 py-4 text-xs text-gray-500 dark:text-gray-400">
                      {formatDate(inq.createdAt || inq.date)}
                    </td>

                    {/* Status with Quick Toggle */}
                    <td className="px-5 py-4 text-right">
                      <select
                        value={inq.status}
                        disabled={updatingId === inq.id}
                        onChange={(e) => handleStatusChange(inq.id, e.target.value)}
                        className={`text-xs font-semibold px-2.5 py-1.5 rounded-lg border outline-none cursor-pointer transition-colors ${
                          inq.status === "new"
                            ? "bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800"
                            : inq.status === "contacted"
                            ? "bg-blue-50 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800"
                            : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600"
                        }`}
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="closed">Closed</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
