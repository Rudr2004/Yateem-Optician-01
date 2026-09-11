import { useNavigate } from "react-router-dom";
import { Check } from "lucide-react";
import { AppScreen } from "../components/ScreenContainer";
import { MobileHeader } from "../components/MobileHeader";
import { PrimaryButton } from "../components/Buttons";
import { useAppState } from "../state/AppStateContext";
import { COATING_OPTIONS } from "../mockData";

const DESCRIPTIONS: Record<string, string> = {
  "Anti-Reflective": "Reduces glare and reflections",
  "Blue-Light Filtering": "Filters digital screen blue light",
  "Night Driving": "Enhances contrast in low light",
  Polarized: "Reduces glare from reflective surfaces",
  "UV Protection": "Blocks harmful UV rays",
  "Scratch Resistant": "Extends lens durability",
};

export function CoatingsScreen() {
  const navigate = useNavigate();
  const { state, toggleCoating } = useAppState();

  return (
    <AppScreen>
      <MobileHeader title="Lens Coatings" showBack light />
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-4 space-y-3 animate-fade-slide-up">
        <p className="text-[12px] text-[var(--text-secondary)]">Select any additional coatings.</p>
        {COATING_OPTIONS.map((coating) => {
          const selected = state.coatings.includes(coating);
          return (
            <button
              key={coating}
              onClick={() => toggleCoating(coating)}
              className={`w-full text-left flex items-center gap-3 bg-[var(--bg-card)] border rounded-2xl p-4 shadow-sm ${
                selected ? "border-[var(--royal)] ring-1 ring-[var(--royal)]/25" : "border-[var(--border-soft)]"
              }`}
            >
              <div
                className={`w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 border ${
                  selected ? "bg-[var(--royal)] border-[var(--royal)]" : "border-[var(--border-soft)]"
                }`}
              >
                {selected && <Check size={13} className="text-white" />}
              </div>
              <div className="flex-1">
                <div className="text-[14px] font-semibold text-[var(--text-primary)]">{coating}</div>
                <div className="text-[11px] text-[var(--text-muted)] mt-0.5">{DESCRIPTIONS[coating]}</div>
              </div>
            </button>
          );
        })}
      </div>
      <div className="px-4 pb-[max(20px,env(safe-area-inset-bottom))] pt-2 flex-shrink-0 bg-[var(--bg-app)]">
        <PrimaryButton onClick={() => navigate("/thickness")}>CONTINUE</PrimaryButton>
      </div>
    </AppScreen>
  );
}
