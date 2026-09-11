import { useNavigate } from "react-router-dom";
import { Check, Glasses } from "lucide-react";
import { AppScreen } from "../components/ScreenContainer";
import { MobileHeader } from "../components/MobileHeader";
import { PrimaryButton } from "../components/Buttons";
import { useAppState } from "../state/AppStateContext";
import { MOCK_FRAMES } from "../mockData";

export function FrameSelectionScreen() {
  const navigate = useNavigate();
  const { state, setFrame } = useAppState();

  return (
    <AppScreen>
      <MobileHeader title="Select Frame" showBack />
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-4 space-y-3 animate-fade-slide-up">
        {MOCK_FRAMES.map((frame) => {
          const selected = state.selectedFrame?.id === frame.id;
          return (
            <button
              key={frame.id}
              onClick={() => setFrame(frame)}
              className={`w-full text-left bg-white/[0.04] border rounded-2xl p-4 transition-colors ${
                selected ? "border-indigo-400/60 bg-indigo-500/[0.08]" : "border-white/8"
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className="w-16 h-12 rounded-xl flex items-center justify-center flex-shrink-0 border border-white/10"
                  style={{ backgroundColor: `${frame.color}33` }}
                >
                  <Glasses size={22} style={{ color: frame.color }} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="text-[15px] font-semibold text-white">{frame.name}</div>
                    {selected && (
                      <span className="flex items-center gap-1 text-[11px] font-semibold text-indigo-300">
                        <Check size={13} /> Selected
                      </span>
                    )}
                  </div>
                  <div className="text-[12px] text-slate-400 mt-0.5">
                    {frame.rimType} · {frame.material}
                  </div>
                  <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-300">
                    <span>A: {frame.frameA} mm</span>
                    <span>B: {frame.frameB} mm</span>
                    <span>DBL: {frame.dbl} mm</span>
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
      <div className="px-4 pb-[max(20px,env(safe-area-inset-bottom))] pt-2 flex-shrink-0">
        <PrimaryButton
          disabled={!state.selectedFrame}
          onClick={() => navigate("/measure/intro")}
        >
          CONTINUE TO MEASUREMENT
        </PrimaryButton>
      </div>
    </AppScreen>
  );
}
