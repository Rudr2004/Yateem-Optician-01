function levelOf(confidence: number): "high" | "medium" | "low" {
  if (confidence >= 95) return "high";
  if (confidence >= 85) return "medium";
  return "low";
}

const LEVEL_COLOR: Record<string, string> = {
  high: "bg-[var(--success)]",
  medium: "bg-[var(--warning)]",
  low: "bg-[var(--danger)]",
};

const LEVEL_TEXT: Record<string, string> = {
  high: "text-[var(--success)]",
  medium: "text-[var(--warning)]",
  low: "text-[var(--danger)]",
};

export function ConfidenceIndicator({
  confidence,
  label = "AI Confidence",
  compact = false,
}: {
  confidence: number;
  label?: string;
  compact?: boolean;
}) {
  const level = levelOf(confidence);

  if (compact) {
    return (
      <div className="flex items-center gap-1.5">
        <span className={`w-1.5 h-1.5 rounded-full ${LEVEL_COLOR[level]}`} />
        <span className={`text-[12px] font-semibold ${LEVEL_TEXT[level]}`}>{confidence}%</span>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-[11px] text-[var(--text-secondary)]">{label}</span>
        <span className={`text-[12px] font-semibold ${LEVEL_TEXT[level]}`}>{confidence}%</span>
      </div>
      <div className="w-full h-1.5 bg-[var(--bg-subtle)] rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${LEVEL_COLOR[level]} transition-all duration-700`}
          style={{ width: `${confidence}%` }}
        />
      </div>
    </div>
  );
}
