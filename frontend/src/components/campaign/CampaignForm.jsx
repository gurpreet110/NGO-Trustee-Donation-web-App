import { useState, useEffect } from "react";
import { AlertCircle } from "lucide-react";
import Button from "@/components/common/Button";

const CATEGORIES = [
  "Water",
  "Education",
  "Emergency",
  "Health",
  "Environment",
  "Food",
];
const STATUSES = ["active", "completed", "closed"];

const EMPTY_VALUES = {
  title: "",
  shortDescription: "",
  description: "",
  category: "Water",
  image: "",
  goal: "",
  deadline: "",
  status: "active",
};

// Validate form fields, returning an errors object (empty if valid).
function validate(values, isEdit) {
  const errors = {};
  if (!values.title.trim()) errors.title = "Title is required.";
  const goalNum = Number(values.goal);
  if (!values.goal || isNaN(goalNum) || goalNum <= 0) {
    errors.goal = "Goal must be a positive number.";
  }
  // Deadline cannot be in the past for new campaigns.
  if (!isEdit && values.deadline) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (new Date(values.deadline) < today) {
      errors.deadline = "Deadline cannot be in the past.";
    }
  }
  return errors;
}

// Reusable campaign create/edit form.
export default function CampaignForm({
  initialValues,
  onSubmit,
  submitting,
  onCancel,
}) {
  const isEdit = !!initialValues?.id;
  const [values, setValues] = useState(EMPTY_VALUES);
  const [errors, setErrors] = useState({});

  // Sync form when initialValues change (e.g. opening edit on a different campaign).
  useEffect(() => {
    if (initialValues) {
      setValues({
        title: initialValues.title ?? "",
        shortDescription: initialValues.shortDescription ?? "",
        description: initialValues.description ?? "",
        category: initialValues.category ?? "Water",
        image: initialValues.image ?? "",
        goal: initialValues.goal ? String(initialValues.goal) : "",
        deadline: initialValues.deadline ?? "",
        status: initialValues.status ?? "active",
      });
    } else {
      setValues(EMPTY_VALUES);
    }
    setErrors({});
  }, [initialValues]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    // Clear field error on change.
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate(values, isEdit);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    onSubmit({
      ...values,
      goal: Number(values.goal),
    });
  };

  const inputClass = (fieldName) =>
    [
      "w-full px-4 py-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all",
      errors[fieldName]
        ? "border-red-300 bg-red-50/30"
        : "border-gray-200",
    ].join(" ");

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Title */}
      <div>
        <label className="text-sm font-medium text-gray-700 mb-1.5 block">
          Title
        </label>
        <input
          type="text"
          name="title"
          value={values.title}
          onChange={handleChange}
          className={inputClass("title")}
          placeholder="Campaign title"
        />
        {errors.title && (
          <p className="flex items-center gap-1 mt-1 text-xs text-red-600">
            <AlertCircle className="w-3 h-3" />
            {errors.title}
          </p>
        )}
      </div>

      {/* Short description */}
      <div>
        <label className="text-sm font-medium text-gray-700 mb-1.5 block">
          Short Description
        </label>
        <input
          type="text"
          name="shortDescription"
          value={values.shortDescription}
          onChange={handleChange}
          className={inputClass("shortDescription")}
          placeholder="One-line summary"
        />
      </div>

      {/* Description */}
      <div>
        <label className="text-sm font-medium text-gray-700 mb-1.5 block">
          Full Description
        </label>
        <textarea
          name="description"
          rows={4}
          value={values.description}
          onChange={handleChange}
          className={inputClass("description") + " resize-none"}
          placeholder="Detailed campaign description"
        />
      </div>

      {/* Category + Status */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1.5 block">
            Category
          </label>
          <select
            name="category"
            value={values.category}
            onChange={handleChange}
            className={inputClass("category")}
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1.5 block">
            Status
          </label>
          <select
            name="status"
            value={values.status}
            onChange={handleChange}
            className={inputClass("status")}
          >
            {STATUSES.map((st) => (
              <option key={st} value={st} className="capitalize">
                {st}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Image URL */}
      <div>
        <label className="text-sm font-medium text-gray-700 mb-1.5 block">
          Image URL
        </label>
        <input
          type="url"
          name="image"
          value={values.image}
          onChange={handleChange}
          className={inputClass("image")}
          placeholder="https://..."
        />
      </div>

      {/* Goal + Deadline */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1.5 block">
            Goal Amount (₹)
          </label>
          <input
            type="number"
            name="goal"
            min="1"
            value={values.goal}
            onChange={handleChange}
            className={inputClass("goal")}
            placeholder="50000"
          />
          {errors.goal && (
            <p className="flex items-center gap-1 mt-1 text-xs text-red-600">
              <AlertCircle className="w-3 h-3" />
              {errors.goal}
            </p>
          )}
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1.5 block">
            Deadline
          </label>
          <input
            type="date"
            name="deadline"
            value={values.deadline}
            onChange={handleChange}
            className={inputClass("deadline")}
          />
          {errors.deadline && (
            <p className="flex items-center gap-1 mt-1 text-xs text-red-600">
              <AlertCircle className="w-3 h-3" />
              {errors.deadline}
            </p>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <Button type="submit" size="md" loading={submitting}>
          {isEdit ? "Save Changes" : "Create Campaign"}
        </Button>
        <Button variant="ghost" size="md" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
