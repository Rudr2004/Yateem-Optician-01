import { CheckCircle2, Loader2, Circle } from "lucide-react";
import type { DetectionState } from "../types";

export function AIAnalysisPanel({ detections }: { detections: DetectionState[] }) {
  return (
    <div className="bg-white/[0.04] border border-white/8 rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[11px] font-semibold text-indigo-300 uppercase tracking-wider">
          AI Analysis
        </span>
        <span className="text-[9px] text-slate-500 font-medium">Simulated AI analysis</span>
      </div>
      <div className="space-y-2.5">
        {detections.map((d) => (
          <div key={d.label} className="flex items-center justify-between">
            <span className="text-[13px] text-slate-200">{d.label}</span>
            <div className="flex items-center gap-2">
              {d.confidence !== undefined && d.status === "done" && (
                <span className="text-[11px] font-semibold text-emerald-400">{d.confidence}%</span>
              )}
              {d.status === "done" && (
                <span className="flex items-center gap-1 text-emerald-400 text-[12px] font-medium">
                  <CheckCircle2 size={13} /> Detected
                </span>
              )}
              {d.status === "detecting" && (
                <span className="flex items-center gap-1 text-indigo-300 text-[12px] font-medium">
                  <Loader2 size={13} className="animate-spin" /> Analyzing...
                </span>
              )}
              {d.status === "pending" && (
                <span className="flex items-center gap-1 text-slate-500 text-[12px] font-medium">
                  <Circle size={11} /> Waiting
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
