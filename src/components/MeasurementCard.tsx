import { Pencil, CheckCircle2, AlertTriangle } from "lucide-react";
import type { MeasurementValue } from "../types";

interface MeasurementCardProps {
  measurement: MeasurementValue;
  onEdit?: () => void;
}

export function MeasurementCard({ measurement: m, onEdit }: MeasurementCardProps) {
  const isReview = m.status === "review";
  const valueText =
    m.right !== undefined
      ? `${m.right.toFixed(1)} mm / ${m.left?.toFixed(1)} mm`
      : `${m.single} ${m.unit}`;

  return (
    <div className="bg-white/[0.04] border border-white/8 rounded-2xl p-4">
      <div className="flex items-start justify-between mb-2">
        <div className="text-[13px] font-semibold text-white leading-tight pr-2">{m.name}</div>
        {onEdit && (
          <button
            onClick={onEdit}
            className="flex-shrink-0 w-7 h-7 rounded-full bg-white/5 flex items-center justify-center active:bg-white/10"
          >
            <Pencil size={12} className="text-slate-300" />
          </button>
        )}
      </div>
      <div className="text-[19px] font-bold text-white mb-2.5 tracking-tight">{valueText}</div>
      <div className="flex items-center justify-between text-[11px] mb-2">
        <span className="text-slate-400">
          AI Confidence: <span className="text-slate-200 font-semibold">{m.confidence}%</span>
        </span>
        <span className="text-slate-400">
          Tolerance: <span className="text-slate-200 font-semibold">{m.tolerance}</span>
        </span>
      </div>
      <div
        className={`flex items-center gap-1.5 text-[11px] font-medium ${
          isReview ? "text-amber-400" : "text-emerald-400"
        }`}
      >
        {isReview ? <AlertTriangle size={12} /> : <CheckCircle2 size={12} />}
        {isReview ? "Review recommended" : "Within tolerance"}
      </div>
    </div>
  );
}
