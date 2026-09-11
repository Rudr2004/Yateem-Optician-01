import { useNavigate } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import { AppScreen } from "../components/ScreenContainer";
import { PrimaryButton, SecondaryButton } from "../components/Buttons";
import { useAppState } from "../state/AppStateContext";

export function SuccessScreen() {
  const navigate = useNavigate();
  const { state, resetFlow } = useAppState();

  return (
    <AppScreen>
      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center animate-fade-slide-up">
        <div className="w-20 h-20 rounded-full bg-emerald-500/15 flex items-center justify-center mb-5 animate-glow-pulse">
          <CheckCircle2 size={40} className="text-emerald-400" />
        </div>
        <h2 className="text-white text-[19px] font-bold mb-2">Measurement Complete</h2>
        <p className="text-slate-400 text-[13px] mb-6 leading-relaxed">
          Measurement report prepared successfully.
        </p>
        <div className="bg-white/[0.04] border border-white/8 rounded-2xl px-5 py-3 mb-2">
          <div className="text-[10px] text-slate-400">Measurement ID</div>
          <div className="text-[14px] font-semibold text-white">{state.measurementId}</div>
        </div>
      </div>
      <div className="px-4 pb-[max(20px,env(safe-area-inset-bottom))] pt-2 flex-shrink-0 space-y-2">
        <SecondaryButton onClick={() => navigate("/report")}>VIEW REPORT</SecondaryButton>
        <PrimaryButton
          onClick={() => {
            resetFlow();
            navigate("/");
          }}
        >
          NEW MEASUREMENT
        </PrimaryButton>
      </div>
    </AppScreen>
  );
}
