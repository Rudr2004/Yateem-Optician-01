export function Logo({ size = 22, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <g stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" fill="none">
        <circle cx="21.5" cy="34" r="11.5" />
        <circle cx="42.5" cy="34" r="11.5" />
        <path d="M33 30.5c0-2.4 1.6-4 4.5-4" />
        <path d="M8 30.5c1.2-3.6 3.4-5.4 6-5.7" />
        <path d="M50.5 24.8c2.6.3 4.8 2.1 6 5.7" />
      </g>
      <circle cx="24.5" cy="30.5" r="2.6" fill="#5b8def" />
    </svg>
  );
}
