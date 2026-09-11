import { useNavigate } from "react-router-dom";
import { Check, Circle, Scan, Info } from "lucide-react";
import { AppScreen } from "../components/ScreenContainer";
import { MobileHeader } from "../components/MobileHeader";
import { PrimaryButton } from "../components/Buttons";
import { useAppState } from "../state/AppStateContext";

const CHECKLIST = [
  { label: "Frame selected", done: true },
  { label: "Monocular PD", done: false },
  { label: "Near PD", done: false },
  { label: "Fitting Height", done: false },
  { label: "Pantoscopic Tilt", done: false },
  { label: "Wrap Angle", done: false },
  { label: "Back Vertex Distance", done: false },
  { label: "Lens Diameter", done: false },
  { label: "Reading Distance", done: false },
  { label: "Frame A", done: false },
  { label: "Frame B", done: false },
  { label: "Frame C / DBL", done: false },
];

export function MeasurementIntroScreen() {
  const navigate = useNavigate();
  const { state } = useAppState();

  return (
    <AppScreen>
      <MobileHeader title="Frame Measurement" showBack />
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-4 space-y-4 animate-fade-slide-up">
        <p className="text-slate-400 text-[13px]">Let's capture the customer's frame fit.</p>

        <div className="bg-gradient-to-br from-indigo-600/15 to-[#0d1120] border border-indigo-500/20 rounded-3xl p-6 flex items-center justify-center">
          <div className="relative w-28 h-28 rounded-full bg-indigo-500/10 flex items-center justify-center">
            <Scan size={40} className="text-indigo-300" />
            <div className="absolute inset-0 rounded-full border-2 border-indigo-400/30 animate-pulse-ring" />
          </div>
        </div>

        {state.selectedFrame && (
          <div className="text-center text-[12px] text-slate-400">
            Frame: <span className="text-white font-medium">{state.selectedFrame.name}</span>
          </div>
        )}

        <div className="bg-white/[0.04] border border-white/8 rounded-2xl p-4">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-3">
            Measurement Checklist
          </div>
          <div className="grid grid-cols-1 gap-2.5">
            {CHECKLIST.map((item) => (
              <div key={item.label} className="flex items-center gap-2.5">
                {item.done ? (
                  <Check size={15} className="text-emerald-400 flex-shrink-0" />
                ) : (
                  <Circle size={13} className="text-slate-600 flex-shrink-0" />
                )}
                <span className={`text-[13px] ${item.done ? "text-white" : "text-slate-400"}`}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-indigo-500/[0.08] border border-indigo-500/20 rounded-2xl p-4 flex gap-3">
          <Info size={16} className="text-indigo-300 flex-shrink-0 mt-0.5" />
          <p className="text-[12px] text-slate-300 leading-relaxed">
            Camera-assisted measurement uses facial landmarks, eye/pupil detection, frame
            geometry and optical calculations.
          </p>
        </div>
      </div>
      <div className="px-4 pb-[max(20px,env(safe-area-inset-bottom))] pt-2 flex-shrink-0">
        <PrimaryButton onClick={() => navigate("/measure/camera")}>
          START CAMERA MEASUREMENT
        </PrimaryButton>
      </div>
    </AppScreen>
  );
}
