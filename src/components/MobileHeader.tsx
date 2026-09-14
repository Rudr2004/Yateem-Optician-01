import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Logo } from "./Logo";

interface MobileHeaderProps {
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  brand?: boolean;
  right?: React.ReactNode;
  light?: boolean;
}

export function MobileHeader({ title, subtitle, showBack, onBack, brand, right, light }: MobileHeaderProps) {
  const navigate = useNavigate();

  if (brand) {
    return (
      <div className="px-5 pt-[46px] pb-4 bg-gradient-to-b from-[var(--navy)] to-[var(--navy-deep)] flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center flex-shrink-0 text-white">
              <Logo size={22} />
            </div>
            <div>
              <div className="text-[10px] tracking-[0.18em] text-blue-200/80 font-semibold uppercase">
                Yateem Optician
              </div>
              <div className="text-[18px] font-bold text-white leading-tight mt-0.5">Smart Fit</div>
              <div className="text-[11px] text-blue-200/70 mt-0.5">Professional Frame Fitting</div>
            </div>
          </div>
          {right}
        </div>
      </div>
    );
  }

  const isDark = !light;

  return (
    <div
      className={`px-4 pt-[46px] pb-3.5 flex-shrink-0 flex items-center gap-2 ${
        isDark
          ? "bg-gradient-to-b from-[var(--navy)] to-[var(--navy-deep)]"
          : "bg-[var(--bg-card)] border-b border-[var(--border-soft)]"
      }`}
    >
      {showBack && (
        <button
          onClick={() => (onBack ? onBack() : navigate(-1))}
          className={`w-8 h-8 flex items-center justify-center rounded-full flex-shrink-0 transition-colors ${
            isDark
              ? "bg-white/10 active:bg-white/20 text-white"
              : "bg-[var(--bg-subtle)] active:bg-[var(--border-soft)] text-[var(--text-primary)]"
          }`}
        >
          <ChevronLeft size={18} />
        </button>
      )}
      <div className="flex-1 truncate">
        <h1
          className={`text-[16px] font-bold truncate ${isDark ? "text-white" : "text-[var(--text-primary)]"}`}
        >
          {title}
        </h1>
        {subtitle && (
          <p className={`text-[11px] truncate ${isDark ? "text-blue-200/70" : "text-[var(--text-secondary)]"}`}>
            {subtitle}
          </p>
        )}
      </div>
      {right}
    </div>
  );
}
