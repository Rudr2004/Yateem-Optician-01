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
        className="absolute inset-0 bg-black/60 animate-fade-slide-up"
        style={{ animationDuration: "0.2s" }}
        onClick={onClose}
      />
      <div
        className="relative bg-[#12162280] backdrop-blur-xl bg-[#131826] border-t border-white/10 rounded-t-3xl p-5 pb-[max(24px,env(safe-area-inset-bottom))] animate-fade-slide-up"
        style={{ animationDuration: "0.25s" }}
      >
        <div className="w-9 h-1 bg-white/15 rounded-full mx-auto mb-4" />
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[16px] font-semibold text-white">{title}</h3>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center active:bg-white/10"
          >
            <X size={14} className="text-slate-300" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
