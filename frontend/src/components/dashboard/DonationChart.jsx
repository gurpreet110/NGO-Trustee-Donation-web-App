import { useState, useMemo } from "react";
import { formatCurrency } from "@/utils";
import { BarChart3 } from "lucide-react";

// Build last 6 month labels ending in the current month.
function getLast6Months() {
  const months = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({
      key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`,
      label: d.toLocaleDateString("en-US", { month: "short" }),
      total: 0,
    });
  }
  return months;
}

// Aggregate donations into last-6-months buckets.
function aggregateByMonth(donations) {
  const months = getLast6Months();
  const map = new Map(months.map((m) => [m.key, m]));
  donations.forEach((d) => {
    const key = d.date.slice(0, 7); // "YYYY-MM"
    const entry = map.get(key);
    if (entry) entry.total += d.amount;
  });
  return months;
}

// Aggregate donations per campaign title.
function aggregateByCampaign(donations) {
  const map = new Map();
  donations.forEach((d) => {
    const current = map.get(d.campaignTitle) ?? 0;
    map.set(d.campaignTitle, current + d.amount);
  });
  return Array.from(map.entries())
    .map(([title, total]) => ({ title, total }))
    .sort((a, b) => b.total - a.total);
}

// Pure SVG bar chart of donations per month for the last 6 months.
export function MonthlyDonationChart({ donations = [] }) {
  const [hovered, setHovered] = useState(null);

  const monthlyData = useMemo(() => aggregateByMonth(donations), [donations]);
  const maxVal = Math.max(...monthlyData.map((m) => m.total), 1);

  // Chart dimensions.
  const width = 100; // relative units, viewBox scales
  const height = 50;
  const barWidth = 10;
  const gap = (width - monthlyData.length * barWidth) / (monthlyData.length + 1);
  const chartHeight = height - 12; // leave room for labels

  if (donations.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">
          Donations per Month
        </h3>
        <div className="flex flex-col items-center justify-center py-12 text-gray-400">
          <BarChart3 className="w-10 h-10 mb-2 text-gray-300" />
          <p className="text-sm">No donation data yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
      <h3 className="text-sm font-semibold text-gray-900 mb-4">
        Donations per Month (Last 6 Months)
      </h3>
      <div className="relative">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Y-axis grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((t) => (
            <line
              key={t}
              x1="0"
              y1={chartHeight * (1 - t) + 2}
              x2={width}
              y2={chartHeight * (1 - t) + 2}
              stroke="#f3f4f6"
              strokeWidth="0.3"
            />
          ))}

          {/* Bars */}
          {monthlyData.map((m, i) => {
            const x = gap + i * (barWidth + gap);
            const barH = maxVal > 0 ? (m.total / maxVal) * chartHeight : 0;
            const y = chartHeight - barH + 2;
            const isHovered = hovered === i;
            return (
              <g key={m.key}>
                <rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={barH}
                  rx="1"
                  className={isHovered ? "fill-teal-600" : "fill-teal-400"}
                  style={{ transition: "fill 0.15s" }}
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                />
                {/* Month label */}
                <text
                  x={x + barWidth / 2}
                  y={height - 1}
                  textAnchor="middle"
                  fontSize="3.5"
                  fill="#9ca3af"
                >
                  {m.label}
                </text>
                {/* Hover tooltip */}
                {isHovered && m.total > 0 && (
                  <g>
                    <rect
                      x={x + barWidth / 2 - 12}
                      y={y - 9}
                      width="24"
                      height="6"
                      rx="1"
                      fill="#1f2937"
                    />
                    <text
                      x={x + barWidth / 2}
                      y={y - 4.5}
                      textAnchor="middle"
                      fontSize="3"
                      fill="white"
                    >
                      {formatCurrency(m.total)}
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

// Horizontal bar list showing donations per campaign.
export function CampaignDonationList({ donations = [] }) {
  const campaignData = useMemo(
    () => aggregateByCampaign(donations),
    [donations]
  );
  const maxVal = Math.max(...campaignData.map((c) => c.total), 1);

  if (donations.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">
          Donations per Campaign
        </h3>
        <div className="flex flex-col items-center justify-center py-12 text-gray-400">
          <BarChart3 className="w-10 h-10 mb-2 text-gray-300" />
          <p className="text-sm">No campaign donation data yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
      <h3 className="text-sm font-semibold text-gray-900 mb-4">
        Donations per Campaign
      </h3>
      <div className="space-y-3">
        {campaignData.map((c) => (
          <div key={c.title}>
            <div className="flex justify-between items-baseline mb-1">
              <span className="text-xs text-gray-600 truncate pr-2">
                {c.title}
              </span>
              <span className="text-xs font-semibold text-teal-700 shrink-0">
                {formatCurrency(c.total)}
              </span>
            </div>
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-teal-400 to-teal-600 rounded-full transition-all duration-700"
                style={{ width: `${(c.total / maxVal) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Default export bundles both charts for convenience.
export default function DonationChart({ donations = [] }) {
  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <MonthlyDonationChart donations={donations} />
      <CampaignDonationList donations={donations} />
    </div>
  );
}
