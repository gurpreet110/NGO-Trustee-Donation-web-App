import { formatCurrency, formatDate } from "@/utils";
import { openReceipt } from "@/utils/receipt";
import { useAuth } from "@/hooks/useAuth";
import { FileText } from "lucide-react";

// Reusable donations table with receipt button for completed donations.
export default function DonationTable({ donations: rows = [] }) {
  const { user } = useAuth();

  if (rows.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-2xl">
        <p className="text-gray-500">No donations yet.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto bg-white rounded-2xl border border-gray-100 shadow-sm">
      <table className="w-full">
        <thead>
          <tr className="bg-gray-50 text-left">
            <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Campaign
            </th>
            <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Amount
            </th>
            <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Date
            </th>
            <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">
              Receipt
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {rows.map((d) => (
            <tr key={d.id} className="hover:bg-gray-50/50 transition-colors">
              <td className="px-4 py-3.5 text-sm font-medium text-gray-900">
                {d.campaignTitle}
              </td>
              <td className="px-4 py-3.5 text-sm font-semibold text-teal-700">
                {formatCurrency(d.amount)}
              </td>
              <td className="px-4 py-3.5 text-sm text-gray-500">
                {formatDate(d.date)}
              </td>
              <td className="px-4 py-3.5">
                <span className="inline-flex items-center px-2.5 py-1 text-xs font-semibold bg-green-50 text-green-700 rounded-full">
                  {d.status}
                </span>
              </td>
              <td className="px-4 py-3.5 text-right">
                {d.status === "completed" && (
                  <button
                    onClick={() => openReceipt(d, user)}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-lg transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    Receipt
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
