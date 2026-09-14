import { useNavigate } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import { AppScreen } from "../components/ScreenContainer";
import { MobileHeader } from "../components/MobileHeader";
import { PrimaryButton } from "../components/Buttons";
import { ResultCard } from "../components/ResultCard";
import { useAppState } from "../state/AppStateContext";

export function FinalReviewScreen() {
  const navigate = useNavigate();
  const { state } = useAppState();

  return (
    <AppScreen>
      <MobileHeader title="Final Review" showBack light />
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-4 space-y-3 animate-fade-slide-up">
        <ResultCard title="Customer">
          <div className="text-[14px] font-semibold text-[var(--text-primary)]">{state.customer.name}</div>
          <div className="text-[11px] text-[var(--text-muted)]">{state.customer.customerId}</div>
        </ResultCard>

        <ResultCard title="Frame">
          <div className="text-[14px] font-semibold text-[var(--text-primary)]">
            {state.selectedFrame?.name}
          </div>
          <div className="text-[11px] text-[var(--text-muted)]">
            {state.selectedFrame?.rimType} · A {state.selectedFrame?.frameA}mm · B{" "}
            {state.selectedFrame?.frameB}mm · DBL {state.selectedFrame?.dbl}mm
          </div>
        </ResultCard>

        <ResultCard title="AI Measurements">
          <div className="grid grid-cols-2 gap-y-1.5 text-[12px] text-[var(--text-secondary)]">
            {state.measurements.map((m) => (
              <span key={m.key}>
                {m.name}:{" "}
                <span className="text-[var(--text-primary)] font-medium">
                  {m.single ?? m.right}
                  {m.unit}
                </span>
              </span>
            ))}
          </div>
        </ResultCard>

        <ResultCard title="Lens">
          <div className="text-[14px] font-semibold text-[var(--text-primary)]">
            {state.lensType ?? "Not selected"}
          </div>
          <div className="text-[11px] text-[var(--text-muted)] mt-0.5">
            Index {state.lensIndex}
          </div>
        </ResultCard>

        <ResultCard title="Coatings">
          {state.coatings.length ? (
            <div className="flex flex-wrap gap-1.5">
              {state.coatings.map((c) => (
                <span
                  key={c}
                  className="text-[11px] font-medium text-[var(--royal)] bg-blue-50 border border-[var(--royal)]/15 rounded-full px-2.5 py-1"
                >
                  {c}
                </span>
              ))}
            </div>
          ) : (
            <div className="text-[13px] text-[var(--text-secondary)]">None selected</div>
          )}
        </ResultCard>

        <ResultCard title="Thickness">
          {state.thicknessEstimate ? (
            <>
              <div className="grid grid-cols-2 gap-y-1.5 text-[12px] text-[var(--text-secondary)]">
                <span>
                  Center:{" "}
                  <span className="text-[var(--text-primary)] font-medium">
                    {state.thicknessEstimate.centerThickness.toFixed(1)}mm
                  </span>
                </span>
                <span>
                  Edge:{" "}
                  <span className="text-[var(--text-primary)] font-medium">
                    {state.thicknessEstimate.edgeThickness.toFixed(1)}mm
                  </span>
                </span>
                <span>
                  Sphere:{" "}
                  <span className="text-[var(--text-primary)] font-medium">
                    {state.thicknessInputs.sphere}D
                  </span>
                </span>
                <span>
                  Cylinder:{" "}
                  <span className="text-[var(--text-primary)] font-medium">
                    {state.thicknessInputs.cylinder}D
                  </span>
                </span>
                <span>
                  Axis:{" "}
                  <span className="text-[var(--text-primary)] font-medium">
                    {state.thicknessInputs.axis}°
                  </span>
                </span>
                <span>
                  Recommended:{" "}
                  <span className="text-[var(--text-primary)] font-medium">
                    {state.thicknessEstimate.recommendedIndex} Index
                  </span>
                </span>
              </div>
            </>
          ) : (
            <div className="text-[13px] text-[var(--text-secondary)]">Not calculated</div>
          )}
        </ResultCard>

        <ResultCard title="Tint">
          <div className="text-[13px] text-[var(--text-secondary)]">
            {state.tint.color} — {state.tint.opacity}%
          </div>
        </ResultCard>

        <div className="bg-[var(--success-bg)] border border-[var(--success)]/20 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <div className="text-[11px] text-[var(--text-muted)] mb-0.5">Measurement Confidence</div>
            <div className="text-[20px] font-bold text-[var(--text-primary)]">{state.aiConfidence}%</div>
          </div>
          <div className="flex items-center gap-1.5 text-[var(--success)] text-[12px] font-semibold">
            <CheckCircle2 size={14} /> READY FOR LABORATORY
          </div>
        </div>
      </div>
      <div className="px-4 pb-[max(20px,env(safe-area-inset-bottom))] pt-2 flex-shrink-0 bg-[var(--bg-app)]">
        <PrimaryButton onClick={() => navigate("/report")}>GENERATE REPORT</PrimaryButton>
      </div>
    </AppScreen>
  );
}
