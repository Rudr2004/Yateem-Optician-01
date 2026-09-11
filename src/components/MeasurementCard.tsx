import { Pencil, CheckCircle2, AlertTriangle, Info } from "lucide-react";
import { useState } from "react";
import type { MeasurementValue } from "../types";

interface MeasurementCardProps {
  measurement: MeasurementValue;
  onEdit?: () => void;
  definition?: string;
}

export function MeasurementCard({ measurement: m, onEdit, definition }: MeasurementCardProps) {
  const [showInfo, setShowInfo] = useState(false);
  const isReview = m.status === "review";
  const valueText =
    m.right !== undefined
      ? `${m.right.toFixed(1)} mm / ${m.left?.toFixed(1)} mm`
      : `${m.single} ${m.unit}`;

  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-2xl p-4 shadow-sm">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-1.5 pr-2">
          <div className="text-[13px] font-semibold text-[var(--text-primary)] leading-tight">{m.name}</div>
          {definition && (
            <button
              onClick={() => setShowInfo((v) => !v)}
              className="w-4 h-4 rounded-full bg-[var(--bg-subtle)] flex items-center justify-center flex-shrink-0"
            >
              <Info size={10} className="text-[var(--text-muted)]" />
            </button>
          )}
        </div>
        {onEdit && (
          <button
            onClick={onEdit}
            className="flex-shrink-0 w-7 h-7 rounded-full bg-[var(--bg-subtle)] flex items-center justify-center active:bg-[var(--border-soft)]"
          >
            <Pencil size={12} className="text-[var(--text-secondary)]" />
          </button>
        )}
      </div>
      {showInfo && definition && (
        <p className="text-[11px] text-[var(--text-secondary)] bg-[var(--bg-subtle)] rounded-lg px-2.5 py-2 mb-2.5 leading-relaxed">
          {definition}
        </p>
      )}
      <div className="text-[19px] font-bold text-[var(--text-primary)] mb-2.5 tracking-tight">{valueText}</div>
      <div className="flex items-center justify-between text-[11px] mb-2">
        <span className="text-[var(--text-muted)]">
          AI Confidence: <span className="text-[var(--text-primary)] font-semibold">{m.confidence}%</span>
        </span>
        <span className="text-[var(--text-muted)]">
          Tolerance: <span className="text-[var(--text-primary)] font-semibold">{m.tolerance}</span>
        </span>
      </div>
      <div
        className={`flex items-center gap-1.5 text-[11px] font-semibold ${
          isReview ? "text-[var(--warning)]" : "text-[var(--success)]"
        }`}
      >
        {isReview ? <AlertTriangle size={12} /> : <CheckCircle2 size={12} />}
        {isReview ? "Review recommended" : "Within tolerance"}
      </div>
    </div>
  );
}
