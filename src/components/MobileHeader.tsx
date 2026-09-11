import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface MobileHeaderProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  brand?: boolean;
  right?: React.ReactNode;
}

export function MobileHeader({ title, showBack, onBack, brand, right }: MobileHeaderProps) {
  const navigate = useNavigate();

  if (brand) {
    return (
      <div className="px-5 pt-[46px] pb-4 bg-gradient-to-b from-[#131a2e] to-[#0a0e1a] border-b border-white/5 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[11px] tracking-[0.2em] text-indigo-300/70 font-medium uppercase">
              Yateem Optician
            </div>
            <div className="text-xl font-semibold text-white mt-0.5">Smart Fit</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Professional Frame Fitting</div>
          </div>
          {right}
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 pt-[46px] pb-3 bg-[#0a0e1a]/95 backdrop-blur border-b border-white/5 flex-shrink-0 flex items-center gap-2">
      {showBack && (
        <button
          onClick={() => (onBack ? onBack() : navigate(-1))}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 active:bg-white/10 text-white flex-shrink-0"
        >
          <ChevronLeft size={18} />
        </button>
      )}
      <h1 className="text-[16px] font-semibold text-white flex-1 truncate">{title}</h1>
      {right}
    </div>
  );
}
