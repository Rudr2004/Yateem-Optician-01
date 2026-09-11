import { useNavigate } from "react-router-dom";
import { Check, Eye, Layers, Sun, Monitor } from "lucide-react";
import { AppScreen } from "../components/ScreenContainer";
import { MobileHeader } from "../components/MobileHeader";
import { PrimaryButton } from "../components/Buttons";
import { useAppState } from "../state/AppStateContext";
import type { LensType } from "../types";

const LENS_TYPES: { key: LensType; desc: string; icon: typeof Eye }[] = [
  { key: "Single Vision", desc: "Standard correction for one field of vision", icon: Eye },
  { key: "Progressive", desc: "Seamless correction for near, mid and far vision", icon: Layers },
  { key: "Anti-Fatigue", desc: "Reduces digital eye strain for everyday wear", icon: Sun },
  { key: "Computer", desc: "Optimized for screen and mid-range distance", icon: Monitor },
];

export function LensTypeScreen() {
  const navigate = useNavigate();
  const { state, setLensType } = useAppState();

  return (
    <AppScreen>
      <MobileHeader title="Lens Type" showBack />
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-4 space-y-3 animate-fade-slide-up">
        {LENS_TYPES.map(({ key, desc, icon: Icon }) => {
          const selected = state.lensType === key;
          return (
            <button
              key={key}
              onClick={() => setLensType(key)}
              className={`w-full text-left flex items-center gap-3 bg-white/[0.04] border rounded-2xl p-4 ${
                selected ? "border-indigo-400/60 bg-indigo-500/[0.08]" : "border-white/8"
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-500/15 flex items-center justify-center flex-shrink-0">
                <Icon size={18} className="text-indigo-300" />
              </div>
              <div className="flex-1">
                <div className="text-[14px] font-semibold text-white">{key}</div>
                <div className="text-[11px] text-slate-400 mt-0.5">{desc}</div>
              </div>
              {selected && <Check size={17} className="text-indigo-300 flex-shrink-0" />}
            </button>
          );
        })}
      </div>
      <div className="px-4 pb-[max(20px,env(safe-area-inset-bottom))] pt-2 flex-shrink-0">
        <PrimaryButton disabled={!state.lensType} onClick={() => navigate("/coatings")}>
          CONTINUE
        </PrimaryButton>
      </div>
    </AppScreen>
  );
}
