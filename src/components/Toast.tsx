import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import { CheckCircle2 } from "lucide-react";

interface ToastContextValue {
  showToast: (message: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(null), 2200);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {message && (
        <div className="absolute bottom-24 left-0 right-0 flex justify-center z-[60] px-6 pointer-events-none">
          <div className="flex items-center gap-2 bg-[var(--navy)] text-white text-[13px] font-medium px-4 py-3 rounded-2xl shadow-2xl animate-fade-slide-up max-w-full">
            <CheckCircle2 size={16} className="text-emerald-400 flex-shrink-0" />
            <span className="truncate">{message}</span>
          </div>
        </div>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
