// Stat card for dashboard summary metrics.
export default function StatCard({ label, value, icon: Icon, accent = "teal" }) {
  const accents = {
    teal: "bg-teal-50 text-teal-600",
    blue: "bg-blue-50 text-blue-600",
    amber: "bg-amber-50 text-amber-600",
    green: "bg-green-50 text-green-600",
    rose: "bg-rose-50 text-rose-600",
  };

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-gray-500 mb-1">{label}</p>
          <p className="text-2xl font-bold text-gray-900 truncate">{value}</p>
        </div>
        {Icon && (
          <span
            className={`flex items-center justify-center w-11 h-11 rounded-xl shrink-0 ${
              accents[accent] ?? accents.teal
            }`}
          >
            <Icon className="w-5 h-5" />
          </span>
        )}
      </div>
    </div>
  );
}
