// Animated progress bar showing campaign funding progress.
export default function ProgressBar({ raised, goal, className = "" }) {
  const percent = goal > 0 ? Math.min((raised / goal) * 100, 100) : 0;
  const isComplete = percent >= 100;

  return (
    <div className={className}>
      <div className="flex justify-between items-baseline mb-1.5">
        <span className={`text-sm font-semibold ${isComplete ? "text-teal-700" : "text-gray-700"}`}>
          {Math.round(percent)}%
        </span>
        <span className="text-xs text-gray-400">
          {isComplete ? "Goal reached!" : "funded"}
        </span>
      </div>
      <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1000 ease-out ${
            isComplete
              ? "bg-gradient-to-r from-teal-500 to-teal-700"
              : "bg-gradient-to-r from-teal-400 to-teal-600"
          }`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
