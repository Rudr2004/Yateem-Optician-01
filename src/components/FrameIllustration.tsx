import type { FrameShape } from "../types";

interface FrameIllustrationProps {
  shape: FrameShape;
  color: string;
  material: string;
  className?: string;
}

export function FrameIllustration({ shape, color, material, className = "" }: FrameIllustrationProps) {
  const isMetal = material === "Metal" || material === "Titanium";
  const strokeWidth = isMetal ? 3 : 6;
  const lensFill = "rgba(210, 226, 245, 0.35)";
  const lensStroke = "rgba(255,255,255,0.55)";

  return (
    <svg viewBox="0 0 220 100" className={className} fill="none">
      <defs>
        <linearGradient id={`lens-glare-${shape}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.5" />
          <stop offset="60%" stopColor="#ffffff" stopOpacity="0.05" />
        </linearGradient>
      </defs>

      {shape === "round" && (
        <g stroke={color} strokeWidth={strokeWidth} strokeLinejoin="round">
          <circle cx="62" cy="50" r="38" fill={lensFill} />
          <circle cx="158" cy="50" r="38" fill={lensFill} />
          <path d="M100 46 Q110 40 120 46" />
          <path d="M24 44 L4 36" strokeLinecap="round" />
          <path d="M196 44 L216 36" strokeLinecap="round" />
          <circle cx="62" cy="50" r="38" fill={`url(#lens-glare-${shape})`} stroke="none" />
          <circle cx="158" cy="50" r="38" fill={`url(#lens-glare-${shape})`} stroke="none" />
          <circle cx="62" cy="50" r="38" stroke={lensStroke} strokeWidth="1" fill="none" />
          <circle cx="158" cy="50" r="38" stroke={lensStroke} strokeWidth="1" fill="none" />
        </g>
      )}

      {shape === "rectangle" && (
        <g stroke={color} strokeWidth={strokeWidth} strokeLinejoin="round">
          <rect x="20" y="18" width="82" height="62" rx="14" fill={lensFill} />
          <rect x="118" y="18" width="82" height="62" rx="14" fill={lensFill} />
          <path d="M102 42 Q110 36 118 42" />
          <path d="M20 34 L2 24" strokeLinecap="round" />
          <path d="M200 34 L218 24" strokeLinecap="round" />
          <rect x="20" y="18" width="82" height="62" rx="14" fill={`url(#lens-glare-${shape})`} stroke="none" />
          <rect x="118" y="18" width="82" height="62" rx="14" fill={`url(#lens-glare-${shape})`} stroke="none" />
          <rect x="20" y="18" width="82" height="62" rx="14" stroke={lensStroke} strokeWidth="1" fill="none" />
          <rect x="118" y="18" width="82" height="62" rx="14" stroke={lensStroke} strokeWidth="1" fill="none" />
        </g>
      )}

      {shape === "cat-eye" && (
        <g stroke={color} strokeWidth={strokeWidth} strokeLinejoin="round">
          <path
            d="M24 55 Q18 25 62 20 Q100 17 100 46 Q100 72 66 76 Q30 80 24 55 Z"
            fill={lensFill}
          />
          <path
            d="M196 55 Q202 25 158 20 Q120 17 120 46 Q120 72 154 76 Q190 80 196 55 Z"
            fill={lensFill}
          />
          <path d="M100 40 Q110 34 120 40" />
          <path d="M24 42 L4 30" strokeLinecap="round" />
          <path d="M196 42 L216 30" strokeLinecap="round" />
        </g>
      )}
    </svg>
  );
}
