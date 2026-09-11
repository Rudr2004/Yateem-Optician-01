import type { ReactNode } from "react";

interface ScreenContainerProps {
  children: ReactNode;
  className?: string;
  noPadding?: boolean;
}

export function ScreenContainer({ children, className = "", noPadding }: ScreenContainerProps) {
  return (
    <div
      className={`flex-1 overflow-y-auto no-scrollbar animate-fade-slide-up ${
        noPadding ? "" : "px-4 py-4"
      } ${className}`}
    >
      {children}
    </div>
  );
}

export function AppScreen({ children }: { children: ReactNode }) {
  return <div className="w-full h-full flex flex-col bg-[var(--bg-app)]">{children}</div>;
}
