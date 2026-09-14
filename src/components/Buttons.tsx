import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  fullWidth?: boolean;
  icon?: ReactNode;
}

export function PrimaryButton({ children, fullWidth = true, icon, className = "", ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className={`${fullWidth ? "w-full" : ""} flex items-center justify-center gap-2 bg-gradient-to-r from-[var(--royal)] to-[var(--royal-light)] text-white font-semibold text-[14px] tracking-wide py-3.5 rounded-2xl shadow-[0_8px_20px_-6px_rgba(30,64,175,0.45)] active:scale-[0.98] transition-transform disabled:opacity-40 disabled:active:scale-100 ${className}`}
    >
      {icon}
      {children}
    </button>
  );
}

export function SecondaryButton({ children, fullWidth = true, icon, className = "", ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className={`${fullWidth ? "w-full" : ""} flex items-center justify-center gap-2 bg-[var(--bg-card)] border border-[var(--border-soft)] text-[var(--text-primary)] font-semibold text-[14px] py-3.5 rounded-2xl active:scale-[0.98] active:bg-[var(--bg-subtle)] transition-transform disabled:opacity-40 shadow-sm ${className}`}
    >
      {icon}
      {children}
    </button>
  );
}

export function GhostButton({ children, fullWidth = false, icon, className = "", ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className={`${fullWidth ? "w-full" : ""} flex items-center justify-center gap-1.5 text-[var(--royal)] font-semibold text-[12px] py-2 px-3 rounded-lg active:bg-[var(--bg-subtle)] transition-colors ${className}`}
    >
      {icon}
      {children}
    </button>
  );
}
