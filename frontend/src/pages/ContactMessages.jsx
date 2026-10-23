import { useState, useEffect, useCallback } from "react";
import { Mail, MessageSquare, Inbox } from "lucide-react";
import { contactApi } from "@/api";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import Loader from "@/components/common/Loader";
import ErrorState from "@/components/common/ErrorState";
import { formatDate } from "@/utils";

export default function ContactMessages() {
  useDocumentTitle("Contact Messages — GiveHope");

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await contactApi.getAll();
      setMessages(data);
      setLoading(false);
    } catch {
      setError("Failed to load messages. Please try again.");
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) return <Loader />;
  if (error) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <ErrorState message={error} onRetry={fetchData} />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center gap-3 mb-8">
        <span className="flex items-center justify-center w-11 h-11 rounded-xl bg-teal-50 text-teal-600">
          <Inbox className="w-5 h-5" />
        </span>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Contact Messages
          </h1>
          <p className="text-sm text-gray-500">
            Messages submitted through the contact form.
          </p>
        </div>
      </div>

      {messages.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-2xl">
          <MessageSquare className="w-10 h-10 mx-auto mb-3 text-gray-300" />
          <p className="text-gray-500">No messages yet.</p>
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
                  Message
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {messages.map((m) => (
                <tr key={m.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3.5 text-sm font-medium text-gray-900">
                    {m.name}
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="flex items-center gap-1.5 text-sm text-gray-600">
                      <Mail className="w-3.5 h-3.5 text-gray-400" />
                      {m.email}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-sm text-gray-500 max-w-xs truncate">
                    {m.message}
                  </td>
                  <td className="px-4 py-3.5 text-sm text-gray-500">
                    {formatDate(m.date)}
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
