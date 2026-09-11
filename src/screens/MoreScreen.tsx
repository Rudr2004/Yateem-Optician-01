import { AppScreen } from "../components/ScreenContainer";
import { MobileHeader } from "../components/MobileHeader";
import { BottomNavigation } from "../components/BottomNavigation";
import { CV_PIPELINE_STAGES } from "../mockData";
import { ArrowDown, Info } from "lucide-react";

export function MoreScreen() {
  return (
    <AppScreen>
      <MobileHeader title="More" light />
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-4 space-y-4 animate-fade-slide-up">
        <div className="bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-2xl p-4 shadow-sm">
          <div className="text-[13px] font-bold text-[var(--text-primary)] mb-3">AI Measurement Pipeline</div>
          <div className="flex flex-col items-center gap-1">
            {CV_PIPELINE_STAGES.map((stage, i) => (
              <div key={stage} className="flex flex-col items-center gap-1 w-full">
                <div className="w-full text-center bg-blue-50 border border-[var(--royal)]/15 rounded-lg py-2 text-[12px] text-[var(--navy)] font-medium">
                  {stage}
                </div>
                {i < CV_PIPELINE_STAGES.length - 1 && (
                  <ArrowDown size={13} className="text-[var(--border-soft)]" />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-2xl p-4 shadow-sm">
          <div className="text-[13px] font-bold text-[var(--text-primary)] mb-2">Future Technology</div>
          <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed mb-3">
            The production platform may incorporate computer vision, facial landmark detection,
            segmentation, geometric computer vision, image processing and AR-based virtual
            try-on.
          </p>
          <div className="flex flex-wrap gap-2">
            {[
              "Computer Vision",
              "Facial Landmark Detection",
              "Segmentation",
              "Geometric CV",
              "Image Processing",
              "AR / Virtual Try-On",
            ].map((tag) => (
              <span
                key={tag}
                className="text-[10px] font-medium text-[var(--text-secondary)] bg-[var(--bg-subtle)] border border-[var(--border-soft)] rounded-full px-2.5 py-1"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="bg-blue-50 border border-[var(--royal)]/15 rounded-2xl p-4 flex gap-3">
          <Info size={16} className="text-[var(--royal)] flex-shrink-0 mt-0.5" />
          <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
            AI/CV processing shown in this POC is simulated. Production implementation will
            require validated computer-vision models, device calibration, reference
            measurements, accuracy testing and defined operating conditions.
          </p>
        </div>

        <div className="text-center text-[10px] text-[var(--text-muted)] pb-2">
          Yateem Optician Smart Fit · POC v0.1
        </div>
      </div>
      <BottomNavigation />
    </AppScreen>
  );
}
