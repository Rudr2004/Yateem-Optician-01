import type { ReactNode } from "react";
import { X } from "lucide-react";

interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export function BottomSheet({ open, onClose, title, children }: BottomSheetProps) {
  if (!open) return null;

  return (
    <div className="absolute inset-0 z-50 flex flex-col justify-end">
      <div
        className="absolute inset-0 bg-black/40 animate-fade-slide-up"
        style={{ animationDuration: "0.2s" }}
        onClick={onClose}
      />
      <div
        className="relative bg-[var(--bg-card)] border-t border-[var(--border-soft)] rounded-t-3xl p-5 pb-[max(24px,env(safe-area-inset-bottom))] animate-fade-slide-up shadow-[0_-8px_30px_-8px_rgba(15,23,42,0.15)]"
        style={{ animationDuration: "0.25s" }}
      >
        <div className="w-9 h-1 bg-[var(--border-soft)] rounded-full mx-auto mb-4" />
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[16px] font-bold text-[var(--text-primary)]">{title}</h3>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-[var(--bg-subtle)] flex items-center justify-center active:bg-[var(--border-soft)]"
          >
            <X size={14} className="text-[var(--text-secondary)]" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
