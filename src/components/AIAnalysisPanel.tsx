import { CheckCircle2, Loader2, Circle } from "lucide-react";
import type { DetectionState } from "../types";

export function AIAnalysisPanel({
  detections,
  dark = false,
}: {
  detections: DetectionState[];
  dark?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl p-4 border ${
        dark
          ? "bg-white/[0.05] border-white/10"
          : "bg-[var(--bg-card)] border-[var(--border-soft)] shadow-sm"
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <span
          className={`text-[11px] font-bold uppercase tracking-wider ${
            dark ? "text-blue-300" : "text-[var(--royal)]"
          }`}
        >
          AI Analysis
        </span>
        <span className={`text-[9px] font-medium ${dark ? "text-slate-500" : "text-[var(--text-muted)]"}`}>
          Simulated AI analysis
        </span>
      </div>
      <div className="space-y-2.5">
        {detections.map((d) => (
          <div key={d.label} className="flex items-center justify-between">
            <span className={`text-[13px] ${dark ? "text-slate-100" : "text-[var(--text-primary)]"}`}>
              {d.label}
            </span>
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
                <span
                  className={`flex items-center gap-1 text-[12px] font-medium ${
                    dark ? "text-blue-300" : "text-[var(--royal)]"
                  }`}
                >
                  <Loader2 size={13} className="animate-spin" /> Analyzing...
                </span>
              )}
              {d.status === "pending" && (
                <span
                  className={`flex items-center gap-1 text-[12px] font-medium ${
                    dark ? "text-slate-500" : "text-[var(--text-muted)]"
                  }`}
                >
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
