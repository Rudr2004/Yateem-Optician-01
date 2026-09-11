import { useNavigate } from "react-router-dom";
import { ChevronRight, Camera, Clock, Tag, TrendingUp } from "lucide-react";
import { AppScreen } from "../components/ScreenContainer";
import { MobileHeader } from "../components/MobileHeader";
import { BottomNavigation } from "../components/BottomNavigation";
import { PrimaryButton } from "../components/Buttons";

export function HomeScreen() {
  const navigate = useNavigate();

  return (
    <AppScreen>
      <MobileHeader brand />
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-4 space-y-4 animate-fade-slide-up">
        <div className="bg-gradient-to-br from-[var(--navy)] to-[var(--navy-deep)] rounded-3xl p-5 shadow-[0_10px_30px_-10px_rgba(15,37,87,0.5)]">
          <div className="w-10 h-10 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center mb-3">
            <Camera size={18} className="text-blue-200" />
          </div>
          <h2 className="text-white text-[17px] font-bold mb-1.5">
            Ready for your next fitting?
          </h2>
          <p className="text-blue-100/80 text-[13px] leading-relaxed mb-4">
            Capture frame-fitting measurements and prepare a complete lens specification.
          </p>
          <PrimaryButton onClick={() => navigate("/customer")}>
            START NEW MEASUREMENT
          </PrimaryButton>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-2xl p-4 shadow-sm">
            <div className="text-[11px] text-[var(--text-muted)] mb-1">Today's Measurements</div>
            <div className="text-2xl font-bold text-[var(--text-primary)]">12</div>
          </div>
          <div className="bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-2xl p-4 shadow-sm">
            <div className="text-[11px] text-[var(--text-muted)] mb-1">Completed</div>
            <div className="text-2xl font-bold text-[var(--success)]">9</div>
          </div>
        </div>
        <div className="bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-2xl p-4 shadow-sm">
          <div className="text-[11px] text-[var(--text-muted)] mb-1">Pending</div>
          <div className="text-2xl font-bold text-[var(--warning)]">3</div>
        </div>

        <div className="space-y-2.5">
          <button
            onClick={() => navigate("/measure/results")}
            className="w-full flex items-center gap-3 bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-2xl p-4 active:bg-[var(--bg-subtle)] shadow-sm"
          >
            <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
              <Clock size={16} className="text-[var(--royal)]" />
            </div>
            <div className="flex-1 text-left">
              <div className="text-[14px] font-semibold text-[var(--text-primary)]">Recent Measurements</div>
              <div className="text-[11px] text-[var(--text-muted)]">View past fittings</div>
            </div>
            <ChevronRight size={16} className="text-[var(--text-muted)]" />
          </button>

          <button
            onClick={() => navigate("/measure/results")}
            className="w-full flex items-center gap-3 bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-2xl p-4 active:bg-[var(--bg-subtle)] shadow-sm"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0">
              <TrendingUp size={16} className="text-[var(--success)]" />
            </div>
            <div className="flex-1 text-left">
              <div className="text-[14px] font-semibold text-[var(--text-primary)]">Today's Measurements</div>
              <div className="text-[11px] text-[var(--text-muted)]">12 fittings recorded</div>
            </div>
            <ChevronRight size={16} className="text-[var(--text-muted)]" />
          </button>

          <button
            onClick={() => navigate("/frame-selection")}
            className="w-full flex items-center gap-3 bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-2xl p-4 active:bg-[var(--bg-subtle)] shadow-sm"
          >
            <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
              <Tag size={16} className="text-[var(--royal)]" />
            </div>
            <div className="flex-1 text-left">
              <div className="text-[14px] font-semibold text-[var(--text-primary)]">Price List</div>
              <div className="text-[11px] text-[var(--text-muted)]">Browse frame catalog</div>
            </div>
            <ChevronRight size={16} className="text-[var(--text-muted)]" />
          </button>
        </div>
      </div>
      <BottomNavigation />
    </AppScreen>
  );
}
