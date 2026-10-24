import { useState, useEffect, useCallback } from "react";
import { trusteeApi } from "@/api";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import Loader from "@/components/common/Loader";
import ErrorState from "@/components/common/ErrorState";

export default function Trustees() {
  useDocumentTitle("Our Trustees — GiveHope");

  const [trustees, setTrustees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
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
    fetchData();
  }, [fetchData]);

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
      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3">
          Our Trustees
        </h1>
        <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
          Our board of trustees vets every campaign and ensures your donations
          reach the people who need them most.
        </p>
      </div>

      {trustees.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 dark:bg-gray-800/60 rounded-2xl border border-transparent dark:border-gray-700/60">
          <p className="text-gray-500 dark:text-gray-400">No trustees to display.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {trustees.map((t) => (
            <div
              key={t.id}
              className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700/70 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
            >
              {/* Photo */}
              <div className="relative h-64 bg-gray-100 dark:bg-gray-900 overflow-hidden">
                <img
                  src={t.image}
                  alt={t.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute bottom-3 left-4 right-4">
                  <h3 className="text-lg font-bold text-white">{t.name}</h3>
                  <p className="text-sm text-teal-300 font-medium">{t.role}</p>
                </div>
              </div>

              {/* Bio */}
              <div className="p-5">
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{t.bio}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
