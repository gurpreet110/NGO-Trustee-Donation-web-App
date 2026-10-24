// Animated progress bar showing campaign funding progress with accessibility attributes
export default function ProgressBar({ raised = 0, goal = 0, showHeader = false, className = "" }) {
  const safeGoal = typeof goal === "number" && !isNaN(goal) ? goal : 0;
  const safeRaised = typeof raised === "number" && !isNaN(raised) ? Math.max(0, raised) : 0;
  const percent = safeGoal > 0 ? Math.min((safeRaised / safeGoal) * 100, 100) : 0;
  const isComplete = percent >= 100;

  return (
    <div className={className}>
      {showHeader && (
        <div className="flex justify-between items-baseline mb-1.5">
          <span className={`text-sm font-semibold ${isComplete ? "text-teal-700" : "text-gray-700"}`}>
            {Math.round(percent)}%
          </span>
          <span className="text-xs text-gray-400">
            {isComplete ? "Goal reached!" : "funded"}
          </span>
        </div>
      )}
      <div className="w-full h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
        <div
          role="progressbar"
          aria-valuenow={Math.round(percent)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Campaign donation progress"
          className={`h-full rounded-full transition-all duration-1000 ease-out ${
            isComplete
              ? "bg-gradient-to-r from-emerald-500 to-teal-600"
              : "bg-gradient-to-r from-teal-400 to-teal-600"
          }`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
