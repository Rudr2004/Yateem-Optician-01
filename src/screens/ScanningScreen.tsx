import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, Circle, Loader2 } from "lucide-react";
import { AppScreen } from "../components/ScreenContainer";
import { MobileHeader } from "../components/MobileHeader";
import { CameraOverlay } from "../components/CameraOverlay";
import { ProgressIndicator } from "../components/ProgressIndicator";
import { SCANNING_STEPS } from "../mockData";
import { useAppState } from "../state/AppStateContext";

export function ScanningScreen() {
  const navigate = useNavigate();
  const { setMeasurementStatus, setAiScanProgress } = useAppState();
  const [progress, setProgress] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);
  const navigatedRef = useRef(false);

  useEffect(() => {
    setMeasurementStatus("scanning");
    const totalDuration = 2600;
    const intervalMs = 40;
    const steps = totalDuration / intervalMs;
    let count = 0;

    const interval = setInterval(() => {
      count += 1;
      const pct = Math.min(100, Math.round((count / steps) * 100));
      setProgress(pct);
      setAiScanProgress(pct);
      const newStepIndex = Math.min(
        SCANNING_STEPS.length - 1,
        Math.floor((pct / 100) * SCANNING_STEPS.length)
      );
      setStepIndex(newStepIndex);

      if (pct >= 100) {
        clearInterval(interval);
        if (!navigatedRef.current) {
          navigatedRef.current = true;
          setMeasurementStatus("complete");
          setTimeout(() => navigate("/measure/results"), 400);
        }
      }
    }, intervalMs);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AppScreen>
      <MobileHeader title="Analyzing Frame" />
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-4 space-y-4 animate-fade-slide-up">
        <CameraOverlay scanning />

        <ProgressIndicator progress={progress} />

        <div className="bg-white/[0.04] border border-white/8 rounded-2xl p-4 space-y-2.5">
          {SCANNING_STEPS.map((step, i) => {
            const state = i < stepIndex ? "done" : i === stepIndex ? "active" : "waiting";
            return (
              <div key={step.key} className="flex items-center justify-between">
                <span
                  className={`text-[13px] ${
                    state === "waiting" ? "text-slate-500" : "text-slate-100"
                  }`}
                >
                  {step.label}
                </span>
                {state === "done" && (
                  <span className="flex items-center gap-1 text-emerald-400 text-[11px] font-semibold">
                    <CheckCircle2 size={13} /> Complete
                  </span>
                )}
                {state === "active" && (
                  <span className="flex items-center gap-1 text-indigo-300 text-[11px] font-semibold">
                    <Loader2 size={13} className="animate-spin" /> Processing
                  </span>
                )}
                {state === "waiting" && (
                  <span className="flex items-center gap-1 text-slate-500 text-[11px] font-medium">
                    <Circle size={10} /> Waiting
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </AppScreen>
  );
}
