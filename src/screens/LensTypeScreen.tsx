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
      <MobileHeader title="Lens Type" subtitle="Step 6 of 7" showBack light />
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-4 space-y-3 animate-fade-slide-up">
        {LENS_TYPES.map(({ key, desc, icon: Icon }) => {
          const selected = state.lensType === key;
          return (
            <button
              key={key}
              onClick={() => setLensType(key)}
              className={`w-full text-left flex items-center gap-3 bg-[var(--bg-card)] border rounded-2xl p-4 shadow-sm ${
                selected ? "border-[var(--royal)] ring-1 ring-[var(--royal)]/25" : "border-[var(--border-soft)]"
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-[var(--royal)]/10 flex items-center justify-center flex-shrink-0">
                <Icon size={18} className="text-[var(--royal)]" />
              </div>
              <div className="flex-1">
                <div className="text-[14px] font-semibold text-[var(--text-primary)]">{key}</div>
                <div className="text-[11px] text-[var(--text-muted)] mt-0.5">{desc}</div>
              </div>
              {selected && <Check size={17} className="text-[var(--royal)] flex-shrink-0" />}
            </button>
          );
        })}
      </div>
      <div className="px-4 pb-[max(20px,env(safe-area-inset-bottom))] pt-2 flex-shrink-0 bg-[var(--bg-app)]">
        <PrimaryButton disabled={!state.lensType} onClick={() => navigate("/coatings")}>
          CONTINUE
        </PrimaryButton>
      </div>
    </AppScreen>
  );
}
