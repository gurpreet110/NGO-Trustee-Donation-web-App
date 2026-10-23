import { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Pencil, Trash2, FolderOpen } from "lucide-react";
import { campaignApi } from "@/api";
import { useAuth } from "@/hooks/useAuth";
import { ROLES, formatCurrency, formatDate } from "@/utils";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { useToast } from "@/components/common/Toast";
import Loader from "@/components/common/Loader";
import ErrorState from "@/components/common/ErrorState";
import Button from "@/components/common/Button";
import Modal from "@/components/common/Modal";
import CampaignForm from "@/components/campaign/CampaignForm";

export default function ManageCampaigns() {
  useDocumentTitle("Manage Campaigns — GiveHope");

  const { user, role } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const loadCampaigns = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const data =
        role === ROLES.ADMIN
          ? await campaignApi.getAll()
          : await campaignApi.getByTrustee(user.id);
      setCampaigns(data);
      setLoading(false);
    } catch {
      setError("Failed to load campaigns. Please try again.");
      setLoading(false);
    }
  }, [user, role]);

  useState(() => {
    loadCampaigns();
  });

  const openCreate = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const openEdit = (campaign) => {
    setEditing(campaign);
    setModalOpen(true);
  };

  const handleSubmit = async (values) => {
    setSubmitting(true);
    try {
      if (editing) {
        await campaignApi.update(editing.id, values);
        toast("Campaign updated successfully.");
      } else {
        await campaignApi.create({ ...values, trusteeId: user.id });
        toast("Campaign created successfully.");
      }
      setModalOpen(false);
      setEditing(null);
      loadCampaigns();
    } catch {
      toast("Failed to save campaign.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await campaignApi.remove(deleteTarget.id);
      toast("Campaign deleted successfully.");
      setDeleteTarget(null);
      loadCampaigns();
    } catch {
      toast("Failed to delete campaign.", "error");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <Loader />;
  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <ErrorState message={error} onRetry={loadCampaigns} />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <span className="flex items-center justify-center w-11 h-11 rounded-xl bg-teal-50 text-teal-600">
            <FolderOpen className="w-5 h-5" />
          </span>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Manage Campaigns
            </h1>
            <p className="text-sm text-gray-500">
              Create, edit, and manage your campaigns.
            </p>
          </div>
        </div>
        <Button onClick={openCreate} size="md">
          <Plus className="w-4 h-4" />
          New Campaign
        </Button>
      </div>

      {/* Table */}
      {campaigns.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-2xl">
          <p className="text-gray-500 mb-4">No campaigns yet.</p>
          <Button onClick={openCreate} size="md">
            <Plus className="w-4 h-4" />
            Create your first campaign
          </Button>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-2xl border border-gray-100 shadow-sm">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Campaign
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Goal
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Raised
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Deadline
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {campaigns.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3.5">
                    <button
                      onClick={() => navigate(`/campaigns/${c.id}`)}
                      className="text-sm font-medium text-gray-900 hover:text-teal-700 text-left"
                    >
                      {c.title}
                    </button>
                    <p className="text-xs text-gray-400">{c.category}</p>
                  </td>
                  <td className="px-4 py-3.5 text-sm text-gray-600">
                    {formatCurrency(c.goal)}
                  </td>
                  <td className="px-4 py-3.5 text-sm font-semibold text-teal-700">
                    {formatCurrency(c.raised)}
                  </td>
                  <td className="px-4 py-3.5 text-sm text-gray-500">
                    {formatDate(c.deadline)}
                  </td>
                  <td className="px-4 py-3.5">
                    <span
                      className={[
                        "inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-full capitalize",
                        c.status === "active"
                          ? "bg-green-50 text-green-700"
                          : c.status === "completed"
                          ? "bg-teal-50 text-teal-700"
                          : "bg-gray-100 text-gray-600",
                      ].join(" ")}
                    >
                      {c.status}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => openEdit(c)}
                        className="p-2 text-gray-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                        aria-label="Edit"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      {role === ROLES.ADMIN && (
                        <button
                          onClick={() => setDeleteTarget(c)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          aria-label="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create/Edit modal */}
      <Modal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditing(null);
        }}
        title={editing ? "Edit Campaign" : "Create Campaign"}
        size="lg"
      >
        <CampaignForm
          initialValues={editing}
          onSubmit={handleSubmit}
          submitting={submitting}
          onCancel={() => {
            setModalOpen(false);
            setEditing(null);
          }}
        />
      </Modal>

      {/* Delete confirmation modal */}
      <Modal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Confirm Delete"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-gray-900">
              {deleteTarget?.title}
            </span>
            ? This action cannot be undone.
          </p>
          <div className="flex gap-3 justify-end">
            <Button
              variant="ghost"
              size="md"
              onClick={() => setDeleteTarget(null)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              size="md"
              loading={deleting}
              onClick={handleDelete}
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
