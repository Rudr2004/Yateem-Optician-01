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
      className={`${fullWidth ? "w-full" : ""} flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-semibold text-[14px] tracking-wide py-3.5 rounded-2xl shadow-lg shadow-indigo-900/40 active:scale-[0.98] transition-transform disabled:opacity-40 disabled:active:scale-100 ${className}`}
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
      className={`${fullWidth ? "w-full" : ""} flex items-center justify-center gap-2 bg-white/5 border border-white/10 text-white font-semibold text-[14px] py-3.5 rounded-2xl active:scale-[0.98] active:bg-white/10 transition-transform disabled:opacity-40 ${className}`}
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
      className={`${fullWidth ? "w-full" : ""} flex items-center justify-center gap-1.5 text-indigo-300 font-medium text-[13px] py-2 px-3 rounded-lg active:bg-white/5 transition-colors ${className}`}
    >
      {icon}
      {children}
    </button>
  );
}
