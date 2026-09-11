import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Camera, Info } from "lucide-react";
import { AppScreen } from "../components/ScreenContainer";
import { MobileHeader } from "../components/MobileHeader";
import { PrimaryButton } from "../components/Buttons";
import { CameraOverlay } from "../components/CameraOverlay";
import { AIAnalysisPanel } from "../components/AIAnalysisPanel";
import { BottomSheet } from "../components/BottomSheet";
import { CAMERA_INSTRUCTIONS } from "../mockData";
import type { DetectionState } from "../types";

const BASE_DETECTIONS: DetectionState[] = [
  { label: "Face", status: "done", confidence: 98 },
  { label: "Eyes", status: "done", confidence: 97 },
  { label: "Pupils", status: "done", confidence: 96 },
  { label: "Frame", status: "done", confidence: 95 },
  { label: "Lens Edges", status: "done", confidence: 94 },
  { label: "Geometry", status: "detecting" },
];

export function CameraMeasurementScreen() {
  const navigate = useNavigate();
  const [instructionIndex, setInstructionIndex] = useState(0);
  const [infoOpen, setInfoOpen] = useState(false);

  useEffect(() => {
    if (instructionIndex >= CAMERA_INSTRUCTIONS.length - 1) return;
    const t = setTimeout(() => setInstructionIndex((i) => i + 1), 1400);
    return () => clearTimeout(t);
  }, [instructionIndex]);

  const ready = instructionIndex === CAMERA_INSTRUCTIONS.length - 1;

  return (
    <AppScreen>
      <MobileHeader
        title="AI Frame Analysis"
        showBack
        right={
          <button
            onClick={() => setInfoOpen(true)}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 active:bg-white/10"
          >
            <Info size={15} className="text-slate-300" />
          </button>
        }
      />
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-4 space-y-4 animate-fade-slide-up">
        <div className="flex items-center gap-2">
          <span className="relative flex w-2 h-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
          </span>
          <span className="text-[11px] font-semibold text-red-400 tracking-wide">LIVE CAMERA</span>
        </div>

        <CameraOverlay />

        <div className="bg-white/[0.04] border border-white/8 rounded-xl px-4 py-3 text-center">
          <p className="text-[13px] text-indigo-200 font-medium transition-all">
            {CAMERA_INSTRUCTIONS[instructionIndex]}
          </p>
        </div>

        <AIAnalysisPanel detections={BASE_DETECTIONS} />

        <div className="grid grid-cols-2 gap-2.5">
          {[
            { label: "Face Detection", value: 98 },
            { label: "Eye Detection", value: 97 },
            { label: "Frame Detection", value: 95 },
            { label: "Pupil Detection", value: 96 },
          ].map((d) => (
            <div key={d.label} className="bg-white/[0.04] border border-white/8 rounded-xl p-3">
              <div className="text-[10px] text-slate-400 mb-1">{d.label}</div>
              <div className="text-[16px] font-bold text-emerald-400">{d.value}%</div>
            </div>
          ))}
        </div>
        <div className="text-center text-[10px] text-slate-500">AI/CV POC</div>
      </div>
      <div className="px-4 pb-[max(20px,env(safe-area-inset-bottom))] pt-2 flex-shrink-0">
        <PrimaryButton
          disabled={!ready}
          icon={<Camera size={17} />}
          onClick={() => navigate("/measure/scanning")}
        >
          CAPTURE MEASUREMENT
        </PrimaryButton>
      </div>

      <BottomSheet open={infoOpen} onClose={() => setInfoOpen(false)} title="How Smart Fit Measures">
        <div className="space-y-3 max-h-[50vh] overflow-y-auto no-scrollbar">
          {[
            ["Face Detection", "Identifies the customer's face position."],
            ["Facial Landmarks", "Tracks key facial reference points."],
            ["Eye & Pupil Detection", "Identifies eye and pupil centers."],
            ["Frame Detection", "Identifies the optical frame boundaries."],
            ["Lens Edge Detection", "Estimates lens boundaries."],
            ["Geometric Analysis", "Uses detected reference points to calculate optical parameters."],
            ["Measurement Validation", "Checks measurements against configured tolerances."],
          ].map(([title, desc]) => (
            <div key={title} className="border-b border-white/5 pb-3 last:border-0">
              <div className="text-[13px] font-semibold text-white">{title}</div>
              <div className="text-[12px] text-slate-400 mt-0.5">{desc}</div>
            </div>
          ))}
          <p className="text-[11px] text-slate-500 leading-relaxed pt-1">
            This is a POC representation of the intended AI/CV architecture. AI/CV processing
            shown in this POC is simulated. Production implementation will require validated
            computer-vision models, device calibration, reference measurements, accuracy testing
            and defined operating conditions.
          </p>
        </div>
      </BottomSheet>
    </AppScreen>
  );
}
