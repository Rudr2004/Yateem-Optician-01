import { useNavigate } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import { AppScreen } from "../components/ScreenContainer";
import { MobileHeader } from "../components/MobileHeader";
import { PrimaryButton } from "../components/Buttons";
import { MeasurementCard } from "../components/MeasurementCard";
import { useAppState } from "../state/AppStateContext";

export function MeasurementResultsScreen() {
  const navigate = useNavigate();
  const { state } = useAppState();

  return (
    <AppScreen>
      <MobileHeader title="Measurement Results" showBack />
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-4 space-y-4 animate-fade-slide-up">
        <div className="bg-emerald-500/[0.08] border border-emerald-500/20 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 size={16} className="text-emerald-400" />
            <span className="text-[13px] font-semibold text-emerald-400">Analysis Complete</span>
          </div>
          <div className="grid grid-cols-2 gap-y-1.5 text-[12px] text-slate-300">
            <span>✓ Face detected</span>
            <span>✓ Both pupils detected</span>
            <span>✓ Frame detected</span>
            <span>✓ Lens edges detected</span>
            <span>✓ Frame alignment</span>
            <span className="text-white font-semibold">Confidence: {state.aiConfidence}%</span>
          </div>
        </div>

        <div className="space-y-3">
          {state.measurements.map((m) => (
            <MeasurementCard
              key={m.key}
              measurement={m}
              onEdit={() => navigate("/measure/validation")}
            />
          ))}
        </div>

        <p className="text-[10px] text-slate-500 leading-relaxed">
          POC simulation — production accuracy requires validated computer-vision models,
          calibration and reference measurements. Tolerances shown are POC validation
          tolerances, not final clinical/product specifications.
        </p>
      </div>
      <div className="px-4 pb-[max(20px,env(safe-area-inset-bottom))] pt-2 flex-shrink-0">
        <PrimaryButton onClick={() => navigate("/measure/validation")}>
          CONTINUE TO VALIDATION
        </PrimaryButton>
      </div>
    </AppScreen>
  );
}
