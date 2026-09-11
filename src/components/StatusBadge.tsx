import { CheckCircle2, AlertTriangle, Circle, Loader2 } from "lucide-react";

type StatusVariant = "ok" | "review" | "pending" | "processing" | "neutral";

interface StatusBadgeProps {
  variant: StatusVariant;
  children: React.ReactNode;
}

const VARIANT_STYLES: Record<StatusVariant, string> = {
  ok: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  review: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  pending: "bg-slate-500/10 text-slate-400 border-slate-500/20",
  processing: "bg-indigo-500/10 text-indigo-300 border-indigo-500/20",
  neutral: "bg-white/5 text-slate-300 border-white/10",
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
      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-medium border ${VARIANT_STYLES[variant]}`}
    >
      {VARIANT_ICON[variant]}
      {children}
    </span>
  );
}
