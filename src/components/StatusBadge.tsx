import { CheckCircle2, AlertTriangle, Circle, Loader2 } from "lucide-react";

type StatusVariant = "ok" | "review" | "pending" | "processing" | "neutral";

interface StatusBadgeProps {
  variant: StatusVariant;
  children: React.ReactNode;
}

const VARIANT_STYLES: Record<StatusVariant, string> = {
  ok: "bg-[var(--success-bg)] text-[var(--success)] border-[var(--success)]/20",
  review: "bg-[var(--warning-bg)] text-[var(--warning)] border-[var(--warning)]/25",
  pending: "bg-[var(--bg-subtle)] text-[var(--text-muted)] border-[var(--border-soft)]",
  processing: "bg-blue-50 text-[var(--royal)] border-[var(--royal)]/20",
  neutral: "bg-[var(--bg-subtle)] text-[var(--text-secondary)] border-[var(--border-soft)]",
};

const VARIANT_ICON: Record<StatusVariant, React.ReactNode> = {
  ok: <CheckCircle2 size={12} />,
  review: <AlertTriangle size={12} />,
  pending: <Circle size={10} />,
  processing: <Loader2 size={12} className="animate-spin" />,
  neutral: null,
};

export function StatusBadge({ variant, children }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-semibold border ${VARIANT_STYLES[variant]}`}
    >
      {VARIANT_ICON[variant]}
      {children}
    </span>
  );
}
