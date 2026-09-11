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
    <div className={`bg-white/[0.04] border border-white/8 rounded-2xl p-4 ${className}`}>
      {title && (
        <div className="flex items-center justify-between mb-2.5">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
            {title}
          </div>
          {right}
        </div>
      )}
      {children}
    </div>
  );
}
