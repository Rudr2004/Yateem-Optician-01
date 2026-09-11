import { useNavigate } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import { AppScreen } from "../components/ScreenContainer";
import { MobileHeader } from "../components/MobileHeader";
import { PrimaryButton } from "../components/Buttons";
import { MeasurementCard } from "../components/MeasurementCard";
import { useAppState } from "../state/AppStateContext";
import { MEASUREMENT_DEFINITIONS } from "../mockData";
import { FACE_DETECTED } from "../assets/faceImages";

export function MeasurementResultsScreen() {
  const navigate = useNavigate();
  const { state } = useAppState();

  return (
    <AppScreen>
      <MobileHeader title="Measurement Results" subtitle="Step 5 of 7" showBack light />
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-4 space-y-4 animate-fade-slide-up">
        <div className="bg-[var(--success-bg)] border border-[var(--success)]/20 rounded-2xl p-4 flex gap-3">
          {FACE_DETECTED && (
            <img
              src={FACE_DETECTED}
              alt="Customer"
              className="w-14 h-14 rounded-xl object-cover flex-shrink-0 border border-white"
            />
          )}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 size={16} className="text-[var(--success)]" />
              <span className="text-[13px] font-bold text-[var(--success)]">Analysis Complete</span>
            </div>
            <div className="grid grid-cols-2 gap-y-1.5 text-[12px] text-[var(--text-secondary)]">
              <span>✓ Face detected</span>
              <span>✓ Both pupils detected</span>
              <span>✓ Frame detected</span>
              <span>✓ Lens edges detected</span>
              <span>✓ Frame alignment</span>
              <span className="text-[var(--text-primary)] font-semibold">
                Confidence: {state.aiConfidence}%
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {state.measurements.map((m) => (
            <MeasurementCard
              key={m.key}
              measurement={m}
              definition={MEASUREMENT_DEFINITIONS[m.key]}
              onEdit={() => navigate("/measure/validation")}
            />
          ))}
        </div>

        <p className="text-[10px] text-[var(--text-muted)] leading-relaxed">
          POC simulation — production accuracy requires validated computer-vision models,
          calibration and reference measurements. Tolerances shown are POC validation
          tolerances, not final clinical/product specifications.
        </p>
      </div>
      <div className="px-4 pb-[max(20px,env(safe-area-inset-bottom))] pt-2 flex-shrink-0 bg-[var(--bg-app)]">
        <PrimaryButton onClick={() => navigate("/measure/validation")}>
          CONTINUE TO VALIDATION
        </PrimaryButton>
      </div>
    </AppScreen>
  );
}
