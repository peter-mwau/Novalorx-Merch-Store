import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { CheckCircle2, Loader2, X, XCircle } from "lucide-react";

const ToastContext = createContext(null);

const styles = {
  success: { icon: CheckCircle2, className: "text-emerald-400" },
  error: { icon: XCircle, className: "text-red-400" },
  loading: { icon: Loader2, className: "animate-spin text-cyan-400" },
};

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = "success", duration = 3500) => {
    const id = Date.now();
    setToast({ id, message, type });
    if (duration > 0) {
      window.setTimeout(() => {
        setToast((current) => (current?.id === id ? null : current));
      }, duration);
    }
    return id;
  }, []);

  const dismissToast = useCallback(() => setToast(null), []);
  const value = useMemo(() => ({ showToast, dismissToast }), [dismissToast, showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastViewport toast={toast} onDismiss={dismissToast} />
    </ToastContext.Provider>
  );
}

export function ToastViewport({ toast, onDismiss, className = "" }) {
  if (!toast) return null;
  const { icon: Icon, className: iconClass } = styles[toast.type] || styles.success;

  return (
    <div className={`pointer-events-none fixed right-4 top-4 z-[200] ${className}`}>
      <div className="pointer-events-auto flex max-w-sm items-center gap-3 rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white shadow-2xl">
        <Icon size={18} className={iconClass} />
        <span>{toast.message}</span>
        <button type="button" onClick={onDismiss} aria-label="Dismiss notification">
          <X size={16} className="text-slate-400 hover:text-white" />
        </button>
      </div>
    </div>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used inside a ToastProvider");
  return context;
}
