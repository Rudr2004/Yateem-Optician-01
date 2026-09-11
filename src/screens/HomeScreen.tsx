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
        <div className="bg-gradient-to-br from-indigo-600/20 via-[#151b30] to-[#0d1120] border border-indigo-500/20 rounded-3xl p-5">
          <div className="w-10 h-10 rounded-2xl bg-indigo-500/15 flex items-center justify-center mb-3">
            <Camera size={18} className="text-indigo-300" />
          </div>
          <h2 className="text-white text-[17px] font-semibold mb-1.5">
            Ready for your next fitting?
          </h2>
          <p className="text-slate-400 text-[13px] leading-relaxed mb-4">
            Capture frame-fitting measurements and prepare a complete lens specification.
          </p>
          <PrimaryButton onClick={() => navigate("/customer")}>
            START NEW MEASUREMENT
          </PrimaryButton>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/[0.04] border border-white/8 rounded-2xl p-4">
            <div className="text-[11px] text-slate-400 mb-1">Today's Measurements</div>
            <div className="text-2xl font-bold text-white">12</div>
          </div>
          <div className="bg-white/[0.04] border border-white/8 rounded-2xl p-4">
            <div className="text-[11px] text-slate-400 mb-1">Completed</div>
            <div className="text-2xl font-bold text-emerald-400">9</div>
          </div>
        </div>
        <div className="bg-white/[0.04] border border-white/8 rounded-2xl p-4">
          <div className="text-[11px] text-slate-400 mb-1">Pending</div>
          <div className="text-2xl font-bold text-amber-400">3</div>
        </div>

        <div className="space-y-2.5">
          <button
            onClick={() => navigate("/measure/results")}
            className="w-full flex items-center gap-3 bg-white/[0.04] border border-white/8 rounded-2xl p-4 active:bg-white/[0.06]"
          >
            <div className="w-9 h-9 rounded-xl bg-blue-500/15 flex items-center justify-center flex-shrink-0">
              <Clock size={16} className="text-blue-300" />
            </div>
            <div className="flex-1 text-left">
              <div className="text-[14px] font-semibold text-white">Recent Measurements</div>
              <div className="text-[11px] text-slate-400">View past fittings</div>
            </div>
            <ChevronRight size={16} className="text-slate-500" />
          </button>

          <button
            onClick={() => navigate("/measure/results")}
            className="w-full flex items-center gap-3 bg-white/[0.04] border border-white/8 rounded-2xl p-4 active:bg-white/[0.06]"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-500/15 flex items-center justify-center flex-shrink-0">
              <TrendingUp size={16} className="text-emerald-300" />
            </div>
            <div className="flex-1 text-left">
              <div className="text-[14px] font-semibold text-white">Today's Measurements</div>
              <div className="text-[11px] text-slate-400">12 fittings recorded</div>
            </div>
            <ChevronRight size={16} className="text-slate-500" />
          </button>

          <button
            onClick={() => navigate("/frame-selection")}
            className="w-full flex items-center gap-3 bg-white/[0.04] border border-white/8 rounded-2xl p-4 active:bg-white/[0.06]"
          >
            <div className="w-9 h-9 rounded-xl bg-indigo-500/15 flex items-center justify-center flex-shrink-0">
              <Tag size={16} className="text-indigo-300" />
            </div>
            <div className="flex-1 text-left">
              <div className="text-[14px] font-semibold text-white">Price List</div>
              <div className="text-[11px] text-slate-400">Browse frame catalog</div>
            </div>
            <ChevronRight size={16} className="text-slate-500" />
          </button>
        </div>
      </div>
      <BottomNavigation />
    </AppScreen>
  );
}
