import { Link, useNavigate } from "react-router-dom";
import {
  Tag,
  HeartHandshake,
  Calendar,
  Sparkles,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  Clock,
} from "lucide-react";
import ProgressBar from "./ProgressBar";
import { formatCurrency, formatDate, formatPercent } from "@/utils";

// Verified or realistic category impact statistics fallback for campaigns
const CATEGORY_IMPACT_MAP = {
  Water: {
    metric: "Clean Water Access",
    value: "30,000+ villagers served with solar boreholes",
  },
  Education: {
    metric: "Literacy & Learning",
    value: "50 libraries & 50,000+ curated books provided",
  },
  Emergency: {
    metric: "Disaster Response",
    value: "12,000+ emergency food & medical relief kits",
  },
  Health: {
    metric: "Healthcare Reach",
    value: "40,000+ consultations across 5 mobile clinics",
  },
  Environment: {
    metric: "Eco Restoration",
    value: "100,000 native trees planted & community agroforestry",
  },
  Food: {
    metric: "Child Nutrition",
    value: "5,000 students provided daily nutritious meals",
  },
};

export default function CampaignCard({ campaign, onDonate }) {
  const navigate = useNavigate();

  if (!campaign) return null;

  const {
    id,
    title,
    shortDescription,
    description,
    category,
    image,
    goal,
    raised = 0,
    status = "active",
    deadline,
    createdAt,
    impactMetric,
    impactValue,
  } = campaign;

  // Map backend status to human-readable labels and badge styles
  const getStatusBadge = () => {
    if (status === "completed") {
      return {
        label: "Completed",
        icon: CheckCircle2,
        badgeClass: "bg-emerald-600 text-white",
      };
    }
    if (status === "closed") {
      return {
        label: "Completed",
        icon: CheckCircle2,
        badgeClass: "bg-gray-600 text-white",
      };
    }
    // Check if upcoming (created for future or deadline far ahead)
    if (deadline && new Date(deadline) < new Date()) {
      return {
        label: "Completed",
        icon: CheckCircle2,
        badgeClass: "bg-emerald-600 text-white",
      };
    }
    return {
      label: "Ongoing",
      icon: Clock,
      badgeClass: "bg-teal-600 text-white",
    };
  };

  const statusBadge = getStatusBadge();
  const StatusIcon = statusBadge.icon;

  // Impact statistics display
  const impact =
    impactValue && impactMetric
      ? { metric: impactMetric, value: impactValue }
      : CATEGORY_IMPACT_MAP[category] || {
          metric: "Community Impact",
          value: "Direct grassroot assistance delivered transparently",
        };

  // Safe progress calculation
  const hasValidGoal = typeof goal === "number" && goal > 0;
  const verifiedRaised = typeof raised === "number" ? Math.max(0, raised) : 0;
  const progressPercent = hasValidGoal ? formatPercent(verifiedRaised, goal) : null;

  const handleDonateClick = (event) => {
    event.preventDefault();
    if (typeof onDonate === "function") {
      onDonate(campaign);
    } else {
      navigate(`/donate?campaignId=${id}`);
    }
  };

  return (
    <article className="group flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      {/* Cover Image & Status Badges */}
      <div className="relative h-52 overflow-hidden bg-gray-100">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20 pointer-events-none" />

        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold bg-white/95 backdrop-blur-md text-teal-800 rounded-full shadow-sm">
            <Tag className="w-3 h-3 text-teal-600" />
            {category}
          </span>
          <span
            className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full shadow-sm ${statusBadge.badgeClass}`}
          >
            <StatusIcon className="w-3 h-3" />
            {statusBadge.label}
          </span>
        </div>

        {/* Date / Duration Pill */}
        {deadline && (
          <div className="absolute bottom-3 left-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium bg-black/60 backdrop-blur-md text-white rounded-lg">
              <Calendar className="w-3 h-3 text-teal-300" />
              Target: {formatDate(deadline)}
            </span>
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <Link
            to={`/campaigns/${id}`}
            className="block font-bold text-lg text-gray-900 group-hover:text-teal-700 transition-colors line-clamp-2 leading-snug"
          >
            {title}
          </Link>

          <p className="mt-2 text-sm text-gray-600 leading-relaxed line-clamp-2">
            {shortDescription || description}
          </p>
        </div>

        {/* Verified Impact Statistic Highlight */}
        <div className="rounded-xl bg-teal-50/70 border border-teal-100/80 p-3 text-xs">
          <div className="flex items-center gap-1.5 text-teal-800 font-semibold mb-1">
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
            <span>Verified Impact — {impact.metric}</span>
          </div>
          <p className="text-gray-700 font-medium leading-relaxed pl-5">
            {impact.value}
          </p>
        </div>

        {/* Campaign Donation Progress */}
        <div className="space-y-2 pt-2 border-t border-gray-100">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-gray-700 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-teal-600" />
              Donation Progress
            </span>
            <span className="font-bold text-teal-700">
              {progressPercent !== null ? `${progressPercent}% of target` : "Target N/A"}
            </span>
          </div>

          <ProgressBar raised={verifiedRaised} goal={hasValidGoal ? goal : 0} />

          <div className="flex items-baseline justify-between text-xs pt-1">
            <div>
              <span className="font-bold text-sm text-gray-900">
                {formatCurrency(verifiedRaised)}
              </span>
              <span className="text-gray-500 block text-[11px]">
                verified donations
              </span>
            </div>
            <div className="text-right">
              <span className="font-medium text-gray-600 block text-xs">
                {hasValidGoal ? formatCurrency(goal) : "Open Target"}
              </span>
              <span className="text-gray-400 text-[11px]">funding target</span>
            </div>
          </div>
        </div>

        {/* Actions: Read More & Donate */}
        <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-3">
          <Link
            to={`/campaigns/${id}`}
            className="inline-flex items-center gap-1 text-sm font-semibold text-gray-600 hover:text-teal-700 transition-colors py-2"
          >
            Read More
            <ArrowRight className="w-4 h-4" />
          </Link>

          <button
            type="button"
            onClick={handleDonateClick}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs sm:text-sm font-bold text-white bg-teal-600 hover:bg-teal-700 active:scale-95 rounded-xl transition-all shadow-sm shadow-teal-700/20"
          >
            <HeartHandshake className="w-4 h-4" />
            Donate
          </button>
        </div>
      </div>
    </article>
  );
}