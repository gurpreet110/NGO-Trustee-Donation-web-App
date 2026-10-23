// Utility helpers for formatting and app-wide constants.

export const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

export const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

export const formatPercent = (raised, goal) => {
  if (goal <= 0) return 0;
  return Math.min(Math.round((raised / goal) * 100), 100);
};

// Role hierarchy and display names.
export const ROLES = {
  VISITOR: "visitor",
  DONOR: "donor",
  TRUSTEE: "trustee",
  ADMIN: "admin",
};

export const ROLE_LABELS = {
  visitor: "Visitor",
  donor: "Donor",
  trustee: "Trustee",
  admin: "Admin",
};
