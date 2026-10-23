import { useState, useEffect, useCallback } from "react";
import { Users, Plus, Pencil, Trash2 } from "lucide-react";
import { trusteeApi } from "@/api";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { useToast } from "@/components/common/Toast";
import Loader from "@/components/common/Loader";
import ErrorState from "@/components/common/ErrorState";
import Button from "@/components/common/Button";
import Modal from "@/components/common/Modal";

const emptyForm = {
  name: "",
  role: "Board Member",
  bio: "",
  image: "",
};

export default function ManageTrustees() {
  useDocumentTitle("Manage Trustees — GiveHope");

  const { toast } = useToast();
  const [trustees, setTrustees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const loadTrustees = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await trusteeApi.getAll();
      setTrustees(data);
      setLoading(false);
    } catch {
      setError("Failed to load trustees. Please try again.");
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTrustees();
  }, [loadTrustees]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (trustee) => {
    setEditing(trustee);
    setForm({
      name: trustee.name || "",
      role: trustee.role || "Board Member",
      bio: trustee.bio || "",
      image: trustee.image || "",
    });
    setModalOpen(true);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.name.trim() || !form.role.trim()) {
      toast("Name and role are required.", "error");
      return;
    }

    setSubmitting(true);
    try {
      if (editing) {
        await trusteeApi.update(editing.id, form);
        toast("Trustee updated successfully.");
      } else {
        await trusteeApi.create(form);
        toast("Trustee created successfully.");
      }
      setModalOpen(false);
      setEditing(null);
      setForm(emptyForm);
      loadTrustees();
    } catch (err) {
      toast(err?.response?.data?.message || "Failed to save trustee.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await trusteeApi.remove(deleteTarget.id);
      toast("Trustee deleted successfully.");
      setDeleteTarget(null);
      loadTrustees();
    } catch (err) {
      toast(err?.response?.data?.message || "Failed to delete trustee.", "error");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
            <Users className="h-5 w-5" />
          </span>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Manage Trustees</h1>
            <p className="text-sm text-gray-500">Update the board members shown on the public trustees page.</p>
          </div>
        </div>

        <Button onClick={openCreate} size="md">
          <Plus className="h-4 w-4" />
          Add Trustee
        </Button>
      </div>

      {error && !loading ? (
        <ErrorState message={error} onRetry={loadTrustees} />
      ) : null}

      {loading ? (
        <Loader />
      ) : trustees.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 py-16 text-center">
          <p className="text-gray-500">No trustees have been added yet.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {trustees.map((trustee) => (
            <div
              key={trustee.id}
              className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="relative h-56 bg-gray-100">
                <img
                  src={trustee.image || "https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&w=900&q=80"}
                  alt={trustee.name}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                  <h2 className="text-lg font-bold text-white">{trustee.name}</h2>
                  <p className="text-sm text-white/80">{trustee.role}</p>
                </div>
              </div>

              <div className="p-5">
                <p className="line-clamp-4 text-sm leading-relaxed text-gray-500">{trustee.bio}</p>
                <div className="mt-5 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => openEdit(trustee)}
                    className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-teal-50 hover:text-teal-600"
                    aria-label="Edit trustee"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteTarget(trustee)}
                    className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
                    aria-label="Delete trustee"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditing(null);
          setForm(emptyForm);
        }}
        title={editing ? "Edit Trustee" : "Add Trustee"}
        size="lg"
      >
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Full name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
              placeholder="Jane Smith"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Role</label>
            <input
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
              placeholder="Board Chair"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Image URL</label>
            <input
              name="image"
              value={form.image}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
              placeholder="https://example.com/profile.jpg"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Bio</label>
            <textarea
              name="bio"
              value={form.bio}
              onChange={handleChange}
              rows="4"
              className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
              placeholder="Brief profile summary"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={submitting}>
              {editing ? "Save Changes" : "Create Trustee"}
            </Button>
          </div>
        </form>
      </Modal>

      <Modal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Confirm Delete" size="sm">
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Are you sure you want to remove <span className="font-semibold text-gray-800">{deleteTarget?.name}</span> from the trustee board?
          </p>
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
