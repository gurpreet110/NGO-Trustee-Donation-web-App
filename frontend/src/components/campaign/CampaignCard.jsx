import { Link } from "react-router-dom";
import { Tag } from "lucide-react";
import ProgressBar from "./ProgressBar";
import { formatCurrency } from "@/utils";

// Card showing a campaign summary for list views.
export default function CampaignCard({ campaign }) {
  const { id, title, shortDescription, category, image, goal, raised, status } =
    campaign;

  return (
    <Link
      to={`/campaigns/${id}`}
      className="group block bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden bg-gray-100">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold bg-white/90 backdrop-blur text-teal-700 rounded-full">
            <Tag className="w-3 h-3" />
            {category}
          </span>
          {status === "completed" && (
            <span className="px-2.5 py-1 text-xs font-semibold bg-teal-600 text-white rounded-full">
              Funded
            </span>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="p-5 space-y-4">
        <h3 className="font-bold text-base text-gray-900 group-hover:text-teal-700 transition-colors line-clamp-2">
          {title}
        </h3>
        <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">
          {shortDescription}
        </p>

        <ProgressBar raised={raised} goal={goal} />

        <div className="flex justify-between items-center pt-1">
          <div>
            <span className="block text-sm font-bold text-gray-900">
              {formatCurrency(raised)}
            </span>
            <span className="text-xs text-gray-400">
              of {formatCurrency(goal)} goal
            </span>
          </div>
          <span className="text-sm font-semibold text-teal-600 group-hover:text-teal-700">
            View &rarr;
          </span>
        </div>
      </div>
    </Link>
  );
}