export function ProgressIndicator({ progress }: { progress: number }) {
  return (
    <div className="w-full">
      <div className="w-full h-2 bg-[var(--bg-subtle)] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[var(--royal)] to-[var(--accent)] transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="text-right text-[11px] text-[var(--text-secondary)] mt-1 font-semibold">
        {Math.round(progress)}%
      </div>
    </div>
  );
}

export function StepDots({ total, current }: { total: number; current: number }) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`h-1.5 rounded-full transition-all ${
            i === current
              ? "w-5 bg-[var(--royal)]"
              : i < current
              ? "w-1.5 bg-[var(--royal)]/40"
              : "w-1.5 bg-[var(--border-soft)]"
          }`}
        />
      ))}
    </div>
  );
}
