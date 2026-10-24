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
          <span className="flex items-center justify-center w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 shadow-sm border border-teal-100">
            <HeartHandshake className="w-6 h-6" />
          </span>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
              Donation Inquiries
            </h1>
            <p className="text-sm text-gray-500">
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
              className="pl-9 pr-3 py-2 text-xs bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="inline-flex rounded-xl bg-gray-100 p-1 text-xs font-medium">
            {["all", "new", "contacted", "closed"].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg capitalize transition-all ${
                  statusFilter === st
                    ? "bg-white text-gray-900 shadow-sm font-semibold"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {filteredInquiries.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-3xl border border-gray-100">
          <HeartHandshake className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p className="text-base font-semibold text-gray-700">No donation inquiries found</p>
          <p className="text-xs text-gray-400 mt-1">
            Inquiries submitted via the donation form will appear here for trustee coordination.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-3.5">Donor Details</th>
                  <th className="px-5 py-3.5">Campaign & Interest</th>
                  <th className="px-5 py-3.5">Intended Contribution</th>
                  <th className="px-5 py-3.5">Background</th>
                  <th className="px-5 py-3.5">Date</th>
                  <th className="px-5 py-3.5 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredInquiries.map((inq) => (
                  <tr key={inq.id} className="hover:bg-gray-50/60 transition-colors">
                    {/* Donor Details */}
                    <td className="px-5 py-4">
                      <div className="font-bold text-gray-900">{inq.name}</div>
                      <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-1">
                        <Mail className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        <a href={`mailto:${inq.email}`} className="hover:text-teal-700">
                          {inq.email}
                        </a>
                      </div>
                      {inq.phone && (
                        <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-0.5">
                          <Phone className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                          <span>{inq.phone}</span>
                        </div>
                      )}
                      {inq.location && (
                        <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-0.5">
                          <MapPin className="w-3 h-3 shrink-0" />
                          <span>{inq.location}</span>
                        </div>
                      )}
                    </td>

                    {/* Campaign & Interest */}
                    <td className="px-5 py-4">
                      <span className="font-semibold text-gray-900 block line-clamp-1">
                        {inq.campaignTitle}
                      </span>
                      <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium bg-teal-50 text-teal-700 border border-teal-100">
                        {inq.donationInterest}
                      </span>
                      {inq.message && (
                        <p className="mt-1.5 text-xs text-gray-500 line-clamp-2 italic bg-gray-50 p-2 rounded-lg">
                          "{inq.message}"
                        </p>
                      )}
                    </td>

                    {/* Intended Contribution */}
                    <td className="px-5 py-4">
                      <span className="font-bold text-gray-900 block">
                        {inq.intendedAmount || "Not specified"}
                      </span>
                      <span className="text-xs text-gray-400">
                        Range / Intended
                      </span>
                    </td>

                    {/* Background */}
                    <td className="px-5 py-4 text-xs">
                      <span className="font-semibold text-gray-700 block">
                        {inq.donorType}
                      </span>
                      {inq.occupation && (
                        <span className="text-gray-500 block">
                          {inq.occupation}
                        </span>
                      )}
                      {inq.incomeRange && inq.incomeRange !== "Prefer not to say" && (
                        <span className="text-gray-400 block text-[11px]">
                          Income: {inq.incomeRange}
                        </span>
                      )}
                    </td>

                    {/* Date */}
                    <td className="px-5 py-4 text-xs text-gray-500">
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
                            ? "bg-amber-50 text-amber-800 border-amber-200"
                            : inq.status === "contacted"
                            ? "bg-blue-50 text-blue-800 border-blue-200"
                            : "bg-gray-100 text-gray-700 border-gray-200"
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
