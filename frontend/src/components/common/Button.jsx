import { Loader2 } from "lucide-react";

// Variant → Tailwind classes map for consistent button styling.
const variants = {
  primary:
    "bg-teal-600 text-white hover:bg-teal-700 focus-visible:ring-teal-500 shadow-sm",
  secondary:
    "bg-white dark:bg-gray-800 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-700 hover:bg-teal-50 dark:hover:bg-gray-700 focus-visible:ring-teal-400",
  ghost:
    "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white focus-visible:ring-gray-300 dark:focus-visible:ring-gray-600",
  danger:
    "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500 shadow-sm",
  dark: "bg-gray-900 dark:bg-gray-800 text-white hover:bg-gray-800 dark:hover:bg-gray-700 border border-transparent dark:border-gray-700 focus-visible:ring-gray-600 shadow-sm",
};

const sizes = {
  sm: "px-3 py-1.5 text-sm rounded-lg gap-1.5",
  md: "px-5 py-2.5 text-sm rounded-lg gap-2",
  lg: "px-7 py-3.5 text-base rounded-xl gap-2",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  type = "button",
  loading = false,
  disabled = false,
  className = "",
  onClick,
  fullWidth = false,
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={[
        "inline-flex items-center justify-center font-semibold transition-all",
        "focus-visible:ring-2 focus-visible:ring-offset-2 focus:outline-none",
        "disabled:cursor-not-allowed disabled:opacity-60",
        "active:scale-[0.98]",
        variants[variant] ?? variants.primary,
        sizes[size] ?? sizes.md,
        fullWidth ? "w-full" : "",
        className,
      ].join(" ")}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  );
}
