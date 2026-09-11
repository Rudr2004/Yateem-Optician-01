import type { ReactNode } from "react";

export function ResultCard({
  title,
  right,
  children,
  className = "",
}: {
  title?: string;
  right?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-2xl p-4 shadow-sm ${className}`}>
      {title && (
        <div className="flex items-center justify-between mb-2.5">
          <div className="text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wide">
            {title}
          </div>
          {right}
        </div>
      )}
      {children}
    </div>
  );
}
