import { useState, useEffect, useCallback } from "react";
import { Users, Shield, TrendingUp, CheckCircle2 } from "lucide-react";
import { userApi, campaignApi, donationApi } from "@/api";
import { ROLES, ROLE_LABELS, formatCurrency, formatDate } from "@/utils";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { useToast } from "@/components/common/Toast";
import Loader from "@/components/common/Loader";
import ErrorState from "@/components/common/ErrorState";
import StatCard from "@/components/dashboard/StatCard";

// Role dropdown options for the users table.
const ROLE_OPTIONS = [ROLES.DONOR, ROLES.TRUSTEE, ROLES.ADMIN];

export default function AdminPanel() {
  useDocumentTitle("Admin Panel — GiveHope");

  const { toast } = useToast();
  const [users, setUsers] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [u, c, d] = await Promise.all([
        userApi.getAll(),
        campaignApi.getAll(),
        donationApi.getAll(),
      ]);
      setUsers(u);
      setCampaigns(c);
      setDonations(d);
      setLoading(false);
    } catch {
      setError("Failed to load admin data. Please try again.");
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const totalRaised = donations.reduce((sum, d) => sum + d.amount, 0);

  const handleRoleChange = async (userId, newRole) => {
    setUpdating(userId);
    try {
      await userApi.updateRole(userId, newRole);
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
      );
      toast(`User role updated to ${ROLE_LABELS[newRole]}.`);
    } catch {
      toast("Failed to update user role.", "error");
    } finally {
      setUpdating(null);
    }
  };

  if (loading) return <Loader />;
  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <ErrorState message={error} onRetry={fetchData} />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center gap-3 mb-8">
        <span className="flex items-center justify-center w-11 h-11 rounded-xl bg-teal-50 text-teal-600">
          <Shield className="w-5 h-5" />
        </span>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Admin Panel</h1>
          <p className="text-sm text-gray-500">
            Manage users, campaigns, and platform-wide settings.
          </p>
        </div>
      </div>

      {/* Platform stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        <StatCard label="Total Users" value={users.length} icon={Users} accent="teal" />
        <StatCard label="Total Campaigns" value={campaigns.length} icon={TrendingUp} accent="blue" />
        <StatCard label="Total Raised" value={formatCurrency(totalRaised)} icon={TrendingUp} accent="green" />
        <StatCard
          label="Total Donations"
          value={donations.length}
          icon={CheckCircle2}
          accent="amber"
        />
      </div>

      {/* Users table with role management */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">User Management</h2>
      </div>

      {users.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-2xl">
          <p className="text-gray-500">No users to display.</p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-2xl border border-gray-100 shadow-sm">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Donated
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Role
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3.5 text-sm font-medium text-gray-900">
                    {u.name}
                  </td>
                  <td className="px-4 py-3.5 text-sm text-gray-500">{u.email}</td>
                  <td className="px-4 py-3.5 text-sm text-gray-500">
                    {formatDate(u.joinedDate)}
                  </td>
                  <td className="px-4 py-3.5 text-sm font-semibold text-teal-700">
                    {formatCurrency(u.totalDonated)}
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="relative inline-block">
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u.id, e.target.value)}
                        disabled={updating === u.id}
                        className={[
                          "appearance-none pl-3 pr-8 py-1.5 text-sm font-medium rounded-lg border cursor-pointer transition-colors",
                          u.role === ROLES.ADMIN
                            ? "bg-amber-50 text-amber-700 border-amber-200"
                            : u.role === ROLES.TRUSTEE
                            ? "bg-blue-50 text-blue-700 border-blue-200"
                            : "bg-gray-50 text-gray-700 border-gray-200",
                          "hover:border-teal-300 focus:ring-2 focus:ring-teal-500 outline-none",
                          updating === u.id ? "opacity-50" : "",
                        ].join(" ")}
                      >
                        {ROLE_OPTIONS.map((r) => (
                          <option key={r} value={r}>
                            {ROLE_LABELS[r]}
                          </option>
                        ))}
                      </select>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
