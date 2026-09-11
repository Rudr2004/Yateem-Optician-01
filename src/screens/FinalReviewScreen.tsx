import { useNavigate } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import { AppScreen } from "../components/ScreenContainer";
import { MobileHeader } from "../components/MobileHeader";
import { PrimaryButton, SecondaryButton } from "../components/Buttons";
import { ResultCard } from "../components/ResultCard";
import { GhostButton } from "../components/Buttons";
import { useAppState } from "../state/AppStateContext";

export function FinalReviewScreen() {
  const navigate = useNavigate();
  const { state } = useAppState();

  return (
    <AppScreen>
      <MobileHeader title="Final Review" showBack />
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-4 space-y-3 animate-fade-slide-up">
        <ResultCard
          title="Customer"
          right={<GhostButton onClick={() => navigate("/customer")}>EDIT</GhostButton>}
        >
          <div className="text-[14px] font-semibold text-white">{state.customer.name}</div>
          <div className="text-[11px] text-slate-400">{state.customer.customerId}</div>
        </ResultCard>

        <ResultCard
          title="Frame"
          right={<GhostButton onClick={() => navigate("/frame-selection")}>EDIT</GhostButton>}
        >
          <div className="text-[14px] font-semibold text-white">{state.selectedFrame?.name}</div>
          <div className="text-[11px] text-slate-400">
            {state.selectedFrame?.rimType} · A {state.selectedFrame?.frameA}mm · B{" "}
            {state.selectedFrame?.frameB}mm · DBL {state.selectedFrame?.dbl}mm
          </div>
        </ResultCard>

        <ResultCard
          title="AI Measurements"
          right={<GhostButton onClick={() => navigate("/measure/validation")}>EDIT</GhostButton>}
        >
          <div className="grid grid-cols-2 gap-y-1.5 text-[12px] text-slate-300">
            {state.measurements.slice(0, 6).map((m) => (
              <span key={m.key}>
                {m.name}: <span className="text-white font-medium">{m.single ?? m.right}{m.unit}</span>
              </span>
            ))}
          </div>
        </ResultCard>

        <ResultCard title="Lens" right={<GhostButton onClick={() => navigate("/lens")}>EDIT</GhostButton>}>
          <div className="text-[14px] font-semibold text-white">{state.lensType}</div>
        </ResultCard>

        <ResultCard
          title="Coatings"
          right={<GhostButton onClick={() => navigate("/coatings")}>EDIT</GhostButton>}
        >
          <div className="text-[13px] text-slate-300">
            {state.coatings.length ? state.coatings.join(", ") : "None selected"}
          </div>
        </ResultCard>

        <ResultCard
          title="Thickness"
          right={<GhostButton onClick={() => navigate("/thickness")}>EDIT</GhostButton>}
        >
          <div className="text-[13px] text-slate-300">
            {state.thicknessEstimate
              ? `${state.thicknessEstimate.centerThickness.toFixed(1)}mm center / ${state.thicknessEstimate.edgeThickness.toFixed(1)}mm edge`
              : "Not calculated"}
          </div>
        </ResultCard>

        <ResultCard title="Tint" right={<GhostButton onClick={() => navigate("/tint")}>EDIT</GhostButton>}>
          <div className="text-[13px] text-slate-300">
            {state.tint.color} — {state.tint.opacity}%
          </div>
        </ResultCard>

        <div className="bg-emerald-500/[0.08] border border-emerald-500/20 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <div className="text-[11px] text-slate-400 mb-0.5">Measurement Confidence</div>
            <div className="text-[20px] font-bold text-white">{state.aiConfidence}%</div>
          </div>
          <div className="flex items-center gap-1.5 text-emerald-400 text-[12px] font-semibold">
            <CheckCircle2 size={14} /> READY FOR LABORATORY
          </div>
        </div>
      </div>
      <div className="px-4 pb-[max(20px,env(safe-area-inset-bottom))] pt-2 flex-shrink-0 space-y-2">
        <SecondaryButton onClick={() => navigate("/measure/validation")}>EDIT</SecondaryButton>
        <PrimaryButton onClick={() => navigate("/report")}>GENERATE REPORT</PrimaryButton>
      </div>
    </AppScreen>
  );
}
