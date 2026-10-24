import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { CheckCircle2, AlertCircle, X } from "lucide-react";

const ToastContext = createContext(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const show = useCallback((message, variant = "success") => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, variant }]);
  }, []);

  const toast = useCallback(
    (message, variant = "success") => show(message, variant),
    [show]
  );

  return (
    <ToastContext.Provider value={{ toast, dismiss }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onDismiss={() => dismiss(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({ toast, onDismiss }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onDismiss, 200);
    }, 4000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  const isSuccess = toast.variant === "success";
  const Icon = isSuccess ? CheckCircle2 : AlertCircle;

  return (
    <div
      className={[
        "flex items-start gap-3 p-4 rounded-xl shadow-xl border pointer-events-auto transition-all duration-200",
        isSuccess
          ? "bg-white dark:bg-gray-800 border-teal-100 dark:border-teal-900/60"
          : "bg-white dark:bg-gray-800 border-red-100 dark:border-red-900/60",
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2",
      ].join(" ")}
    >
      <span
        className={[
          "flex items-center justify-center w-8 h-8 rounded-lg shrink-0",
          isSuccess ? "bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400" : "bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400",
        ].join(" ")}
      >
        <Icon className="w-4 h-4" />
      </span>
      <p className="text-sm font-medium text-gray-900 dark:text-white flex-1 pt-1">
        {toast.message}
      </p>
      <button
        onClick={onDismiss}
        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors shrink-0"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
